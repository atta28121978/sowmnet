import { useLanguage } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicy() {
  const { t, language } = useLanguage();

  const sections = [
    {
      titleEn: "1. Introduction",
      titleAr: "1. المقدمة",
      contentEn: "Sowmnet ('we', 'us', 'our', or 'Company') operates the Sowmnet.com website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.",
      contentAr: "تشغل سومنت ('نحن'، 'لنا'، 'لنا'، أو 'الشركة') موقع Sowmnet.com. تخبرك هذه الصفحة عن سياساتنا بشأن جمع واستخدام والكشف عن البيانات الشخصية عند استخدام خدمتنا والخيارات التي لديك المرتبطة بتلك البيانات.",
    },
    {
      titleEn: "2. Information Collection and Use",
      titleAr: "2. جمع المعلومات والاستخدام",
      contentEn: "We collect several different types of information for various purposes to provide and improve our Service to you. Types of data collected include: Personal Data (name, email address, phone number, cookies and usage data), and Device Data (browser type, IP address, device type).",
      contentAr: "نجمع عدة أنواع مختلفة من المعلومات لأغراض مختلفة لتوفير وتحسين خدمتنا لك. تشمل أنواع البيانات المجمعة: البيانات الشخصية (الاسم وعنوان البريد الإلكتروني ورقم الهاتف وملفات تعريف الارتباط وبيانات الاستخدام)، وبيانات الجهاز (نوع المتصفح وعنوان IP ونوع الجهاز).",
    },
    {
      titleEn: "3. Use of Data",
      titleAr: "3. استخدام البيانات",
      contentEn: "Sowmnet uses the collected data for various purposes: to provide and maintain our Service; to notify you about changes to our Service; to allow you to participate in interactive features of our Service; to provide customer support; to gather analysis or valuable information so that we can improve our Service; to monitor the usage of our Service; to detect, prevent and address technical issues.",
      contentAr: "تستخدم سومنت البيانات المجمعة لأغراض مختلفة: لتوفير والحفاظ على خدمتنا؛ لإخطارك بالتغييرات على خدمتنا؛ للسماح لك بالمشاركة في الميزات التفاعلية لخدمتنا؛ لتقديم دعم العملاء؛ لجمع التحليلات أو المعلومات القيمة حتى نتمكن من تحسين خدمتنا؛ لمراقبة استخدام خدمتنا؛ للكشف ومنع ومعالجة المشاكل التقنية.",
    },
    {
      titleEn: "4. Security of Data",
      titleAr: "4. أمان البيانات",
      contentEn: "The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.",
      contentAr: "أمان بيانات أهمية لنا ولكن تذكر أنه لا توجد طريقة لنقل البيانات عبر الإنترنت أو طريقة التخزين الإلكتروني آمنة بنسبة 100٪. بينما نسعى جاهدين لاستخدام وسائل مقبولة تجاريًا لحماية بيانات الشخصية الخاصة بك، لا يمكننا ضمان أمانها المطلق.",
    },
    {
      titleEn: "5. Changes to This Privacy Policy",
      titleAr: "5. التغييرات على سياسة الخصوصية هذه",
      contentEn: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'effective date' at the top of this Privacy Policy.",
      contentAr: "قد نقوم بتحديث سياسة الخصوصية الخاصة بنا من وقت لآخر. سنخطرك بأي تغييرات بنشر سياسة الخصوصية الجديدة على هذه الصفحة وتحديث 'تاريخ السريان' في أعلى سياسة الخصوصية هذه.",
    },
    {
      titleEn: "6. Contact Us",
      titleAr: "6. اتصل بنا",
      contentEn: "If you have any questions about this Privacy Policy, please contact us by email at privacy@sowmnet.com or by mail at our registered office address.",
      contentAr: "إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا عبر البريد الإلكتروني على privacy@sowmnet.com أو بالبريد إلى عنوان مكتبنا المسجل.",
    },
    {
      titleEn: "7. Cookies",
      titleAr: "7. ملفات تعريف الارتباط",
      contentEn: "We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.",
      contentAr: "نستخدم ملفات تعريف الارتباط وتقنيات التتبع المماثلة لتتبع النشاط على خدمتنا والاحتفاظ بمعلومات معينة. يمكنك إرشاد متصفحك برفض جميع ملفات تعريف الارتباط أو للإشارة عند إرسال ملف تعريف ارتباط. ومع ذلك، إذا كنت لا تقبل ملفات تعريف الارتباط، فقد لا تتمكن من استخدام بعض أجزاء خدمتنا.",
    },
    {
      titleEn: "8. Third-Party Links",
      titleAr: "8. روابط الطرف الثالث",
      contentEn: "Our Service may contain links to other sites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.",
      contentAr: "قد تحتوي خدمتنا على روابط إلى مواقع أخرى لا تديرها. إذا نقرت على رابط طرف ثالث، سيتم توجيهك إلى موقع هذا الطرف الثالث. نحن ننصحك بشدة بمراجعة سياسة الخصوصية لكل موقع تزوره.",
    },
    {
      titleEn: "9. Children's Privacy",
      titleAr: "9. خصوصية الأطفال",
      contentEn: "Our Service does not address anyone under the age of 18 ('Children'). We do not knowingly collect personally identifiable information from anyone under the age of 18. If we become aware that we have collected personal data from a child under 18, we will take steps to delete such information.",
      contentAr: "لا تتعامل خدمتنا مع أي شخص تحت سن 18 ('الأطفال'). نحن لا نجمع عن قصد معلومات تحديد الهوية الشخصية من أي شخص تحت سن 18. إذا أدركنا أننا جمعنا بيانات شخصية من طفل تحت سن 18، فسنتخذ خطوات لحذف هذه المعلومات.",
    },
    {
      titleEn: "10. Your Rights",
      titleAr: "10. حقوقك",
      contentEn: "You have the right to access, update, or delete the information we have on you. You may also have the right to restrict or object to certain processing of your personal data. To exercise these rights, please contact us at privacy@sowmnet.com.",
      contentAr: "لديك الحق في الوصول إلى المعلومات التي لدينا عنك أو تحديثها أو حذفها. قد يكون لديك أيضاً الحق في تقييد أو الاعتراض على معالجة معينة لبيانات الشخصية الخاصة بك. لممارسة هذه الحقوق، يرجى الاتصال بنا على privacy@sowmnet.com.",
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
              {t("Privacy Policy", "سياسة الخصوصية")}
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
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <p className="text-muted-foreground">
                  {t(
                    "We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.",
                    "نحن ملتزمون بحماية خصوصيتك. تشرح سياسة الخصوصية هذه كيفية جمع واستخدام والكشف وحماية معلوماتك عند زيارة موقعنا."
                  )}
                </p>
              </CardContent>
            </Card>

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
                  {t("Data Protection Officer", "مسؤول حماية البيانات")}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {t(
                    "If you have any concerns about how we handle your personal data, please contact our Data Protection Officer:",
                    "إذا كان لديك أي مخاوف حول كيفية تعاملنا مع بيانات الشخصية الخاصة بك، يرجى الاتصال بمسؤول حماية البيانات الخاص بنا:"
                  )}
                </p>
                <p className="font-semibold">
                  {t("Email:", "البريد الإلكتروني:")} dpo@sowmnet.com
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
