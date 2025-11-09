import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Gavel, Clock, MapPin, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Auctions() {
  const { t, language } = useLanguage();
  const [categoryFilter, setCategoryFilter] = useState<number | undefined>();
  const [locationFilter, setLocationFilter] = useState<number | undefined>();

  const { data: auctions, isLoading } = trpc.auction.search.useQuery({
    categoryId: categoryFilter,
    locationId: locationFilter,
    status: 'active',
  });

  const { data: categories } = trpc.category.getAll.useQuery();
  const { data: locations } = trpc.location.getAll.useQuery();

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
    }).format(cents / 100);
  };

  const formatTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    
    if (diff < 0) return t("Ended", "انتهى");
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}${t("d", "ي")} ${hours}${t("h", "س")}`;
    }
    if (hours > 0) {
      return `${hours}${t("h", "س")} ${minutes}${t("m", "د")}`;
    }
    return `${minutes}${t("m", "د")}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {t("Active Auctions", "المزادات النشطة")}
          </h1>
          <p className="text-muted-foreground">
            {t("Browse all active auctions and place your bids", "تصفح جميع المزادات النشطة وقدم عروضك")}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card border rounded-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5" />
            <h2 className="font-semibold">{t("Filters", "التصفية")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t("Category", "الفئة")}
              </label>
              <Select
                value={categoryFilter?.toString()}
                onValueChange={(value) => setCategoryFilter(value === "all" ? undefined : Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("All Categories", "جميع الفئات")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("All Categories", "جميع الفئات")}</SelectItem>
                  {categories?.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {language === 'ar' ? cat.nameAr : cat.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                {t("Location", "الموقع")}
              </label>
              <Select
                value={locationFilter?.toString()}
                onValueChange={(value) => setLocationFilter(value === "all" ? undefined : Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("All Locations", "جميع المواقع")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("All Locations", "جميع المواقع")}</SelectItem>
                  {locations?.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id.toString()}>
                      {loc.city}, {loc.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setCategoryFilter(undefined);
                  setLocationFilter(undefined);
                }}
              >
                {t("Clear Filters", "مسح التصفية")}
              </Button>
            </div>
          </div>
        </div>

        {/* Auctions Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : auctions && auctions.length > 0 ? (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              {t(`Showing ${auctions.length} auctions`, `عرض ${auctions.length} مزاد`)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {auctions.map((auction) => (
                <Card key={auction.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                    <Gavel className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <CardHeader>
                    <h3 className="font-semibold line-clamp-2 text-lg">
                      {language === 'ar' ? auction.titleAr : auction.titleEn}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{formatTimeRemaining(new Date(auction.endTime))}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {t("Current Bid", "المزايدة الحالية")}
                      </span>
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(auction.currentPrice)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">
                        {t("Location", "الموقع")}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`/auction/${auction.id}`}>
                        {t("View Details & Bid", "عرض التفاصيل والمزايدة")}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Gavel className="h-20 w-20 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">
              {t("No auctions found", "لم يتم العثور على مزادات")}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t("Try adjusting your filters or check back later", "حاول تعديل التصفية أو تحقق لاحقًا")}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setCategoryFilter(undefined);
                setLocationFilter(undefined);
              }}
            >
              {t("Clear Filters", "مسح التصفية")}
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
