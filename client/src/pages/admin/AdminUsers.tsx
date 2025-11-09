import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Ban, CheckCircle, Mail, Phone } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminUsers() {
  const { t } = useLanguage();
  const { user, isAuthenticated, loading } = useAuth();

  const { data: users, refetch } = trpc.user.getAllUsers.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === 'admin' }
  );

  const updateStatusMutation = trpc.user.updateUserStatus.useMutation({
    onSuccess: () => {
      toast.success(t("User status updated", "تم تحديث حالة المستخدم"));
      refetch();
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

  const handleSuspend = (userId: number) => {
    updateStatusMutation.mutate({
      userId,
      status: 'suspended',
    });
  };

  const handleActivate = (userId: number) => {
    updateStatusMutation.mutate({
      userId,
      status: 'active',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'suspended':
        return 'destructive';
      case 'pending_verification':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getRoleBadge = (role: string) => {
    return role === 'admin' ? 'destructive' : 'default';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t("Manage Users", "إدارة المستخدمين")}</h1>
          <p className="text-muted-foreground">
            {t("View and manage all registered users", "عرض وإدارة جميع المستخدمين المسجلين")}
          </p>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("ID", "المعرف")}</TableHead>
                  <TableHead>{t("Name", "الاسم")}</TableHead>
                  <TableHead>{t("Email", "البريد الإلكتروني")}</TableHead>
                  <TableHead>{t("Role", "الدور")}</TableHead>
                  <TableHead>{t("Status", "الحالة")}</TableHead>
                  <TableHead>{t("Verified", "موثق")}</TableHead>
                  <TableHead>{t("Joined", "انضم")}</TableHead>
                  <TableHead className="text-right">{t("Actions", "الإجراءات")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users && users.length > 0 ? (
                  users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.id}</TableCell>
                      <TableCell>{u.name || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {u.email || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadge(u.role)}>
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(u.status)}>
                          {u.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {u.isEmailVerified && (
                            <Badge variant="outline" className="text-xs">
                              <Mail className="h-3 w-3 mr-1" />
                              {t("Email", "بريد")}
                            </Badge>
                          )}
                          {u.isPhoneVerified && (
                            <Badge variant="outline" className="text-xs">
                              <Phone className="h-3 w-3 mr-1" />
                              {t("Phone", "هاتف")}
                            </Badge>
                          )}
                          {!u.isEmailVerified && !u.isPhoneVerified && '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {u.role !== 'admin' && (
                          <div className="flex gap-2 justify-end">
                            {u.status === 'active' ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleSuspend(u.id)}
                                disabled={updateStatusMutation.isPending}
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                {t("Suspend", "تعليق")}
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleActivate(u.id)}
                                disabled={updateStatusMutation.isPending}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {t("Activate", "تفعيل")}
                              </Button>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {t("No users found", "لم يتم العثور على مستخدمين")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
