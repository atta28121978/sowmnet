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

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/auctions" component={Auctions} />
      <Route path="/auction/:id" component={AuctionDetail} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/sell" component={SellItem} />
      <Route path="/my-auctions" component={MyAuctions} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/auctions" component={AdminAuctions} />
      <Route path="/admin/users" component={AdminUsers} />
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
