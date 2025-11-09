import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, MapPin, Check, X } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function AdminLocations() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ city: "", country: "" });

  // Redirect if not admin
  if (user?.role !== "admin") {
    navigate("/");
    return null;
  }

  const { data: locations, isLoading, refetch } = trpc.location.getAll.useQuery();

  const createMutation = trpc.location.create.useMutation({
    onSuccess: () => {
      toast.success(t("Location created successfully", "تم إنشاء الموقع بنجاح"));
      setFormData({ city: "", country: "" });
      setIsAdding(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = () => {
    if (!formData.city || !formData.country) {
      toast.error(t("Please fill in all fields", "يرجى ملء جميع الحقول"));
      return;
    }

    createMutation.mutate({
      city: formData.city,
      country: formData.country,
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setFormData({ city: "", country: "" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            {t("Manage Locations", "إدارة المواقع")}
          </h1>
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t("Add Location", "إضافة موقع")}
            </Button>
          )}
        </div>

        {/* Add Form */}
        {isAdding && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>
                {t("Add New Location", "إضافة موقع جديد")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("City Name", "اسم المدينة")}
                  </label>
                  <Input
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder={t("e.g., Riyadh", "مثل: الرياض")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("Country", "الدولة")}
                  </label>
                  <Input
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    placeholder={t("e.g., Saudi Arabia", "مثل: المملكة العربية السعودية")}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmit}
                  disabled={createMutation.isPending}
                >
                  <Check className="h-4 w-4 mr-2" />
                  {t("Save", "حفظ")}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  {t("Cancel", "إلغاء")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Locations List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t("All Locations", "جميع المواقع")} ({locations?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">
                {t("Loading...", "جاري التحميل...")}
              </p>
            ) : locations && locations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {locations.map((location: any) => (
                  <Card key={location.id} className="border-l-4 border-l-primary">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h3 className="font-semibold">
                            {location.city}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {location.country}
                          </p>
                          <Badge variant="outline" className="mt-2">
                            {location.country}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                {t("No locations found", "لم يتم العثور على مواقع")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
