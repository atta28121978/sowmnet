import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Bell, Gavel, Heart, User, LogOut, Menu } from "lucide-react";
import { Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: unreadCount } = trpc.notification.getUnreadCount.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Gavel className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">{APP_TITLE}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/auctions" className="text-sm font-medium hover:text-primary transition-colors">
              {t("Auctions", "المزادات")}
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">
              {t("Categories", "الفئات")}
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              {t("How It Works", "كيف يعمل")}
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Link href="/notifications">
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount && unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Button>
                </Link>

                {/* Watchlist */}
                <Link href="/watchlist">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-sm font-medium">
                      {user?.name || user?.email}
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        {t("Dashboard", "لوحة التحكم")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/my-bids" className="cursor-pointer">
                        {t("My Bids", "مزايداتي")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/my-auctions" className="cursor-pointer">
                        {t("My Auctions", "مزاداتي")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/sell" className="cursor-pointer">
                        {t("Sell an Item", "بيع عنصر")}
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === 'admin' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer text-primary">
                            {t("Admin Panel", "لوحة الإدارة")}
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                      <LogOut className="h-4 w-4 mr-2" />
                      {t("Logout", "تسجيل الخروج")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild>
                <a href={getLoginUrl()}>{t("Sign In", "تسجيل الدخول")}</a>
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-2">
            <Link href="/auctions" className="block px-4 py-2 hover:bg-accent rounded-md">
              {t("Auctions", "المزادات")}
            </Link>
            <Link href="/categories" className="block px-4 py-2 hover:bg-accent rounded-md">
              {t("Categories", "الفئات")}
            </Link>
            <Link href="/how-it-works" className="block px-4 py-2 hover:bg-accent rounded-md">
              {t("How It Works", "كيف يعمل")}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
