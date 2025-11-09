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
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

export default function AdminCategories() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ nameEn: "", nameAr: "" });

  // Redirect if not admin
  if (user?.role !== "admin") {
    navigate("/");
    return null;
  }

  const { data: categories, isLoading, refetch } = trpc.category.getAll.useQuery();

  const createMutation = trpc.category.create.useMutation({
    onSuccess: () => {
      toast.success(t("Category created successfully", "تم إنشاء الفئة بنجاح"));
      setFormData({ nameEn: "", nameAr: "" });
      setIsAdding(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = () => {
    if (!formData.nameEn || !formData.nameAr) {
      toast.error(t("Please fill in all fields", "يرجى ملء جميع الحقول"));
      return;
    }

    const slug = formData.nameEn.toLowerCase().replace(/\s+/g, '-');
    const slugAr = formData.nameAr.toLowerCase().replace(/\s+/g, '-');
    createMutation.mutate({
      nameEn: formData.nameEn,
      nameAr: formData.nameAr,
      slugEn: slug,
      slugAr: slugAr,
    });
  };

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setFormData({ nameEn: category.nameEn, nameAr: category.nameAr });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ nameEn: "", nameAr: "" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            {t("Manage Categories", "إدارة الفئات")}
          </h1>
          {!isAdding && editingId === null && (
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t("Add Category", "إضافة فئة")}
            </Button>
          )}
        </div>

        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>
                {editingId
                  ? t("Edit Category", "تحرير الفئة")
                  : t("Add New Category", "إضافة فئة جديدة")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("English Name", "الاسم بالإنجليزية")}
                  </label>
                  <Input
                    value={formData.nameEn}
                    onChange={(e) =>
                      setFormData({ ...formData, nameEn: e.target.value })
                    }
                    placeholder={t("Enter English name", "أدخل الاسم بالإنجليزية")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("Arabic Name", "الاسم بالعربية")}
                  </label>
                  <Input
                    value={formData.nameAr}
                    onChange={(e) =>
                      setFormData({ ...formData, nameAr: e.target.value })
                    }
                    placeholder={t("Enter Arabic name", "أدخل الاسم بالعربية")}
                    dir="rtl"
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

        {/* Categories List */}
        <Card>
          <CardHeader>
            <CardTitle>
              {t("All Categories", "جميع الفئات")} ({categories?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">
                {t("Loading...", "جاري التحميل...")}
              </p>
            ) : categories && categories.length > 0 ? (
              <div className="space-y-3">
                {categories.map((category: any) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {language === 'ar' ? category.nameAr : category.nameEn}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === 'ar' ? category.nameEn : category.nameAr}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        title={t("Edit feature coming soon", "ميزة التحرير قريباً")}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled
                        title={t("Delete feature coming soon", "ميزة الحذف قريباً")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                {t("No categories found", "لم يتم العثور على فئات")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
