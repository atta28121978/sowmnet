import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Gavel, Clock, MapPin, Eye, Heart, TrendingUp, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function AuctionDetail() {
  const [, params] = useRoute("/auction/:id");
  const auctionId = Number(params?.id);
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [bidAmount, setBidAmount] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data, isLoading, refetch } = trpc.auction.getById.useQuery(
    { id: auctionId },
    { enabled: !!auctionId }
  );

  const { data: category } = trpc.category.getById.useQuery(
    { id: data?.auction.categoryId || 0 },
    { enabled: !!data?.auction.categoryId }
  );

  const { data: location } = trpc.location.getAll.useQuery();

  const placeBidMutation = trpc.bid.place.useMutation({
    onSuccess: () => {
      toast.success(t("Bid placed successfully!", "تم تقديم المزايدة بنجاح!"));
      setBidAmount("");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const addToWatchlistMutation = trpc.watchlist.add.useMutation({
    onSuccess: () => {
      toast.success(t("Added to watchlist", "تمت الإضافة إلى قائمة المراقبة"));
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
    
    if (diff < 0) return t("Auction Ended", "انتهى المزاد");
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (days > 0) {
      return `${days}${t("d", "ي")} ${hours}${t("h", "س")} ${minutes}${t("m", "د")}`;
    }
    if (hours > 0) {
      return `${hours}${t("h", "س")} ${minutes}${t("m", "د")} ${seconds}${t("s", "ث")}`;
    }
    return `${minutes}${t("m", "د")} ${seconds}${t("s", "ث")}`;
  };

  const handlePlaceBid = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    const amountInCents = Math.round(parseFloat(bidAmount) * 100);
    
    if (isNaN(amountInCents) || amountInCents <= 0) {
      toast.error(t("Please enter a valid bid amount", "الرجاء إدخال مبلغ مزايدة صالح"));
      return;
    }

    placeBidMutation.mutate({
      auctionId,
      bidAmount: amountInCents,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container py-8 flex-1">
          <Skeleton className="h-96 w-full mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container py-16 flex-1 text-center">
          <h1 className="text-2xl font-bold mb-4">{t("Auction not found", "المزاد غير موجود")}</h1>
        </div>
        <Footer />
      </div>
    );
  }

  const { auction, images, bids } = data;
  const auctionLocation = location?.find(l => l.id === auction.locationId);
  const minBid = auction.currentPrice + auction.bidIncrement;
  const currentImage = images && images.length > 0 ? images[selectedImageIndex] : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8 flex-1">
        {/* Image Gallery */}
        <div className="relative bg-muted rounded-lg mb-8 overflow-hidden aspect-video flex items-center justify-center">
          {currentImage ? (
            <img
              src={currentImage.imageUrl}
              alt={language === 'ar' ? auction.titleAr : auction.titleEn}
              className="w-full h-full object-cover"
            />
          ) : (
            <Gavel className="h-32 w-32 text-muted-foreground" />
          )}

          {/* Navigation Arrows */}
          {images && images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setSelectedImageIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() =>
                  setSelectedImageIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {images && images.length > 0 && (
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
              {selectedImageIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Gallery */}
        {images && images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto mb-8 pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`flex-shrink-0 w-24 h-24 rounded border-2 overflow-hidden transition ${
                  selectedImageIndex === idx
                    ? 'border-primary'
                    : 'border-muted hover:border-muted-foreground'
                }`}
              >
                <img
                  src={img.imageUrl}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Status */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold">
                  {language === 'ar' ? auction.titleAr : auction.titleEn}
                </h1>
                <Badge variant={auction.status === 'active' ? 'default' : 'secondary'}>
                  {auction.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">{auction.viewCount} {t("views", "مشاهدة")}</span>
                </div>
                {auctionLocation && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{auctionLocation.city}, {auctionLocation.country}</span>
                  </div>
                )}
                {category && (
                  <Badge variant="outline">
                    {language === 'ar' ? category.nameAr : category.nameEn}
                  </Badge>
                )}
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">{t("Description", "الوصف")}</h2>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">
                  {language === 'ar' ? auction.descriptionAr : auction.descriptionEn}
                </p>
                {auction.itemConditionEn && (
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="font-semibold mb-2">{t("Condition", "الحالة")}</h3>
                    <p className="text-muted-foreground">
                      {language === 'ar' ? auction.itemConditionAr : auction.itemConditionEn}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bid History */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">
                  {t("Bid History", "سجل المزايدات")} ({bids.length})
                </h2>
              </CardHeader>
              <CardContent>
                {bids.length > 0 ? (
                  <div className="space-y-3">
                    {bids.slice(0, 10).map((bid) => (
                      <div key={bid.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{t("Bidder", "مزايد")} #{bid.bidderId}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatPrice(bid.bidAmount)}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(bid.createdAt).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    {t("No bids yet. Be the first to bid!", "لا توجد مزايدات بعد. كن أول من يزايد!")}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Bidding */}
          <div className="space-y-4">
            <Card className="sticky top-20">
              <CardHeader>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Clock className="h-5 w-5" />
                  <span className="font-semibold">{formatTimeRemaining(new Date(auction.endTime))}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {t("Ends on", "ينتهي في")} {new Date(auction.endTime).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Price */}
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    {t("Current Bid", "المزايدة الحالية")}
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {formatPrice(auction.currentPrice)}
                  </div>
                </div>

                {/* Starting Price */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("Starting Price", "السعر الابتدائي")}</span>
                  <span className="font-medium">{formatPrice(auction.startingPrice)}</span>
                </div>

                {/* Bid Increment */}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("Minimum Increment", "الحد الأدنى للزيادة")}</span>
                  <span className="font-medium">{formatPrice(auction.bidIncrement)}</span>
                </div>

                {/* Bid Input */}
                {auction.status === 'active' && new Date() < new Date(auction.endTime) && (
                  <>
                    <div className="pt-4 border-t space-y-3">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          {t("Your Bid (SAR)", "مزايدتك (ريال)")}
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          min={minBid / 100}
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          placeholder={formatPrice(minBid)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {t("Minimum bid:", "الحد الأدنى للمزايدة:")} {formatPrice(minBid)}
                        </p>
                      </div>

                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handlePlaceBid}
                        disabled={placeBidMutation.isPending}
                      >
                        <TrendingUp className="mr-2 h-5 w-5" />
                        {placeBidMutation.isPending
                          ? t("Placing Bid...", "جاري تقديم المزايدة...")
                          : t("Place Bid", "قدم مزايدة")}
                      </Button>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        if (!isAuthenticated) {
                          window.location.href = getLoginUrl();
                          return;
                        }
                        addToWatchlistMutation.mutate({ auctionId });
                      }}
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      {t("Add to Watchlist", "أضف إلى قائمة المراقبة")}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
