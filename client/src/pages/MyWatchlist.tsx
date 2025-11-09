import { useLanguage } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Clock, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function MyWatchlist() {
  const { t, language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const { data: watchlistData, isLoading, refetch } = trpc.watchlist.getMy.useQuery(
    undefined,
    { enabled: !!user?.id }
  );

  const removeFromWatchlistMutation = trpc.watchlist.remove.useMutation({
    onSuccess: () => {
      toast.success(t("Removed from watchlist", "تمت الإزالة من قائمة المراقبة"));
      refetch();
    },
  });

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container py-8 flex-1">
          <h1 className="text-3xl font-bold mb-8">{t("My Watchlist", "قائمة مراقبتي")}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i: number) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const watchlist = watchlistData || [];
  const activeAuctions = watchlist.filter((w: any) => new Date(w.auction.endTime) > new Date());
  const endedAuctions = watchlist.filter((w: any) => new Date(w.auction.endTime) <= new Date());

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8 flex-1">
        <h1 className="text-3xl font-bold mb-2">{t("My Watchlist", "قائمة مراقبتي")}</h1>
        <p className="text-muted-foreground mb-8">
          {t("Keep track of your favorite auctions", "تتبع المزادات المفضلة لديك")}
        </p>

        {watchlist.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">
                {t("No items in watchlist", "لا توجد عناصر في قائمة المراقبة")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t(
                  "Start adding auctions to your watchlist to keep track of them",
                  "ابدأ بإضافة المزادات إلى قائمة مراقبتك لتتبعها"
                )}
              </p>
              <Button onClick={() => navigate("/auctions")}>
                {t("Browse Auctions", "استعرض المزادات")}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Active Auctions */}
            {activeAuctions.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Clock className="h-6 w-6 text-primary" />
                  {t("Active Auctions", "المزادات النشطة")} ({activeAuctions.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeAuctions.map((watchItem: any) => (
                    <Card key={watchItem.id} className="hover:shadow-lg transition flex flex-col">
                      <CardContent className="pt-6 flex-1 flex flex-col">
                        <div className="mb-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold line-clamp-2">
                              {language === 'ar'
                                ? watchItem.auction.titleAr
                                : watchItem.auction.titleEn}
                            </h3>
                            <Heart className="h-5 w-5 text-red-500 flex-shrink-0 ml-2" />
                          </div>
                          <Badge variant="outline" className="mb-3">
                            {language === 'ar'
                              ? watchItem.auction.category?.nameAr
                              : watchItem.auction.category?.nameEn}
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-4 flex-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {t("Current Bid:", "المزايدة الحالية:")}
                            </span>
                            <span className="font-semibold text-primary">
                              {formatPrice(watchItem.auction.currentPrice)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {t("Time Left:", "الوقت المتبقي:")}
                            </span>
                            <span className="font-semibold">
                              {formatTimeRemaining(new Date(watchItem.auction.endTime))}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {t("Bids:", "المزايدات:")}
                            </span>
                            <span className="font-semibold">
                              {watchItem.auction.bidCount || 0}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            className="flex-1"
                            onClick={() => navigate(`/auction/${watchItem.auctionId}`)}
                          >
                            {t("View", "عرض")}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              removeFromWatchlistMutation.mutate({ auctionId: watchItem.auctionId })
                            }
                            disabled={removeFromWatchlistMutation.isPending}
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Ended Auctions */}
            {endedAuctions.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  {t("Ended Auctions", "المزادات المنتهية")} ({endedAuctions.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {endedAuctions.map((watchItem: any) => (
                    <Card key={watchItem.id} className="hover:shadow-lg transition flex flex-col opacity-75">
                      <CardContent className="pt-6 flex-1 flex flex-col">
                        <div className="mb-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold line-clamp-2">
                              {language === 'ar'
                                ? watchItem.auction.titleAr
                                : watchItem.auction.titleEn}
                            </h3>
                            <Badge variant="secondary" className="ml-2">
                              {t("Ended", "انتهى")}
                            </Badge>
                          </div>
                          <Badge variant="outline" className="mb-3">
                            {language === 'ar'
                              ? watchItem.auction.category?.nameAr
                              : watchItem.auction.category?.nameEn}
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-4 flex-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {t("Final Price:", "السعر النهائي:")}
                            </span>
                            <span className="font-semibold text-primary">
                              {formatPrice(watchItem.auction.currentPrice)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {t("Total Bids:", "إجمالي المزايدات:")}
                            </span>
                            <span className="font-semibold">
                              {watchItem.auction.bidCount || 0}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {t("Ended:", "انتهى:")}
                            </span>
                            <span className="font-semibold text-sm">
                              {new Date(watchItem.auction.endTime).toLocaleDateString(
                                language === 'ar' ? 'ar-SA' : 'en-US'
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => navigate(`/auction/${watchItem.auctionId}`)}
                          >
                            {t("View Details", "عرض التفاصيل")}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              removeFromWatchlistMutation.mutate({ auctionId: watchItem.auctionId })
                            }
                            disabled={removeFromWatchlistMutation.isPending}
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
