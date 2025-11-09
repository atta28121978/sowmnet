import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Gavel, Heart, TrendingUp, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { t, language } = useLanguage();
  const { isAuthenticated, loading } = useAuth();

  const { data: myBids, isLoading: bidsLoading } = trpc.bid.getMy.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const { data: myAuctions, isLoading: auctionsLoading } = trpc.auction.getMy.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const { data: watchlist, isLoading: watchlistLoading } = trpc.watchlist.getMy.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [isAuthenticated, loading]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container py-8 flex-1">
          <Skeleton className="h-96 w-full" />
        </div>
        <Footer />
      </div>
    );
  }

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
    }).format(cents / 100);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t("Dashboard", "لوحة التحكم")}</h1>
          <p className="text-muted-foreground">
            {t("Manage your bids, auctions, and watchlist", "إدارة مزايداتك ومزاداتك وقائمة المراقبة")}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("Active Bids", "المزايدات النشطة")}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bidsLoading ? <Skeleton className="h-8 w-16" /> : myBids?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("My Auctions", "مزاداتي")}
              </CardTitle>
              <Gavel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {auctionsLoading ? <Skeleton className="h-8 w-16" /> : myAuctions?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("Watchlist", "قائمة المراقبة")}
              </CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {watchlistLoading ? <Skeleton className="h-8 w-16" /> : watchlist?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("Winnings", "الفوز")}
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("Quick Actions", "إجراءات سريعة")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/sell">
                  <Gavel className="mr-2 h-4 w-4" />
                  {t("Sell an Item", "بيع عنصر")}
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/auctions">
                  {t("Browse Auctions", "تصفح المزادات")}
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/my-bids">
                  {t("View My Bids", "عرض مزايداتي")}
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("Recent Activity", "النشاط الأخير")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                {t("No recent activity", "لا يوجد نشاط حديث")}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
