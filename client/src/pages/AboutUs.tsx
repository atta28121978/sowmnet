import { useLanguage } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, Globe, Award } from "lucide-react";

export default function AboutUs() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("About Sowmnet", "حول سومنت")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              {t(
                "Leading the auction industry in the Middle East with transparency, security, and innovation",
                "قيادة صناعة المزادات في الشرق الأوسط بالشفافية والأمان والابتكار"
              )}
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                {t("Our Mission", "مهمتنا")}
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                {t(
                  "Sowmnet is dedicated to revolutionizing the auction experience for heavy machinery, construction equipment, and industrial assets across the Middle East. We provide a secure, transparent, and efficient platform that connects buyers and sellers.",
                  "سومنت مكرسة لإحداث ثورة في تجربة المزادات للآلات الثقيلة ومعدات البناء والأصول الصناعية في جميع أنحاء الشرق الأوسط. نحن نوفر منصة آمنة وشفافة وفعالة تربط بين المشترين والبائعين."
                )}
              </p>
              <p className="text-lg text-muted-foreground">
                {t(
                  "Our platform eliminates intermediaries, reduces costs, and ensures fair market pricing through competitive bidding.",
                  "تزيل منصتنا الوسطاء وتقلل التكاليف وتضمن تسعيراً عادلاً للسوق من خلال المزايدة التنافسية."
                )}
              </p>
            </div>
            <div className="bg-muted rounded-lg p-8">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Globe className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">
                      {t("Global Reach", "وصول عالمي")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("Serving the entire Middle East region", "خدمة منطقة الشرق الأوسط بأكملها")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Users className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">
                      {t("Community", "المجتمع")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("Thousands of verified buyers and sellers", "آلاف المشترين والبائعين المتحققين")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Award className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">
                      {t("Excellence", "التميز")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("Industry-leading transparency and security", "الشفافية والأمان الرائدة في الصناعة")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-12 text-center">
              {t("Our Core Values", "قيمنا الأساسية")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  titleEn: "Transparency",
                  titleAr: "الشفافية",
                  descEn: "All auctions are fully transparent with real-time bidding information",
                  descAr: "جميع المزادات شفافة تماماً مع معلومات المزايدة في الوقت الفعلي",
                },
                {
                  titleEn: "Security",
                  titleAr: "الأمان",
                  descEn: "Advanced security measures protect all transactions and user data",
                  descAr: "تدابير أمان متقدمة تحمي جميع المعاملات وبيانات المستخدم",
                },
                {
                  titleEn: "Fairness",
                  titleAr: "العدالة",
                  descEn: "Competitive bidding ensures fair market prices for all items",
                  descAr: "المزايدة التنافسية تضمن أسعار عادلة للسوق لجميع العناصر",
                },
                {
                  titleEn: "Innovation",
                  titleAr: "الابتكار",
                  descEn: "Cutting-edge technology for seamless auction experience",
                  descAr: "تكنولوجيا متطورة لتجربة مزاد سلسة",
                },
              ].map((value, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-6">
                    <CheckCircle className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-semibold text-lg mb-2">
                      {useLanguage().language === 'ar' ? value.titleAr : value.titleEn}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {useLanguage().language === 'ar' ? value.descAr : value.descEn}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-muted rounded-lg p-12 mb-20">
            <h2 className="text-3xl font-bold mb-8">
              {t("Why Choose Sowmnet?", "لماذا تختار سومنت؟")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  {t("For Buyers", "للمشترين")}
                </h3>
                <ul className="space-y-3">
                  {[
                    t("Access to premium equipment at competitive prices", "الوصول إلى معدات عالية الجودة بأسعار تنافسية"),
                    t("Verified seller information and ratings", "معلومات البائع المتحققة والتقييمات"),
                    t("Transparent bidding process", "عملية مزايدة شفافة"),
                    t("Secure payment options", "خيارات دفع آمنة"),
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  {t("For Sellers", "للبائعين")}
                </h3>
                <ul className="space-y-3">
                  {[
                    t("Reach thousands of qualified buyers", "الوصول إلى آلاف المشترين المؤهلين"),
                    t("Maximize your selling price through competitive bidding", "زيادة سعر البيع من خلال المزايدة التنافسية"),
                    t("Professional platform management", "إدارة منصة احترافية"),
                    t("Easy listing and auction management", "إدارة القوائم والمزادات بسهولة"),
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
            {[
              { numberEn: "10K+", numberAr: "10K+", labelEn: "Auctions", labelAr: "مزادات" },
              { numberEn: "5K+", numberAr: "5K+", labelEn: "Users", labelAr: "مستخدمين" },
              { numberEn: "$50M+", numberAr: "$50M+", labelEn: "Trading Volume", labelAr: "حجم التداول" },
              { numberEn: "99.9%", numberAr: "99.9%", labelEn: "Uptime", labelAr: "التوفر" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {useLanguage().language === 'ar' ? stat.numberAr : stat.numberEn}
                </div>
                <p className="text-muted-foreground">
                  {useLanguage().language === 'ar' ? stat.labelAr : stat.labelEn}
                </p>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              {t("Have Questions?", "هل لديك أسئلة؟")}
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              {t("Get in touch with our team", "تواصل مع فريقنا")}
            </p>
            <a
              href="/contact"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              {t("Contact Us", "اتصل بنا")}
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
