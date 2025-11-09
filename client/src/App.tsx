import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Auctions from "./pages/Auctions";
import AuctionDetail from "./pages/AuctionDetail";
import Dashboard from "./pages/Dashboard";
import SellItem from "./pages/SellItem";
import MyAuctions from "./pages/MyAuctions";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAuctions from "./pages/admin/AdminAuctions";
import AdminUsers from "./pages/admin/AdminUsers";
import AboutUs from "./pages/AboutUs";
import HowItWorks from "./pages/HowItWorks";
import ContactUs from "./pages/ContactUs";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import MyBids from "./pages/MyBids";
import MyWatchlist from "./pages/MyWatchlist";
import MyWinnings from "./pages/MyWinnings";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminLocations from "./pages/admin/AdminLocations";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/about" component={AboutUs} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/contact" component={ContactUs} />
      <Route path="/terms" component={TermsConditions} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/auctions" component={Auctions} />
      <Route path="/auction/:id" component={AuctionDetail} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/sell" component={SellItem} />
      <Route path="/my-auctions" component={MyAuctions} />
      <Route path="/my-bids" component={MyBids} />
      <Route path="/my-watchlist" component={MyWatchlist} />
      <Route path="/my-winnings" component={MyWinnings} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/auctions" component={AdminAuctions} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/categories" component={AdminCategories} />
      <Route path="/admin/locations" component={AdminLocations} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
