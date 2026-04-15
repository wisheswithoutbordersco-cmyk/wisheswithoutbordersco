import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import { CartDrawer } from "./components/CartDrawer";
import Home from "./pages/Home";

// Lazy-loaded pages — each becomes its own chunk
const GraduationPage = lazy(() => import("./pages/GraduationPage"));
const BirthdayPage = lazy(() => import("./pages/BirthdayPage"));
const AnniversaryPage = lazy(() => import("./pages/AnniversaryPage"));
const CongratulationsPage = lazy(() => import("./pages/CongratulationsPage"));
const ThankYouPage = lazy(() => import("./pages/ThankYouPage"));
const ThinkingOfYouPage = lazy(() => import("./pages/ThinkingOfYouPage"));
const GetWellPage = lazy(() => import("./pages/GetWellPage"));
const SympathyPage = lazy(() => import("./pages/SympathyPage"));
const MothersDayPage = lazy(() => import("./pages/MothersDayPage"));
const FathersDayPage = lazy(() => import("./pages/FathersDayPage"));
const KidsClassroomPage = lazy(() => import("./pages/KidsClassroomPage"));
const GlobalVibesPage = lazy(() => import("./pages/GlobalVibesPage"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage"));
const BabyShowerPage = lazy(() => import("./pages/BabyShowerPage"));
const ActivityWorksheetsPage = lazy(() => import("./pages/ActivityWorksheetsPage"));
const FlashcardsPage = lazy(() => import("./pages/FlashcardsPage"));
const ColoringBooksPage = lazy(() => import("./pages/ColoringBooksPage"));
const CookbooksPage = lazy(() => import("./pages/CookbooksPage"));
const WallArtPage = lazy(() => import("./pages/WallArtPage"));
const NewYearPage = lazy(() => import("./pages/NewYearPage"));
const InLovingMemoryPage = lazy(() => import("./pages/InLovingMemoryPage"));
const AdminSubscribersPage = lazy(() => import("./pages/AdminSubscribersPage"));
const AdminOrdersPage = lazy(() => import("./pages/AdminOrdersPage"));
const MyOrdersPage = lazy(() => import("./pages/MyOrdersPage"));
const PrintShopPage = lazy(() => import("./pages/PrintShopPage"));
const PrintShopWallArtPage = lazy(() => import("./pages/PrintShopCategoryPage").then(m => ({ default: m.PrintShopWallArtPage })));
const PrintShopCountryPage = lazy(() => import("./pages/PrintShopCategoryPage").then(m => ({ default: m.PrintShopCountryPage })));
const PrintShopKidsPage = lazy(() => import("./pages/PrintShopCategoryPage").then(m => ({ default: m.PrintShopKidsPage })));
const PrintShopTeacherPage = lazy(() => import("./pages/PrintShopCategoryPage").then(m => ({ default: m.PrintShopTeacherPage })));
const PrintShopHolidaysPage = lazy(() => import("./pages/PrintShopCategoryPage").then(m => ({ default: m.PrintShopHolidaysPage })));
const PrintShopSpecialEditionsPage = lazy(() => import("./pages/PrintShopCategoryPage").then(m => ({ default: m.PrintShopSpecialEditionsPage })));
const ChildrensBooksPage = lazy(() => import("./pages/ChildrensBooksPage").then(m => ({ default: m.ChildrensBooksPage })));
const SearchPage = lazy(() => import("./pages/SearchPage").then(m => ({ default: m.SearchPage })));
const EarlyReadersPage = lazy(() => import("./pages/CategoryShellPage").then(m => ({ default: m.EarlyReadersPage })));
const CulturalStorybooksPage = lazy(() => import("./pages/CategoryShellPage").then(m => ({ default: m.CulturalStorybooksPage })));
const SELKitsPage = lazy(() => import("./pages/CategoryShellPage").then(m => ({ default: m.SELKitsPage })));
const ClassroomResourcesPage = lazy(() => import("./pages/CategoryShellPage").then(m => ({ default: m.ClassroomResourcesPage })));
const ColoringPagesPage = lazy(() => import("./pages/CategoryShellPage").then(m => ({ default: m.ColoringPagesPage })));
const WorksheetsPage = lazy(() => import("./pages/CategoryShellPage").then(m => ({ default: m.WorksheetsPage })));
const BestSellersPage = lazy(() => import("./pages/CategoryShellPage").then(m => ({ default: m.BestSellersPage })));
const NewArrivalsPage = lazy(() => import("./pages/CategoryShellPage").then(m => ({ default: m.NewArrivalsPage })));
const EditorPicksPage = lazy(() => import("./pages/CategoryShellPage").then(m => ({ default: m.EditorPicksPage })));
const CulturalCollectionsPage = lazy(() => import("./pages/CategoryShellPage").then(m => ({ default: m.CulturalCollectionsPage })));
const SeasonalCollectionsPage = lazy(() => import("./pages/CategoryShellPage").then(m => ({ default: m.SeasonalCollectionsPage })));
const TeacherFavoritesPage = lazy(() => import("./pages/CategoryShellPage").then(m => ({ default: m.TeacherFavoritesPage })));
const KidsFavoritesPage = lazy(() => import("./pages/CategoryShellPage").then(m => ({ default: m.KidsFavoritesPage })));
const BooksHubPage = lazy(() => import("./pages/CategoryShellPage").then(m => ({ default: m.BooksHubPage })));
const EducationHubPage = lazy(() => import("./pages/CategoryShellPage").then(m => ({ default: m.EducationHubPage })));
const CollectionsHubPage = lazy(() => import("./pages/CategoryShellPage").then(m => ({ default: m.CollectionsHubPage })));
const CountryPage = lazy(() => import("./pages/CountryPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const ComingSoonPage = lazy(() => import("./pages/ComingSoonPage"));
const DigitalProductDetailPage = lazy(() => import("./pages/DigitalProductDetailPage"));

function Router() {
  return (
    <Switch>
      {/* Home */}
      <Route path="/" component={Home} />

      {/* Greeting Cards */}
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
      <Route path="/new-year" component={NewYearPage} />
      <Route path="/in-loving-memory" component={InLovingMemoryPage} />
      <Route path="/baby-shower" component={BabyShowerPage} />

      {/* Country pages — dynamic, one route for all 188 countries */}
      <Route path="/country/:slug" component={CountryPage} />

      {/* Bundles / Digital */}
      <Route path="/kids-classroom" component={KidsClassroomPage} />
      <Route path="/global-vibes" component={GlobalVibesPage} />
      <Route path="/activity-workbooks" component={ActivityWorksheetsPage} />
      <Route path="/flashcards" component={FlashcardsPage} />
      <Route path="/coloring-books" component={ColoringBooksPage} />
      <Route path="/cookbooks" component={CookbooksPage} />
      <Route path="/wall-art" component={WallArtPage} />

      {/* Books hub + subcategories */}
      <Route path="/books" component={BooksHubPage} />
      <Route path="/books/childrens" component={ChildrensBooksPage} />
      <Route path="/books/early-readers" component={EarlyReadersPage} />
      <Route path="/books/storybooks" component={CulturalStorybooksPage} />

      {/* Education hub + subcategories */}
      <Route path="/education" component={EducationHubPage} />
      <Route path="/education/sel-kits" component={SELKitsPage} />
      <Route path="/education/classroom-resources" component={ClassroomResourcesPage} />
      <Route path="/education/coloring-pages" component={ColoringPagesPage} />
      <Route path="/education/worksheets" component={WorksheetsPage} />

      {/* Collections hub + subcategories */}
      <Route path="/collections" component={CollectionsHubPage} />
      <Route path="/collections/best-sellers" component={BestSellersPage} />
      <Route path="/collections/new-arrivals" component={NewArrivalsPage} />
      <Route path="/collections/editors-picks" component={EditorPicksPage} />
      <Route path="/collections/cultural" component={CulturalCollectionsPage} />
      <Route path="/collections/seasonal" component={SeasonalCollectionsPage} />
      <Route path="/collections/teacher-favorites" component={TeacherFavoritesPage} />
      <Route path="/collections/kids-favorites" component={KidsFavoritesPage} />

      {/* Print Shop routes */}
      <Route path="/print-shop" component={PrintShopPage} />
      <Route path="/print-shop/wall-art" component={PrintShopWallArtPage} />
      <Route path="/print-shop/country" component={PrintShopCountryPage} />
      <Route path="/print-shop/kids" component={PrintShopKidsPage} />
      <Route path="/print-shop/teacher" component={PrintShopTeacherPage} />
      <Route path="/print-shop/holidays" component={PrintShopHolidaysPage} />
      <Route path="/print-shop/special-editions" component={PrintShopSpecialEditionsPage} />

      {/* WWB Digital Products — dedicated product pages */}
      <Route path="/the-human-operating-system" component={DigitalProductDetailPage} />
      <Route path="/unmasked-life-toolkit-autistic-adults" component={DigitalProductDetailPage} />
      <Route path="/neuro-inclusive-sped-starter-bundle" component={DigitalProductDetailPage} />
      <Route path="/memory-keepers-grandparent-grandchild-quest-book" component={DigitalProductDetailPage} />
      <Route path="/the-empty-chair-holiday-grief-survival-guide" component={DigitalProductDetailPage} />
      <Route path="/christmas-operating-system-december-survival-guide" component={DigitalProductDetailPage} />
      <Route path="/neon-dino-dark-mode-activity-book" component={DigitalProductDetailPage} />
      <Route path="/the-great-dinosaur-rescue-childrens-book" component={DigitalProductDetailPage} />
      <Route path="/golden-years-care-bundle-senior-caregiver" component={DigitalProductDetailPage} />
      <Route path="/living-well-multiple-health-conditions-guide" component={DigitalProductDetailPage} />
      <Route path="/i-am-brilliant-multicultural-affirmation-kit" component={DigitalProductDetailPage} />
      <Route path="/welcomeback-kit-classroom-transition-system" component={DigitalProductDetailPage} />

      {/* Universal product detail */}
      <Route path="/product/:id" component={ProductDetailPage} />

      {/* Orders */}
      <Route path="/order-success" component={OrderSuccessPage} />
      <Route path="/my-orders" component={MyOrdersPage} />

      {/* Admin */}
      <Route path="/admin/subscribers" component={AdminSubscribersPage} />
      <Route path="/admin/orders" component={AdminOrdersPage} />

      {/* Search */}
      <Route path="/search" component={SearchPage} />

      {/* Coming Soon */}
      <Route path="/coming-soon" component={ComingSoonPage} />
      {/* Legal */}
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      {/* Fallback */}
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
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen" />}>
              <Router />
            </Suspense>
            <CartDrawer />
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
