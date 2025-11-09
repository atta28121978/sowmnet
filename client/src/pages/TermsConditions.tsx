import { useLanguage } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsConditions() {
  const { t, language } = useLanguage();

  const sections = [
    {
      titleEn: "1. Acceptance of Terms",
      titleAr: "1. قبول الشروط",
      contentEn: "By accessing and using Sowmnet, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
      contentAr: "بالوصول واستخدام سومنت، فإنك توافق وتوافق على الالتزام بشروط وأحكام هذا الاتفاق. إذا كنت لا توافق على الامتثال للأعلى، يرجى عدم استخدام هذه الخدمة.",
    },
    {
      titleEn: "2. Use License",
      titleAr: "2. ترخيص الاستخدام",
      contentEn: "Permission is granted to temporarily download one copy of the materials (information or software) on Sowmnet for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose or for any public display; attempt to decompile, disassemble, or reverse engineer any software contained on Sowmnet.",
      contentAr: "يتم منح الإذن بتنزيل مؤقت لنسخة واحدة من المواد (المعلومات أو البرامج) على سومنت لأغراض العرض الشخصية غير التجارية المؤقتة فقط. هذا منح ترخيص وليس نقل ملكية، وبموجب هذا الترخيص قد لا تقوم بـ: تعديل أو نسخ المواد؛ استخدام المواد لأي غرض تجاري أو لأي عرض عام؛ محاولة فك تجميع أو فك تجميع أو إعادة هندسة أي برنامج موجود على سومنت.",
    },
    {
      titleEn: "3. Disclaimer",
      titleAr: "3. إخلاء المسؤولية",
      contentEn: "The materials on Sowmnet are provided on an 'as is' basis. Sowmnet makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
      contentAr: "يتم توفير المواد على سومنت على أساس 'كما هي'. لا تقدم سومنت أي ضمانات، صريحة أو ضمنية، وبموجب هذا تخلي وتنفي جميع الضمانات الأخرى بما في ذلك، على سبيل المثال لا الحصر، الضمانات الضمنية أو شروط القابلية للتسويق أو الملاءمة لغرض معين أو عدم انتهاك الملكية الفكرية أو انتهاك آخر للحقوق.",
    },
    {
      titleEn: "4. Limitations",
      titleAr: "4. القيود",
      contentEn: "In no event shall Sowmnet or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Sowmnet, even if Sowmnet or a Sowmnet authorized representative has been notified orally or in writing of the possibility of such damage.",
      contentAr: "في أي حال من الأحوال، لن تكون سومنت أو مورديها مسؤولة عن أي أضرار (بما في ذلك، على سبيل المثال لا الحصر، الأضرار الناجمة عن فقدان البيانات أو الأرباح، أو بسبب انقطاع العمل) الناشئة عن استخدام أو عدم القدرة على استخدام المواد على سومنت، حتى لو تم إخطار سومنت أو ممثل سومنت المرخص له شفويًا أو كتابيًا بإمكانية حدوث مثل هذا الضرر.",
    },
    {
      titleEn: "5. Accuracy of Materials",
      titleAr: "5. دقة المواد",
      contentEn: "The materials appearing on Sowmnet could include technical, typographical, or photographic errors. Sowmnet does not warrant that any of the materials on Sowmnet are accurate, complete, or current. Sowmnet may make changes to the materials contained on Sowmnet at any time without notice.",
      contentAr: "قد تتضمن المواد الموجودة على سومنت أخطاء تقنية أو إملائية أو فوتوغرافية. لا تضمن سومنت أن أي من المواد الموجودة على سومنت دقيقة أو كاملة أو حالية. قد تقوم سومنت بإجراء تغييرات على المواد الموجودة على سومنت في أي وقت دون إشعار.",
    },
    {
      titleEn: "6. Links",
      titleAr: "6. الروابط",
      contentEn: "Sowmnet has not reviewed all of the sites linked to its Internet web site and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Sowmnet of the site. Use of any such linked website is at the user's own risk.",
      contentAr: "لم تقم سومنت بمراجعة جميع المواقع المرتبطة بموقعها على الويب وليست مسؤولة عن محتويات أي موقع مرتبط بهذا الشكل. لا يعني إدراج أي رابط موافقة سومنت على الموقع. يتم استخدام أي موقع ويب مرتبط بهذا الشكل على مسؤولية المستخدم الخاصة.",
    },
    {
      titleEn: "7. Modifications",
      titleAr: "7. التعديلات",
      contentEn: "Sowmnet may revise these terms of service for Sowmnet at any time without notice. By using this web site, you are agreeing to be bound by the then current version of these terms of service.",
      contentAr: "قد تقوم سومنت بمراجعة شروط الخدمة هذه في أي وقت دون إشعار. باستخدام موقع الويب هذا، فإنك توافق على الالتزام بالإصدار الحالي من شروط الخدمة هذه.",
    },
    {
      titleEn: "8. Governing Law",
      titleAr: "8. القانون الحاكم",
      contentEn: "These terms and conditions are governed by and construed in accordance with the laws of Saudi Arabia, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.",
      contentAr: "تخضع هذه الشروط والأحكام وتُفسر وفقاً لقوانين المملكة العربية السعودية، وتخضع بشكل لا رجعة فيه للاختصاص الحصري للمحاكم في تلك الموقع.",
    },
    {
      titleEn: "9. Auction Rules",
      titleAr: "9. قواعد المزاد",
      contentEn: "All auctions on Sowmnet are binding contracts. By placing a bid, you agree to purchase the item at your bid price if you are the winning bidder. Sellers must accurately describe items and provide honest information about condition and functionality.",
      contentAr: "جميع المزادات على سومنت عقود ملزمة. بتقديم مزايدة، فإنك توافق على شراء العنصر بسعر مزايدتك إذا كنت المزايد الفائز. يجب على البائعين وصف العناصر بدقة وتقديم معلومات صادقة عن الحالة والوظيفة.",
    },
    {
      titleEn: "10. Prohibited Activities",
      titleAr: "10. الأنشطة المحظورة",
      contentEn: "Users may not engage in fraudulent bidding, shill bidding, bid manipulation, or any other dishonest practices. Sowmnet reserves the right to suspend or terminate accounts of users who violate these rules.",
      contentAr: "لا يجوز للمستخدمين الانخراط في المزايدة الاحتيالية أو المزايدة الوهمية أو معالجة المزايدة أو أي ممارسات غير صادقة أخرى. تحتفظ سومنت بالحق في تعليق أو إنهاء حسابات المستخدمين الذين ينتهكون هذه القواعد.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("Terms & Conditions", "الشروط والأحكام")}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t(
                "Last updated: January 2025",
                "آخر تحديث: يناير 2025"
              )}
            </p>
          </div>
        </div>

        <div className="container py-16">
          <div className="max-w-4xl mx-auto space-y-6">
            {sections.map((section, idx) => (
              <Card key={idx}>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {language === 'ar' ? section.titleAr : section.titleEn}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {language === 'ar' ? section.contentAr : section.contentEn}
                  </p>
                </CardContent>
              </Card>
            ))}

            {/* Contact Section */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">
                  {t("Questions?", "أسئلة؟")}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {t(
                    "If you have any questions about these Terms & Conditions, please contact us at:",
                    "إذا كان لديك أي أسئلة حول هذه الشروط والأحكام، يرجى الاتصال بنا على:"
                  )}
                </p>
                <p className="font-semibold">
                  {t("Email:", "البريد الإلكتروني:")} legal@sowmnet.com
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
