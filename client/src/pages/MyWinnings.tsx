import { useLanguage } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, DollarSign, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function MyWinnings() {
  const { t, language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const { data: winningsData, isLoading } = trpc.auction.getActive.useQuery(
    undefined,
    { enabled: !!user?.id }
  );

  // Filter for won auctions
  const winnings = (winningsData || []).filter((a: any) => a.winnerId === user?.id);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
    }).format(cents / 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container py-8 flex-1">
          <h1 className="text-3xl font-bold mb-8">{t("My Winnings", "فوزي")}</h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i: number) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }


  const pendingPayment = winnings.filter((w: any) => w.paymentStatus === 'pending');
  const completed = winnings.filter((w: any) => w.paymentStatus === 'completed');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8 flex-1">
        <h1 className="text-3xl font-bold mb-2">{t("My Winnings", "فوزي")}</h1>
        <p className="text-muted-foreground mb-8">
          {t("Manage your won auctions and complete payments", "إدارة المزادات التي فزت بها وإكمال المدفوعات")}
        </p>

        {winnings.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">
                {t("No winnings yet", "لا توجد فوز بعد")}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t(
                  "Start bidding on auctions to win items",
                  "ابدأ المزايدة على المزادات للفوز بالعناصر"
                )}
              </p>
              <Button onClick={() => navigate("/auctions")}>
                {t("Browse Auctions", "استعرض المزادات")}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Pending Payment */}
            {pendingPayment.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-orange-500" />
                  {t("Pending Payment", "الدفع المعلق")} ({pendingPayment.length})
                </h2>
                <div className="space-y-4">
                  {pendingPayment.map((winning: any) => (
                    <Card key={winning.id} className="border-orange-200 bg-orange-50">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {language === 'ar'
                                ? winning.titleAr
                                : winning.titleEn}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {t("Auction ID:", "معرف المزاد:")} #{winning.id}
                            </p>
                          </div>
                          <Badge className="bg-orange-500">
                            {t("Action Required", "إجراء مطلوب")}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {t("Winning Bid", "المزايدة الفائزة")}
                            </p>
                            <p className="text-2xl font-bold text-primary">
                              {formatPrice(winning.currentPrice)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {t("Won On", "فاز في")}
                            </p>
                            <p className="font-semibold">
                              {new Date(winning.endTime).toLocaleDateString(
                                language === 'ar' ? 'ar-SA' : 'en-US'
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {t("Status", "الحالة")}
                            </p>
                            <Badge variant="outline">
                              {t("Awaiting Payment", "في انتظار الدفع")}
                            </Badge>
                          </div>
                        </div>

                        {/* Payment Instructions */}
                        <div className="bg-white rounded-lg p-4 border border-orange-200">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            {t("Payment Instructions", "تعليمات الدفع")}
                          </h4>
                          <div className="space-y-2 text-sm">
                            <p>
                              <span className="font-semibold">{t("Amount:", "المبلغ:")}</span>{" "}
                              {formatPrice(winning.currentPrice)}
                            </p>
                            <p>
                              <span className="font-semibold">{t("Payment Method:", "طريقة الدفع:")}</span>{" "}
                              {t("Bank Transfer / Cash Payment", "تحويل بنكي / دفع نقداً")}
                            </p>
                            <p>
                              <span className="font-semibold">{t("Reference:", "المرجع:")}</span>{" "}
                              WN-{winning.id}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {t(
                                "Please contact the seller to arrange payment and delivery",
                                "يرجى الاتصال بالبائع لترتيب الدفع والتسليم"
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            onClick={() => setExpandedId(expandedId === winning.id ? null : winning.id)}
                          >
                            {expandedId === winning.id
                              ? t("Hide Details", "إخفاء التفاصيل")
                              : t("Show Details", "عرض التفاصيل")}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => navigate("/contact")}
                          >
                            {t("Contact Support", "اتصل بالدعم")}
                          </Button>
                        </div>

                        {expandedId === winning.id && (
                          <div className="mt-4 pt-4 border-t space-y-2 text-sm">
                            <p>
                              <span className="font-semibold">{t("Item Description:", "وصف العنصر:")}</span>
                            </p>
                            <p className="text-muted-foreground">
                              {language === 'ar'
                                ? winning.descriptionAr
                                : winning.descriptionEn}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Payments */}
            {completed.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  {t("Completed Purchases", "المشتريات المكتملة")} ({completed.length})
                </h2>
                <div className="space-y-4">
                  {completed.map((winning: any) => (
                    <Card key={winning.id} className="border-green-200 bg-green-50">
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">
                              {language === 'ar'
                                ? winning.titleAr
                                : winning.titleEn}
                            </h3>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <div>
                                {t("Final Price:", "السعر النهائي:")}
                                <span className="font-semibold text-foreground ml-1">
                                  {formatPrice(winning.currentPrice)}
                                </span>
                              </div>
                              <div>
                                {t("Purchased:", "تم الشراء:")}
                                <span className="font-semibold text-foreground ml-1">
                                  {new Date(winning.endTime).toLocaleDateString(
                                    language === 'ar' ? 'ar-SA' : 'en-US'
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Badge className="bg-green-500 justify-center">
                              {t("Completed", "مكتمل")}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/auction/${winning.id}`)}
                            >
                              {t("View Item", "عرض العنصر")}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Important Notice */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              {t("Important Information", "معلومات مهمة")}
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • {t(
                  "Payment must be completed within 7 days of winning",
                  "يجب إكمال الدفع في غضون 7 أيام من الفوز"
                )}
              </li>
              <li>
                • {t(
                  "Contact the seller to arrange delivery after payment",
                  "اتصل بالبائع لترتيب التسليم بعد الدفع"
                )}
              </li>
              <li>
                • {t(
                  "Keep your payment reference for your records",
                  "احتفظ بمرجع الدفع الخاص بك للسجلات"
                )}
              </li>
              <li>
                • {t(
                  "Contact support if you have any payment issues",
                  "اتصل بالدعم إذا كان لديك أي مشاكل في الدفع"
                )}
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
