import { useLanguage } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Search, Gavel, DollarSign, TrendingUp, CheckCircle } from "lucide-react";

export default function HowItWorks() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("How Sowmnet Works", "كيف يعمل سومنت")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              {t(
                "A simple, transparent process to buy or sell premium equipment",
                "عملية بسيطة وشفافة لشراء أو بيع المعدات الممتازة"
              )}
            </p>
          </div>
        </div>

        <div className="container py-16">
          {/* For Buyers */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-12">
              {t("For Buyers", "للمشترين")}
            </h2>
            <div className="space-y-6">
              {[
                {
                  step: "1",
                  titleEn: "Browse Auctions",
                  titleAr: "استعرض المزادات",
                  descEn: "Search through thousands of active auctions. Filter by category, location, price range, and more to find exactly what you need.",
                  descAr: "ابحث عن آلاف المزادات النشطة. قم بالتصفية حسب الفئة والموقع ونطاق السعر والمزيد للعثور على ما تحتاجه بالضبط.",
                  icon: Search,
                },
                {
                  step: "2",
                  titleEn: "Review Item Details",
                  titleAr: "راجع تفاصيل العنصر",
                  descEn: "View detailed descriptions, multiple high-quality images, seller information, and complete auction terms before bidding.",
                  descAr: "اعرض الأوصاف التفصيلية والصور عالية الجودة ومعلومات البائع وشروط المزاد الكاملة قبل المزايدة.",
                  icon: Gavel,
                },
                {
                  step: "3",
                  titleEn: "Place Your Bid",
                  titleAr: "ضع مزايدتك",
                  descEn: "Enter your bid amount. The system automatically handles bid increments and notifies you if you're outbid.",
                  descAr: "أدخل مبلغ مزايدتك. يتعامل النظام تلقائياً مع زيادات المزايدة ويخطرك إذا تم تجاوز عرضك.",
                  icon: TrendingUp,
                },
                {
                  step: "4",
                  titleEn: "Win & Complete Payment",
                  titleAr: "فز وأكمل الدفع",
                  descEn: "If you win the auction, you'll receive payment instructions. Complete the transaction securely through our platform.",
                  descAr: "إذا فزت بالمزاد، ستتلقى تعليمات الدفع. أكمل المعاملة بأمان من خلال منصتنا.",
                  icon: DollarSign,
                },
                {
                  step: "5",
                  titleEn: "Receive Your Item",
                  titleAr: "استقبل عنصرك",
                  descEn: "Coordinate with the seller for delivery. We provide support throughout the entire process.",
                  descAr: "تنسيق مع البائع للتسليم. نحن نوفر الدعم طوال العملية.",
                  icon: CheckCircle,
                },
              ].map((step, idx) => {
                const IconComponent = step.icon;
                return (
                  <div key={idx} className="flex gap-6 items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-xl">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        {language === 'ar' ? step.titleAr : step.titleEn}
                      </h3>
                      <p className="text-muted-foreground">
                        {language === 'ar' ? step.descAr : step.descEn}
                      </p>
                    </div>
                    {idx < 4 && (
                      <ArrowRight className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-2 hidden md:block" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* For Sellers */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-12">
              {t("For Sellers", "للبائعين")}
            </h2>
            <div className="space-y-6">
              {[
                {
                  step: "1",
                  titleEn: "Create Account",
                  titleAr: "إنشاء حساب",
                  descEn: "Sign up and complete your seller profile. Provide your business information and verification details.",
                  descAr: "قم بالتسجيل وإكمال ملف البائع الخاص بك. قدم معلومات عملك وتفاصيل التحقق.",
                  icon: CheckCircle,
                },
                {
                  step: "2",
                  titleEn: "List Your Item",
                  titleAr: "أدرج عنصرك",
                  descEn: "Upload high-quality images, write detailed descriptions, set starting price and auction duration.",
                  descAr: "قم بتحميل صور عالية الجودة وكتابة أوصاف تفصيلية وتعيين السعر الابتدائي ومدة المزاد.",
                  icon: Search,
                },
                {
                  step: "3",
                  titleEn: "Admin Review",
                  titleAr: "مراجعة الإدارة",
                  descEn: "Our team reviews your listing to ensure quality and compliance. You'll be notified of approval status.",
                  descAr: "يقوم فريقنا بمراجعة قائمتك للتأكد من الجودة والامتثال. سيتم إخطارك بحالة الموافقة.",
                  icon: Gavel,
                },
                {
                  step: "4",
                  titleEn: "Auction Goes Live",
                  titleAr: "المزاد مباشر",
                  descEn: "Your auction is published and buyers can start bidding. Monitor bids in real-time from your dashboard.",
                  descAr: "يتم نشر مزادك ويمكن للمشترين البدء في المزايدة. راقب المزايدات في الوقت الفعلي من لوحة التحكم الخاصة بك.",
                  icon: TrendingUp,
                },
                {
                  step: "5",
                  titleEn: "Complete Sale",
                  titleAr: "إكمال البيع",
                  descEn: "When auction ends, coordinate with buyer for payment and delivery. Receive payment securely.",
                  descAr: "عند انتهاء المزاد، تنسيق مع المشتري للدفع والتسليم. استقبل الدفع بأمان.",
                  icon: DollarSign,
                },
              ].map((step, idx) => {
                const IconComponent = step.icon;
                return (
                  <div key={idx} className="flex gap-6 items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-xl">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        {language === 'ar' ? step.titleAr : step.titleEn}
                      </h3>
                      <p className="text-muted-foreground">
                        {language === 'ar' ? step.descAr : step.descEn}
                      </p>
                    </div>
                    {idx < 4 && (
                      <ArrowRight className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-2 hidden md:block" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-12">
              {t("Frequently Asked Questions", "الأسئلة الشائعة")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  qEn: "Is there a fee to use Sowmnet?",
                  qAr: "هل هناك رسم لاستخدام سومنت؟",
                  aEn: "Buyers can browse and bid for free. Sellers pay a small commission on successful sales.",
                  aAr: "يمكن للمشترين الاستعراض والمزايدة مجاناً. يدفع البائعون عمولة صغيرة على المبيعات الناجحة.",
                },
                {
                  qEn: "How are payments handled?",
                  qAr: "كيف يتم التعامل مع المدفوعات؟",
                  aEn: "We support multiple payment methods. All transactions are secure and protected.",
                  aAr: "نحن ندعم طرق دفع متعددة. جميع المعاملات آمنة ومحمية.",
                },
                {
                  qEn: "What if I'm outbid?",
                  qAr: "ماذا لو تم تجاوز عرضي؟",
                  aEn: "You'll receive an instant notification. You can then place a higher bid if you wish.",
                  aAr: "ستتلقى إخطاراً فورياً. يمكنك بعد ذلك تقديم عرض أعلى إذا أردت.",
                },
                {
                  qEn: "How long do auctions last?",
                  qAr: "كم من الوقت تستمر المزادات؟",
                  aEn: "Auction duration is set by the seller, typically ranging from 3 to 30 days.",
                  aAr: "يتم تحديد مدة المزاد من قبل البائع، عادة ما تتراوح بين 3 إلى 30 يوماً.",
                },
                {
                  qEn: "Can I cancel my bid?",
                  qAr: "هل يمكنني إلغاء مزايدتي؟",
                  aEn: "Bids cannot be cancelled, but you can place a higher bid or let the auction end.",
                  aAr: "لا يمكن إلغاء المزايدات، لكن يمكنك تقديم عرض أعلى أو السماح بانتهاء المزاد.",
                },
                {
                  qEn: "How do I verify a seller?",
                  qAr: "كيف أتحقق من البائع؟",
                  aEn: "All sellers are verified by our team. Look for verification badges on seller profiles.",
                  aAr: "يتم التحقق من جميع البائعين من قبل فريقنا. ابحث عن شارات التحقق على ملفات البائع.",
                },
              ].map((faq, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">
                      {language === 'ar' ? faq.qAr : faq.qEn}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === 'ar' ? faq.aAr : faq.aEn}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-primary/10 rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              {t("Ready to Get Started?", "هل أنت مستعد للبدء؟")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t(
                "Join thousands of buyers and sellers on Sowmnet today",
                "انضم إلى آلاف المشترين والبائعين على سومنت اليوم"
              )}
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="/auctions"
                className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                {t("Browse Auctions", "استعرض المزادات")}
              </a>
              <a
                href="/sell"
                className="inline-block bg-secondary text-secondary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-secondary/90 transition"
              >
                {t("Start Selling", "ابدأ البيع")}
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
