import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Eye, Clock, TrendingUp } from "lucide-react";

export default function MyAuctions() {
  const { t, language } = useLanguage();
  const { isAuthenticated, loading } = useAuth();

  const { data: auctions, isLoading } = trpc.auction.getMy.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [isAuthenticated, loading]);

  if (loading || !isAuthenticated) {
    return null;
  }

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
    }).format(cents / 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'pending_approval':
        return 'secondary';
      case 'ended_sold':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { en: string; ar: string }> = {
      draft: { en: 'Draft', ar: 'مسودة' },
      pending_approval: { en: 'Pending Approval', ar: 'قيد المراجعة' },
      active: { en: 'Active', ar: 'نشط' },
      ended_no_bids: { en: 'Ended - No Bids', ar: 'انتهى - بدون مزايدات' },
      ended_sold: { en: 'Sold', ar: 'مباع' },
      ended_not_sold: { en: 'Ended - Not Sold', ar: 'انتهى - غير مباع' },
      cancelled: { en: 'Cancelled', ar: 'ملغى' },
    };
    return language === 'ar' ? labels[status]?.ar : labels[status]?.en;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8 flex-1">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t("My Auctions", "مزاداتي")}</h1>
            <p className="text-muted-foreground">
              {t("Manage your auction listings", "إدارة قوائم المزادات الخاصة بك")}
            </p>
          </div>
          <Button asChild>
            <Link href="/sell">{t("Create New Auction", "إنشاء مزاد جديد")}</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : auctions && auctions.length > 0 ? (
          <div className="space-y-4">
            {auctions.map((auction) => (
              <Card key={auction.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        {language === 'ar' ? auction.titleAr : auction.titleEn}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{auction.viewCount} {t("views", "مشاهدة")}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {t("Ends", "ينتهي")} {new Date(auction.endTime).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(auction.status)}>
                      {getStatusLabel(auction.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">
                        {t("Current Bid", "المزايدة الحالية")}
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {formatPrice(auction.currentPrice)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t("Starting Price:", "السعر الابتدائي:")} {formatPrice(auction.startingPrice)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" asChild>
                        <Link href={`/auction/${auction.id}`}>
                          {t("View", "عرض")}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">
                {t("No auctions yet", "لا توجد مزادات بعد")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t("Start selling by creating your first auction", "ابدأ البيع بإنشاء مزادك الأول")}
              </p>
              <Button asChild>
                <Link href="/sell">{t("Create Auction", "إنشاء مزاد")}</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
