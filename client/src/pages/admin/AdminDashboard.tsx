import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Gavel, Clock, CheckCircle, XCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { user, isAuthenticated, loading } = useAuth();

  const { data: pendingAuctions } = trpc.auction.getByStatus.useQuery(
    { status: 'pending_approval' },
    { enabled: isAuthenticated && user?.role === 'admin' }
  );

  const { data: activeAuctions } = trpc.auction.getByStatus.useQuery(
    { status: 'active' },
    { enabled: isAuthenticated && user?.role === 'admin' }
  );

  const { data: allUsers } = trpc.user.getAllUsers.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === 'admin' }
  );

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
      window.location.href = getLoginUrl();
    }
  }, [isAuthenticated, user, loading]);

  if (loading || !isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t("Admin Dashboard", "لوحة الإدارة")}</h1>
          <p className="text-muted-foreground">
            {t("Manage auctions, users, and platform settings", "إدارة المزادات والمستخدمين وإعدادات المنصة")}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("Pending Approval", "قيد المراجعة")}
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {pendingAuctions?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("Auctions awaiting review", "مزادات تنتظر المراجعة")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("Active Auctions", "المزادات النشطة")}
              </CardTitle>
              <Gavel className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {activeAuctions?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("Currently running", "قيد التشغيل حاليًا")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("Total Users", "إجمالي المستخدمين")}
              </CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {allUsers?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("Registered users", "مستخدمون مسجلون")}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("System Status", "حالة النظام")}
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {t("Operational", "يعمل")}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("All systems running", "جميع الأنظمة تعمل")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>{t("Quick Actions", "إجراءات سريعة")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/admin/auctions">
                  <Gavel className="mr-2 h-4 w-4" />
                  {t("Manage Auctions", "إدارة المزادات")}
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/admin/users">
                  <Users className="mr-2 h-4 w-4" />
                  {t("Manage Users", "إدارة المستخدمين")}
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("Pending Approvals", "الموافقات المعلقة")}</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingAuctions && pendingAuctions.length > 0 ? (
                <div className="space-y-2">
                  {pendingAuctions.slice(0, 5).map((auction) => (
                    <div key={auction.id} className="flex justify-between items-center py-2 border-b last:border-0">
                      <span className="text-sm truncate">{auction.titleEn}</span>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/admin/auctions`}>
                          {t("Review", "مراجعة")}
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t("No pending approvals", "لا توجد موافقات معلقة")}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
