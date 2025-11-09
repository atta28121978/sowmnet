import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Gavel, Clock, MapPin, TrendingUp, Shield, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { t, language } = useLanguage();
  const { data: activeAuctions, isLoading } = trpc.auction.getActive.useQuery();
  const { data: categories } = trpc.category.getAll.useQuery();

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
    
    if (days > 0) {
      return `${days}${t("d", "ي")} ${hours}${t("h", "س")}`;
    }
    return `${hours}${t("h", "س")}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-background py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              {t(
                "Discover Premium Auctions",
                "اكتشف المزادات المميزة"
              )}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t(
                "The leading platform for heavy machinery, construction equipment, and industrial auctions in the Middle East.",
                "المنصة الرائدة للآلات الثقيلة ومعدات البناء والمزادات الصناعية في الشرق الأوسط."
              )}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" asChild>
                <Link href="/auctions">
                  <Gavel className="mr-2 h-5 w-5" />
                  {t("Browse Auctions", "تصفح المزادات")}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/sell">
                  {t("Sell an Item", "بيع عنصر")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("Why Choose Sowmnet?", "لماذا تختار سومنت؟")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold">
                  {t("Secure Transactions", "معاملات آمنة")}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t(
                    "All auctions are verified and monitored to ensure safe and transparent transactions.",
                    "يتم التحقق من جميع المزادات ومراقبتها لضمان معاملات آمنة وشفافة."
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold">
                  {t("Best Prices", "أفضل الأسعار")}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t(
                    "Competitive bidding ensures you get the best value for premium equipment.",
                    "المزايدة التنافسية تضمن لك الحصول على أفضل قيمة للمعدات المميزة."
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold">
                  {t("Trusted Community", "مجتمع موثوق")}
                </h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {t(
                    "Join thousands of verified buyers and sellers across the Middle East.",
                    "انضم إلى آلاف المشترين والبائعين الموثقين في جميع أنحاء الشرق الأوسط."
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Active Auctions */}
      <section className="py-16">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              {t("Active Auctions", "المزادات النشطة")}
            </h2>
            <Button variant="outline" asChild>
              <Link href="/auctions">
                {t("View All", "عرض الكل")}
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
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
          ) : activeAuctions && activeAuctions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {activeAuctions.slice(0, 6).map((auction) => (
                <Card key={auction.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                    <Gavel className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <CardHeader>
                    <h3 className="font-semibold line-clamp-2">
                      {language === 'ar' ? auction.titleAr : auction.titleEn}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {formatTimeRemaining(new Date(auction.endTime))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          {t("Current Bid", "المزايدة الحالية")}
                        </span>
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(auction.currentPrice)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href={`/auction/${auction.id}`}>
                        {t("View Details", "عرض التفاصيل")}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Gavel className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>{t("No active auctions at the moment", "لا توجد مزادات نشطة في الوقت الحالي")}</p>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("Browse by Category", "تصفح حسب الفئة")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories?.map((category) => (
              <Link key={category.id} href={`/category/${category.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold">
                      {language === 'ar' ? category.nameAr : category.nameEn}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
