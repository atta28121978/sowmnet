import { useLanguage } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Clock, CheckCircle, X } from "lucide-react";
import { useLocation } from "wouter";

export default function MyBids() {
  const { t, language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const { data: bidsData, isLoading } = trpc.bid.getMy.useQuery(
    undefined,
    { enabled: !!user?.id }
  );

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
    }).format(cents / 100);
  };

  const getBidStatus = (auction: any, bid: any) => {
    const now = new Date();
    const auctionEnded = new Date(auction.endTime) < now;

    if (!auctionEnded) {
      return {
        status: 'active',
        label: t('Active', 'نشط'),
        color: 'bg-blue-100 text-blue-800',
      };
    }

    if (auction.currentPrice === bid.bidAmount && auction.winnerId === bid.bidderId) {
      return {
        status: 'won',
        label: t('Won', 'فاز'),
        color: 'bg-green-100 text-green-800',
      };
    }

    return {
      status: 'outbid',
      label: t('Outbid', 'تم تجاوز العرض'),
      color: 'bg-red-100 text-red-800',
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container py-8 flex-1">
          <h1 className="text-3xl font-bold mb-8">{t("My Bids", "مزايداتي")}</h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i: number) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const bids = bidsData || [];
  const activeBids = bids.filter((b: any) => new Date(b.auction.endTime) > new Date());
  const completedBids = bids.filter((b: any) => new Date(b.auction.endTime) <= new Date());

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8 flex-1">
        <h1 className="text-3xl font-bold mb-2">{t("My Bids", "مزايداتي")}</h1>
        <p className="text-muted-foreground mb-8">
          {t("Track all your bids and auction participation", "تتبع جميع مزايداتك ومشاركتك في المزادات")}
        </p>

        {bids.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">
                {t("No bids yet", "لا توجد مزايدات بعد")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t(
                  "Start bidding on auctions to see your bid history here",
                  "ابدأ المزايدة على المزادات لرؤية سجل مزايداتك هنا"
                )}
              </p>
              <Button onClick={() => navigate("/auctions")}>
                {t("Browse Auctions", "استعرض المزادات")}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Active Bids */}
            {activeBids.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Clock className="h-6 w-6 text-primary" />
                  {t("Active Bids", "المزايدات النشطة")} ({activeBids.length})
                </h2>
                <div className="space-y-4">
                  {activeBids.map((bid: any) => (
                    <Card key={bid.id} className="hover:shadow-lg transition">
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">
                              {language === 'ar'
                                ? bid.auction.titleAr
                                : bid.auction.titleEn}
                            </h3>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <div>
                                {t("Your Bid:", "مزايدتك:")}
                                <span className="font-semibold text-foreground ml-1">
                                  {formatPrice(bid.bidAmount)}
                                </span>
                              </div>
                              <div>
                                {t("Current Price:", "السعر الحالي:")}
                                <span className="font-semibold text-foreground ml-1">
                                  {formatPrice(bid.auction.currentPrice)}
                                </span>
                              </div>
                              <div>
                                {t("Ends:", "ينتهي:")}
                                <span className="font-semibold text-foreground ml-1">
                                  {new Date(bid.auction.endTime).toLocaleString(
                                    language === 'ar' ? 'ar-SA' : 'en-US'
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Badge
                              className={
                                bid.bidAmount === bid.auction.currentPrice
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-orange-100 text-orange-800'
                              }
                            >
                              {bid.bidAmount === bid.auction.currentPrice
                                ? t('Highest Bid', 'أعلى عرض')
                                : t('Outbid', 'تم تجاوز العرض')}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/auction/${bid.auctionId}`)}
                            >
                              {t("View Auction", "عرض المزاد")}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Bids */}
            {completedBids.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  {t("Completed Bids", "المزايدات المكتملة")} ({completedBids.length})
                </h2>
                <div className="space-y-4">
                  {completedBids.map((bid: any) => {
                    const bidStatus = getBidStatus(bid.auction, bid);
                    const isWinner =
                      bid.auction.currentPrice === bid.bidAmount &&
                      bid.auction.winnerId === bid.bidderId;

                    return (
                      <Card key={bid.id} className="hover:shadow-lg transition">
                        <CardContent className="pt-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-2">
                                {language === 'ar'
                                  ? bid.auction.titleAr
                                  : bid.auction.titleEn}
                              </h3>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div>
                                  {t("Your Bid:", "مزايدتك:")}
                                  <span className="font-semibold text-foreground ml-1">
                                    {formatPrice(bid.bidAmount)}
                                  </span>
                                </div>
                                <div>
                                  {t("Final Price:", "السعر النهائي:")}
                                  <span className="font-semibold text-foreground ml-1">
                                    {formatPrice(bid.auction.currentPrice)}
                                  </span>
                                </div>
                                <div>
                                  {t("Ended:", "انتهى:")}
                                  <span className="font-semibold text-foreground ml-1">
                                    {new Date(bid.auction.endTime).toLocaleString(
                                      language === 'ar' ? 'ar-SA' : 'en-US'
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Badge className={bidStatus.color}>
                                {bidStatus.label}
                              </Badge>
                              {isWinner && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => navigate("/my-winnings")}
                                >
                                  {t("View Winnings", "عرض الفوز")}
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
