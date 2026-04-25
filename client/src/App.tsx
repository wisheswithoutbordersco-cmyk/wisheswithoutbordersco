import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import { CartDrawer } from "./components/CartDrawer";
import Home from "./pages/Home";
import GraduationPage from "./pages/GraduationPage";
import BirthdayPage from "./pages/BirthdayPage";
import AnniversaryPage from "./pages/AnniversaryPage";
import CongratulationsPage from "./pages/CongratulationsPage";
import ThankYouPage from "./pages/ThankYouPage";
import ThinkingOfYouPage from "./pages/ThinkingOfYouPage";
import GetWellPage from "./pages/GetWellPage";
import SympathyPage from "./pages/SympathyPage";
import MothersDayPage from "./pages/MothersDayPage";
import FathersDayPage from "./pages/FathersDayPage";
import KidsClassroomPage from "./pages/KidsClassroomPage";
import GlobalVibesPage from "./pages/GlobalVibesPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import BabyShowerPage from "./pages/BabyShowerPage";
import ActivityWorksheetsPage from "./pages/ActivityWorksheetsPage";
import FlashcardsPage from "./pages/FlashcardsPage";
import ColoringBooksPage from "./pages/ColoringBooksPage";
import CookbooksPage from "./pages/CookbooksPage";
import ChildrensBooksPage from "./pages/ChildrensBooksPage";
import WallArtPage from "./pages/WallArtPage";
import NewYearPage from "./pages/NewYearPage";
import InLovingMemoryPage from "./pages/InLovingMemoryPage";
import AdminSubscribersPage from "./pages/AdminSubscribersPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import PrintShopPage from "./pages/PrintShopPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import AdminCmsPage from "./pages/AdminCmsPage";
import AdminCmsLoginPage from "./pages/AdminCmsLoginPage";
import AdminProductsPage from "./pages/AdminProductsPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/graduation" component={GraduationPage} />
      <Route path="/birthday" component={BirthdayPage} />
      <Route path="/anniversary" component={AnniversaryPage} />
      <Route path="/congratulations" component={CongratulationsPage} />
      <Route path="/thank-you" component={ThankYouPage} />
      <Route path="/thinking-of-you" component={ThinkingOfYouPage} />
      <Route path="/get-well" component={GetWellPage} />
      <Route path="/sympathy" component={SympathyPage} />
      <Route path="/mothers-day" component={MothersDayPage} />
      <Route path="/fathers-day" component={FathersDayPage} />
      <Route path="/kids-classroom" component={KidsClassroomPage} />
      <Route path="/global-vibes" component={GlobalVibesPage} />
      <Route path="/order-success" component={OrderSuccessPage} />
      <Route path="/my-orders" component={MyOrdersPage} />
      <Route path="/baby-shower" component={BabyShowerPage} />
      <Route path="/activity-workbooks" component={ActivityWorksheetsPage} />
      <Route path="/flashcards" component={FlashcardsPage} />
      <Route path="/coloring-books" component={ColoringBooksPage} />
      <Route path="/cookbooks" component={CookbooksPage} />
      <Route path="/children-books" component={ChildrensBooksPage} />
      <Route path="/wall-art" component={WallArtPage} />
      <Route path="/new-year" component={NewYearPage} />
      <Route path="/in-loving-memory" component={InLovingMemoryPage} />
      <Route path="/admin/subscribers" component={AdminSubscribersPage} />
      <Route path="/admin/orders" component={AdminOrdersPage} />
      <Route path="/print-shop" component={PrintShopPage} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/admin/cms" component={AdminCmsPage} />
      <Route path="/admin/products" component={AdminProductsPage} />
      <Route path="/admin/cms/login" component={AdminCmsLoginPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <CartDrawer />
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
