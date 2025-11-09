import { useLanguage } from "@/contexts/LanguageContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactUs() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(
        t(
          "Message sent successfully! We'll get back to you soon.",
          "تم إرسال الرسالة بنجاح! سنعود إليك قريباً."
        )
      );
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      toast.error(t("Error sending message", "خطأ في إرسال الرسالة"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("Contact Us", "اتصل بنا")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              {t(
                "Have questions? We're here to help. Get in touch with our team.",
                "هل لديك أسئلة؟ نحن هنا للمساعدة. تواصل مع فريقنا."
              )}
            </p>
          </div>
        </div>

        <div className="container py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Contact Info Cards */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Mail className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">
                      {t("Email", "البريد الإلكتروني")}
                    </h3>
                    <p className="text-muted-foreground">info@sowmnet.com</p>
                    <p className="text-muted-foreground">support@sowmnet.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Phone className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">
                      {t("Phone", "الهاتف")}
                    </h3>
                    <p className="text-muted-foreground">+966 XX XXX XXXX</p>
                    <p className="text-muted-foreground">+966 XX XXX XXXX</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <MapPin className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">
                      {t("Address", "العنوان")}
                    </h3>
                    <p className="text-muted-foreground">Riyadh, Saudi Arabia</p>
                    <p className="text-muted-foreground">Middle East Region</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>{t("Send us a Message", "أرسل لنا رسالة")}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>{t("Full Name", "الاسم الكامل")} *</Label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder={t("Your name", "اسمك")}
                    />
                  </div>

                  <div>
                    <Label>{t("Email Address", "عنوان البريد الإلكتروني")} *</Label>
                    <Input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder={t("your@email.com", "your@email.com")}
                    />
                  </div>

                  <div>
                    <Label>{t("Phone Number", "رقم الهاتف")}</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder={t("Your phone number", "رقم هاتفك")}
                    />
                  </div>

                  <div>
                    <Label>{t("Subject", "الموضوع")} *</Label>
                    <Input
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      placeholder={t("How can we help?", "كيف يمكننا مساعدتك؟")}
                    />
                  </div>

                  <div>
                    <Label>{t("Message", "الرسالة")} *</Label>
                    <Textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder={t(
                        "Tell us more about your inquiry",
                        "أخبرنا المزيد عن استفسارك"
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting
                      ? t("Sending...", "جاري الإرسال...")
                      : t("Send Message", "إرسال الرسالة")}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Business Hours & Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex gap-2">
                    <Clock className="h-5 w-5" />
                    {t("Business Hours", "ساعات العمل")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("Saturday - Thursday", "السبت - الخميس")}
                    </span>
                    <span className="font-semibold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("Friday", "الجمعة")}
                    </span>
                    <span className="font-semibold">
                      {t("Closed", "مغلق")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("Public Holidays", "الأعياد الرسمية")}
                    </span>
                    <span className="font-semibold">
                      {t("Closed", "مغلق")}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("Support Options", "خيارات الدعم")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">
                      {t("General Inquiries", "الاستفسارات العامة")}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      info@sowmnet.com
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      {t("Technical Support", "الدعم الفني")}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      support@sowmnet.com
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      {t("Seller Support", "دعم البائع")}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      sellers@sowmnet.com
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      {t("Buyer Support", "دعم المشتري")}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      buyers@sowmnet.com
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("Response Time", "وقت الاستجابة")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {t(
                      "We typically respond to inquiries within 24 hours during business days.",
                      "نرد عادة على الاستفسارات في غضون 24 ساعة خلال أيام العمل."
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
