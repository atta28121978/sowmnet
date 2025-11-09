import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { useLocation } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ImageUpload";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  uploading?: boolean;
}

export default function SellItem() {
  const { t, language } = useLanguage();
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    titleEn: "",
    titleAr: "",
    descriptionEn: "",
    descriptionAr: "",
    itemConditionEn: "",
    itemConditionAr: "",
    categoryId: "",
    locationId: "",
    startingPrice: "",
    reservePrice: "",
    bidIncrement: "100",
    startTime: "",
    endTime: "",
  });

  const [images, setImages] = useState<ImageFile[]>([]);

  const { data: categories } = trpc.category.getAll.useQuery();
  const { data: locations } = trpc.location.getAll.useQuery();

  const uploadImageMutation = trpc.image.uploadToS3.useMutation();
  const saveImageMetadataMutation = trpc.image.saveMetadata.useMutation();

  const createAuctionMutation = trpc.auction.create.useMutation({
    onSuccess: async (auctionData) => {
      // Upload images if any
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          try {
            // Get presigned URL
            const { url, fileKey } = await uploadImageMutation.mutateAsync({
              fileName: image.file.name,
              fileType: image.file.type,
              fileSize: image.file.size,
            });

            // Upload to S3
            await fetch(url, {
              method: 'PUT',
              body: image.file,
              headers: {
                'Content-Type': image.file.type,
              },
            });

            // Save metadata
            await saveImageMetadataMutation.mutateAsync({
              auctionId: auctionData.id,
              imageUrl: url.split('?')[0], // Remove query params
              imageKey: fileKey,
              displayOrder: i,
            });
          } catch (error) {
            console.error('Error uploading image:', error);
            toast.error(t("Error uploading image", "خطأ في تحميل الصورة"));
          }
        }
      }

      toast.success(t(
        "Auction created successfully! It will be reviewed by our team.",
        "تم إنشاء المزاد بنجاح! سيتم مراجعته من قبل فريقنا."
      ));
      setLocation(`/my-auctions`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      window.location.href = getLoginUrl();
    }
  }, [isAuthenticated, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.titleEn || !formData.titleAr) {
      toast.error(t("Please provide title in both languages", "يرجى تقديم العنوان بكلتا اللغتين"));
      return;
    }

    if (!formData.descriptionEn || !formData.descriptionAr) {
      toast.error(t("Please provide description in both languages", "يرجى تقديم الوصف بكلتا اللغتين"));
      return;
    }

    if (!formData.categoryId || !formData.locationId) {
      toast.error(t("Please select category and location", "يرجى اختيار الفئة والموقع"));
      return;
    }

    if (!formData.startingPrice || !formData.startTime || !formData.endTime) {
      toast.error(t("Please fill all required fields", "يرجى ملء جميع الحقول المطلوبة"));
      return;
    }

    if (images.length === 0) {
      toast.error(t("Please upload at least one image", "يرجى تحميل صورة واحدة على الأقل"));
      return;
    }

    const startingPriceCents = Math.round(parseFloat(formData.startingPrice) * 100);
    const reservePriceCents = formData.reservePrice 
      ? Math.round(parseFloat(formData.reservePrice) * 100)
      : undefined;
    const bidIncrementCents = Math.round(parseFloat(formData.bidIncrement) * 100);

    createAuctionMutation.mutate({
      titleEn: formData.titleEn,
      titleAr: formData.titleAr,
      descriptionEn: formData.descriptionEn,
      descriptionAr: formData.descriptionAr,
      itemConditionEn: formData.itemConditionEn || undefined,
      itemConditionAr: formData.itemConditionAr || undefined,
      categoryId: Number(formData.categoryId),
      locationId: Number(formData.locationId),
      startingPrice: startingPriceCents,
      reservePrice: reservePriceCents,
      bidIncrement: bidIncrementCents,
      startTime: new Date(formData.startTime),
      endTime: new Date(formData.endTime),
    });
  };

  if (loading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8 flex-1">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{t("Sell an Item", "بيع عنصر")}</h1>
            <p className="text-muted-foreground">
              {t(
                "Create a new auction listing. Your listing will be reviewed before going live.",
                "إنشاء قائمة مزاد جديدة. سيتم مراجعة قائمتك قبل نشرها."
              )}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>{t("Basic Information", "المعلومات الأساسية")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t("Title (English)", "العنوان (إنجليزي)")} *</Label>
                    <Input
                      required
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      placeholder={t("Enter title in English", "أدخل العنوان بالإنجليزية")}
                    />
                  </div>
                  <div>
                    <Label>{t("Title (Arabic)", "العنوان (عربي)")} *</Label>
                    <Input
                      required
                      value={formData.titleAr}
                      onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                      placeholder={t("Enter title in Arabic", "أدخل العنوان بالعربية")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t("Description (English)", "الوصف (إنجليزي)")} *</Label>
                    <Textarea
                      required
                      rows={5}
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                      placeholder={t("Detailed description in English", "وصف مفصل بالإنجليزية")}
                    />
                  </div>
                  <div>
                    <Label>{t("Description (Arabic)", "الوصف (عربي)")} *</Label>
                    <Textarea
                      required
                      rows={5}
                      value={formData.descriptionAr}
                      onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                      placeholder={t("Detailed description in Arabic", "وصف مفصل بالعربية")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t("Condition (English)", "الحالة (إنجليزي)")}</Label>
                    <Textarea
                      rows={3}
                      value={formData.itemConditionEn}
                      onChange={(e) => setFormData({ ...formData, itemConditionEn: e.target.value })}
                      placeholder={t("Item condition details", "تفاصيل حالة العنصر")}
                    />
                  </div>
                  <div>
                    <Label>{t("Condition (Arabic)", "الحالة (عربي)")}</Label>
                    <Textarea
                      rows={3}
                      value={formData.itemConditionAr}
                      onChange={(e) => setFormData({ ...formData, itemConditionAr: e.target.value })}
                      placeholder={t("Item condition details", "تفاصيل حالة العنصر")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>{t("Item Images", "صور العنصر")} *</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  onImagesChange={setImages}
                  maxImages={10}
                  maxFileSize={10}
                />
              </CardContent>
            </Card>

            {/* Category and Location */}
            <Card>
              <CardHeader>
                <CardTitle>{t("Category & Location", "الفئة والموقع")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t("Category", "الفئة")} *</Label>
                    <Select
                      required
                      value={formData.categoryId}
                      onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select category", "اختر الفئة")} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id.toString()}>
                            {language === 'ar' ? cat.nameAr : cat.nameEn}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>{t("Location", "الموقع")} *</Label>
                    <Select
                      required
                      value={formData.locationId}
                      onValueChange={(value) => setFormData({ ...formData, locationId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("Select location", "اختر الموقع")} />
                      </SelectTrigger>
                      <SelectContent>
                        {locations?.map((loc) => (
                          <SelectItem key={loc.id} value={loc.id.toString()}>
                            {loc.city}, {loc.country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>{t("Pricing", "التسعير")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>{t("Starting Price (SAR)", "السعر الابتدائي (ريال)")} *</Label>
                    <Input
                      required
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.startingPrice}
                      onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                      placeholder="1000.00"
                    />
                  </div>

                  <div>
                    <Label>{t("Reserve Price (SAR)", "السعر الاحتياطي (ريال)")}</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.reservePrice}
                      onChange={(e) => setFormData({ ...formData, reservePrice: e.target.value })}
                      placeholder={t("Optional", "اختياري")}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("Minimum price you'll accept", "الحد الأدنى للسعر الذي ستقبله")}
                    </p>
                  </div>

                  <div>
                    <Label>{t("Bid Increment (SAR)", "زيادة المزايدة (ريال)")} *</Label>
                    <Input
                      required
                      type="number"
                      step="0.01"
                      min="1"
                      value={formData.bidIncrement}
                      onChange={(e) => setFormData({ ...formData, bidIncrement: e.target.value })}
                      placeholder="100.00"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Auction Duration */}
            <Card>
              <CardHeader>
                <CardTitle>{t("Auction Duration", "مدة المزاد")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t("Start Time", "وقت البدء")} *</Label>
                    <Input
                      required
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>{t("End Time", "وقت الانتهاء")} *</Label>
                    <Input
                      required
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4">
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                disabled={createAuctionMutation.isPending || uploadImageMutation.isPending}
              >
                {createAuctionMutation.isPending || uploadImageMutation.isPending
                  ? t("Creating...", "جاري الإنشاء...")
                  : t("Create Auction", "إنشاء مزاد")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setLocation("/dashboard")}
              >
                {t("Cancel", "إلغاء")}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
