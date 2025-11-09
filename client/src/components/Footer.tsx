import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { Gavel } from "lucide-react";
import { APP_TITLE } from "@/const";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-muted/50 mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Gavel className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">{APP_TITLE}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t(
                "The leading auction platform for heavy machinery and equipment in the Middle East.",
                "منصة المزادات الرائدة للآلات الثقيلة والمعدات في الشرق الأوسط."
              )}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{t("Quick Links", "روابط سريعة")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auctions" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("Browse Auctions", "تصفح المزادات")}
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("Categories", "الفئات")}
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("Sell an Item", "بيع عنصر")}
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("How It Works", "كيف يعمل")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">{t("Support", "الدعم")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("Contact Us", "اتصل بنا")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("FAQ", "الأسئلة الشائعة")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("Terms & Conditions", "الشروط والأحكام")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("Privacy Policy", "سياسة الخصوصية")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">{t("Contact", "اتصل")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{t("Email:", "البريد الإلكتروني:")} info@sowmnet.com</li>
              <li>{t("Phone:", "الهاتف:")} +966 XX XXX XXXX</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {APP_TITLE}. {t("All rights reserved.", "جميع الحقوق محفوظة.")}
          </p>
        </div>
      </div>
    </footer>
  );
}
