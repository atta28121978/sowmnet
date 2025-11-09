import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AdminAuctions() {
  const { t, language } = useLanguage();
  const { user, isAuthenticated, loading } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("pending_approval");
  const [selectedAuction, setSelectedAuction] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: auctions, refetch } = trpc.auction.getByStatus.useQuery(
    { status: statusFilter },
    { enabled: isAuthenticated && user?.role === 'admin' }
  );

  const updateStatusMutation = trpc.auction.updateStatus.useMutation({
    onSuccess: () => {
      toast.success(t("Auction status updated", "تم تحديث حالة المزاد"));
      refetch();
      setDialogOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
      window.location.href = getLoginUrl();
    }
  }, [isAuthenticated, user, loading]);

  if (loading || !isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
    }).format(cents / 100);
  };

  const handleApprove = (auctionId: number) => {
    updateStatusMutation.mutate({
      auctionId,
      status: 'active',
    });
  };

  const handleReject = (auctionId: number) => {
    updateStatusMutation.mutate({
      auctionId,
      status: 'cancelled',
    });
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t("Manage Auctions", "إدارة المزادات")}</h1>
          <p className="text-muted-foreground">
            {t("Review and manage all auction listings", "مراجعة وإدارة جميع قوائم المزادات")}
          </p>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending_approval">
                {t("Pending Approval", "قيد المراجعة")}
              </SelectItem>
              <SelectItem value="active">{t("Active", "نشط")}</SelectItem>
              <SelectItem value="ended_sold">{t("Sold", "مباع")}</SelectItem>
              <SelectItem value="ended_not_sold">{t("Not Sold", "غير مباع")}</SelectItem>
              <SelectItem value="cancelled">{t("Cancelled", "ملغى")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Auctions List */}
        <div className="space-y-4">
          {auctions && auctions.length > 0 ? (
            auctions.map((auction) => (
              <Card key={auction.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        {language === 'ar' ? auction.titleAr : auction.titleEn}
                      </h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>
                          {t("Seller ID:", "معرف البائع:")} {auction.sellerId}
                        </div>
                        <div>
                          {t("Created:", "تم الإنشاء:")} {new Date(auction.createdAt).toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US')}
                        </div>
                        <div>
                          {t("Auction Period:", "فترة المزاد:")} {new Date(auction.startTime).toLocaleDateString()} - {new Date(auction.endTime).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant={getStatusColor(auction.status)}>
                      {auction.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">
                        {t("Starting Price:", "السعر الابتدائي:")} {formatPrice(auction.startingPrice)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("Current Price:", "السعر الحالي:")} {formatPrice(auction.currentPrice)}
                      </div>
                      {auction.reservePrice && (
                        <div className="text-sm text-muted-foreground">
                          {t("Reserve Price:", "السعر الاحتياطي:")} {formatPrice(auction.reservePrice)}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAuction(auction);
                          setDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {t("View Details", "عرض التفاصيل")}
                      </Button>
                      {auction.status === 'pending_approval' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(auction.id)}
                            disabled={updateStatusMutation.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {t("Approve", "موافقة")}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject(auction.id)}
                            disabled={updateStatusMutation.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            {t("Reject", "رفض")}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground">
                  {t("No auctions found with this status", "لم يتم العثور على مزادات بهذه الحالة")}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Auction Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedAuction && (language === 'ar' ? selectedAuction.titleAr : selectedAuction.titleEn)}
            </DialogTitle>
            <DialogDescription>
              {t("Auction Details", "تفاصيل المزاد")}
            </DialogDescription>
          </DialogHeader>
          {selectedAuction && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">{t("Description (English)", "الوصف (إنجليزي)")}</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {selectedAuction.descriptionEn}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">{t("Description (Arabic)", "الوصف (عربي)")}</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {selectedAuction.descriptionAr}
                </p>
              </div>
              {selectedAuction.itemConditionEn && (
                <div>
                  <h4 className="font-semibold mb-2">{t("Condition", "الحالة")}</h4>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? selectedAuction.itemConditionAr : selectedAuction.itemConditionEn}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <div className="text-sm font-medium">{t("Starting Price", "السعر الابتدائي")}</div>
                  <div className="text-lg font-bold">{formatPrice(selectedAuction.startingPrice)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">{t("Bid Increment", "زيادة المزايدة")}</div>
                  <div className="text-lg font-bold">{formatPrice(selectedAuction.bidIncrement)}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("Close", "إغلاق")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
