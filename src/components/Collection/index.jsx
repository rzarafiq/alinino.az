import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaRegStar, FaRegCommentDots, FaMinus, FaPlus, FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight, FaChevronDown, FaWhatsapp, FaChevronUp } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";
import { RiCloseFill} from "react-icons/ri";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Slider } from 'antd';
import 'antd/dist/reset.css';
import ReCAPTCHA from "react-google-recaptcha";
import { getAllProducts, getAllCategories, fetchProductsByCategory } from '../../services/index';
import { scrollTop } from "../../utility/scrollTop";
import alinino_logo from "../../assets/img/alinino_logo.png";

function Collection() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [navigationStack, setNavigationStack] = useState([{ type: "root", label: "Kataloq" }]);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sliderValues, setSliderValues] = useState([0, 100]);
  const [isThemeOpen, setIsThemeOpen] = useState(true);
  const [selectedThemes, setSelectedThemes] = useState(new Set());
  const [isGenreOpen, setIsGenreOpen] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState(new Set());
  const [isAuthorOpen, setIsAuthorOpen] = useState(true);
  const [selectedAuthors, setSelectedAuthors] = useState(new Set());
  const [isLanguageOpen, setIsLanguageOpen] = useState(true);
  const [selectedLanguages, setSelectedLanguages] = useState(new Set());
  const [isSeriesOpen, setIsSeriesOpen] = useState(true);
  const [selectedSeries, setSelectedSeries] = useState(new Set());
  const [isBrandOpen, setIsBrandOpen] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState(new Set());
  const [isPageCountOpen, setIsPageCountOpen] = useState(true);
  const [selectedPageCounts, setSelectedPageCounts] = useState(new Set());
  const [cartQuantities, setCartQuantities] = useState({});
  const [likedProductIds, setLikedProductIds] = useState({});
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [isViewedBeginning, setIsViewedBeginning] = useState(true);
  const [isViewedEnd, setIsViewedEnd] = useState(false);
  const viewedSwiperRef = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFirstSlide, setIsFirstSlide] = useState(true);
  const [isLastSlide, setIsLastSlide] = useState(false);
  const swiperRef = useRef(null);
  const modalRef = useRef(null);
  const [isFavoritesLimitOpen, setIsFavoritesLimitOpen] = useState(false);
  const limitModalRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [isPreorderOpen, setIsPreorderOpen] = useState(false);
  const [preorderProduct, setPreorderProduct] = useState(null);
  const preorderModalRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [viewedProducts, setViewedProducts] = useState([]);

  const filteredViewedProducts = viewedProducts.filter(p => p !== null);

  // Helper function to safely parse localStorage data
  const safeParse = (key, fallback = []) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (error) {
      console.error(`Failed to parse ${key}`, error);
      return fallback;
    }
  };

  // Handle category click (main level)
  const handleCategoryClick = async (category) => {
    setLoading(true);
    try {
      const productsData = await fetchProductsByCategory(category.id);
      const productsArray = Array.isArray(productsData) ? productsData : [];
      setProducts(productsArray);
      setNavigationStack(prev => [...prev, { type: "main", label: category.category, id: category.id }]);
    } catch (err) {
      console.error("Məhsullar yüklənərkən xəta:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle subcategory click (second level)
  const handleSubCategoryClick = (subcategory) => {
    const mainCatId = navigationStack.find(item => item.type === "main")?.id;
    const filtered = allProducts.filter(p =>
      p.category_id === mainCatId && (
        p.category_hierarchy?.[1] === subcategory ||
        p.properties?.some(prop => prop.title === subcategory)
      )
    );
    setProducts(filtered);
    setNavigationStack(prev => [...prev, { type: "sub", label: subcategory }]);
  };

  // Handle sub-subcategory click (third level)
  const handleSubSubCategoryClick = (subSubcategory) => {
    const filtered = allProducts.filter(p =>
      p.category_hierarchy?.[2] === subSubcategory ||
      p.properties?.some(prop => prop.title === subSubcategory)
    );
    setProducts(filtered);
    setNavigationStack(prev => [...prev, { type: "subsub", label: subSubcategory }]);
  };

  // Initial data load
  useEffect(() => {
    const loadProductsAndCategories = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          getAllCategories()
        ]);

        let productsArray = [];
        if (productsData && typeof productsData === 'object' && !Array.isArray(productsData)) {
          productsArray = Object.values(productsData).flat();
        } else if (Array.isArray(productsData)) {
           productsArray = productsData;
        }

        const categoriesArray = Array.isArray(categoriesData) ? categoriesData : [];

        setAllProducts(productsArray);
        setCategories(categoriesArray);
        setProducts(productsArray);

        const prices = productsArray
          .map(p => parseFloat(p.variants?.[0]?.price || 0))
          .filter(p => !isNaN(p));
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 100;
        setPriceRange([0, maxPrice]);
        setSliderValues([0, maxPrice]);
      } catch (err) {
        console.error("Məlumat yüklənərkən xəta:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProductsAndCategories();
  }, []);

  // Load cart quantities from localStorage on mount
  useEffect(() => {
    const cart = safeParse('cartProducts');
    const quantities = {};
    cart.forEach((item) => {
      if (item?.id && typeof item.quantity === 'number') {
        quantities[item.id] = item.quantity;
      }
    });
    setCartQuantities(quantities);
  }, []);

  // Generic function to update cart in localStorage and notify other components
  const updateCartAndNotify = (product, quantityChange) => {
    const cart = safeParse('cartProducts');
    const productIndex = cart.findIndex((item) => item.id === product.id);
    let newQuantity = 0;

    if (productIndex > -1) {
      newQuantity = cart[productIndex].quantity + quantityChange;
      if (newQuantity > 0) {
        cart[productIndex].quantity = newQuantity;
      } else {
        cart.splice(productIndex, 1);
      }
    } else if (quantityChange > 0) {
      cart.push({ ...product, quantity: 1 });
      newQuantity = 1;
    }

    try {
      localStorage.setItem('cartProducts', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Səbət saxlanılanda xəta:', error);
    }
    return newQuantity;
  };

  // Add one item to cart
  const addToCart = (product) => {
    const newQuantity = updateCartAndNotify(product, 1);
    if (newQuantity > 0) {
      setCartQuantities((prev) => ({
        ...prev,
        [product.id]: newQuantity,
      }));
    }
  };

  // Change item quantity in cart (positive or negative change)
  const handleQuantityChange = (product, change) => {
    const newQuantity = updateCartAndNotify(product, change);
    setCartQuantities((prev) => {
      const updated = { ...prev };
      if (newQuantity === 0) {
        delete updated[product.id];
      } else {
        updated[product.id] = newQuantity;
      }
      return updated;
    });
  };


  // Handle click outside modal to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isModalOpen && modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  // Handle window resize
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update slider values when price range changes
  useEffect(() => {
    setSliderValues([0, priceRange[1]]);
  }, [priceRange]);

  // Handle slider value change
  const handleSliderChange = (values) => {
    setSliderValues(values);
  };

  // Handle slider change completion (e.g., after user stops dragging)
  const handleSliderChangeComplete = (values) => {
    console.log("Seçilmiş qiymət aralığı:", values);
  };

  // Get subcategories for the current main category level
  const currentLevel = navigationStack[navigationStack.length - 1];
  const getMainLevelSubcategories = () => {
    if (currentLevel.type === "main") {
      const mainCatId = navigationStack.find(item => item.type === "main")?.id;
      const relevantProducts = allProducts.filter(p => p.category_id === mainCatId);
      const subcats = [...new Set(
        relevantProducts
          .flatMap((p) => [
            p.category_hierarchy?.[1],
            p.characteristics?.find((c) => c.permalink === "label")?.title,
          ])
          .filter(Boolean)
      )];
      return subcats;
    }
    return [];
  };

  // Get sub-subcategories for the current subcategory level
  const getSubLevelSubcategories = () => {
    if (currentLevel.type === "sub") {
      const mainCatId = navigationStack.find(item => item.type === "main")?.id;
      const subCatLabel = navigationStack.find(item => item.type === "sub")?.label;
      const relevantProducts = allProducts.filter((p) =>
        p.category_id === mainCatId && (
          p.category_hierarchy?.[1] === subCatLabel ||
          p.properties?.some((prop) => prop.title === subCatLabel)
        )
      );
      const subsubcats = [...new Set(
        relevantProducts
          .flatMap((p) => [
            p.category_hierarchy?.[2],
          ])
          .filter(Boolean)
      )];
      return subsubcats;
    }
    return [];
  };

  // Extract unique themes from products
  const allThemes = [...new Set(
    allProducts.flatMap((product) =>
      product.characteristics
        ?.filter((char) => char.property_id === 11912325)
        .map((char) => char.title)
        .filter(Boolean)
    ).filter(Boolean)
  )];

  // Handle theme filter change
  const handleThemeChange = (theme) => {
    setSelectedThemes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(theme)) {
        newSet.delete(theme);
      } else {
        newSet.add(theme);
      }
      return newSet;
    });
  };

  // Extract unique genres from products
  const allGenres = [...new Set(
    allProducts.flatMap((product) =>
      product.characteristics
        ?.filter((char) => char.property_id === 12019263)
        .map((char) => char.title)
    ).filter(Boolean)
  )];

  // Handle genre filter change
  const handleGenreChange = (genre) => {
    setSelectedGenres((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(genre)) {
        newSet.delete(genre);
      } else {
        newSet.add(genre);
      }
      return newSet;
    });
  };

  // Extract unique authors from products
  const allAuthors = [...new Set(
    allProducts.flatMap((product) =>
      product.characteristics
        ?.filter((char) => char.property_id === 12057361)
        .map((char) => char.title)
        .filter(Boolean)
    ).filter(Boolean)
  )];

  // Handle author filter change
  const handleAuthorChange = (author) => {
    setSelectedAuthors((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(author)) {
        newSet.delete(author);
      } else {
        newSet.add(author);
      }
      return newSet;
    });
  };

  // Extract unique languages from products
  const allLanguages = [...new Set(
    allProducts.flatMap((product) =>
      product.characteristics
        ?.filter((char) => char.property_id === 29707988)
        .map((char) => char.title)
        .filter(Boolean)
    ).filter(Boolean)
  )];

  // Handle language filter change
  const handleLanguageChange = (language) => {
    setSelectedLanguages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(language)) {
        newSet.delete(language);
      } else {
        newSet.add(language);
      }
      return newSet;
    });
  };

  // Extract unique series from products
  const allSeries = [...new Set(
    allProducts.flatMap((product) =>
      product.characteristics
      ?.filter((char) => char.property_id === 35706589)
      .map((char) => char.title)
    ).filter(Boolean)
  )];

  // Handle series filter change
  const handleSeriesChange = (series) => {
    setSelectedSeries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(series)) {
        newSet.delete(series);
      } else {
        newSet.add(series);
      }
      return newSet;
    });
  };

  // Extract unique brands from products
  const allBrands = [...new Set(
    allProducts.flatMap((product) =>
      product.characteristics
        ?.filter((char) => char.property_id === 12019265)
        .map((char) => char.title)
        .filter(Boolean)
    ).filter(Boolean)
  )];

  // Handle brand filter change
  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(brand)) {
        newSet.delete(brand);
      } else {
        newSet.add(brand);
      }
      return newSet;
    });
  };

  // Extract unique page counts from products and sort numerically
  const allPageCounts = [...new Set(
    allProducts.flatMap((product) =>
      product.characteristics
        ?.filter((char) => char.property_id === 22372871)
        .map((char) => char.title)
        .filter(Boolean)
    ).filter(Boolean)
  )].sort((a, b) => parseInt(a) - parseInt(b));

  // Handle page count filter change
  const handlePageCountChange = (count) => {
    setSelectedPageCounts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(count)) {
        newSet.delete(count);
      } else {
        newSet.add(count);
      }
      return newSet;
    });
  };

  // Apply all filters to the product list
  const filteredProducts = products.filter((product) => {
    const variant = product.variants?.[0];
    const price = parseFloat(variant?.price || 0);

    const isInStock = !showOnlyAvailable || (product.available && variant && variant.quantity > 0);
    const isInRange = price >= sliderValues[0] && price <= sliderValues[1];

    const genre = product.properties?.find((p) => p.permalink === "zhanr")?.title ||
                   product.characteristics?.find((c) => c.property_id === 12019263)?.title;
    const matchesGenre = selectedGenres.size === 0 || selectedGenres.has(genre);

    const author = product.properties?.find((p) => p.permalink === "avtor")?.title ||
                   product.characteristics?.find((c) => c.property_id === 12057361)?.title;
    const matchesAuthor = selectedAuthors.size === 0 || selectedAuthors.has(author);

    const language = product.properties?.find((p) => p.permalink === "yazik")?.title ||
                     product.characteristics?.find((c) => c.property_id === 29707988)?.title;
    const matchesLanguage = selectedLanguages.size === 0 || selectedLanguages.has(language);

    const series = product.properties?.find((p) => p.permalink === "seriya")?.title ||
                   product.characteristics?.find((c) => c.property_id === 35706589)?.title;
    const matchesSeries = selectedSeries.size === 0 || selectedSeries.has(series);

    const brand = product.properties?.find((p) => p.permalink === "izdatelstvo")?.title ||
                  product.characteristics?.find((c) => c.property_id === 12019265)?.title;
    const matchesBrand = selectedBrands.size === 0 || selectedBrands.has(brand);

    const pageCount = product.properties?.find((p) => p.permalink === "kol_vo_stranic")?.title ||
                      product.characteristics?.find((c) => c.property_id === 22372871)?.title;
    const matchesPageCount = selectedPageCounts.size === 0 || selectedPageCounts.has(pageCount);

    const theme = product.properties?.find((p) => p.permalink === "tema")?.title ||
                  product.characteristics?.find((c) => c.property_id === 11912325)?.title;
    const matchesTheme = selectedThemes.size === 0 || selectedThemes.has(theme);

    return isInStock && isInRange && matchesGenre && matchesAuthor && matchesLanguage && matchesSeries && matchesBrand && matchesPageCount && matchesTheme;
  });

  // Load liked products from localStorage on mount
  useEffect(() => {
    const liked = safeParse("likedProducts", []);
    const likedMap = {};
    liked.forEach((p) => (likedMap[p.id] = true));
    setLikedProductIds(likedMap);
  }, []);

  // Load viewed products from localStorage on mount
  useEffect(() => {
    const viewed = safeParse('viewedProducts', []);
    setViewedProducts(viewed);
  }, []);

  // Handle slide change for viewed products swiper
  const handleViewedSlideChange = (swiper) => {
    setIsViewedBeginning(swiper.isBeginning);
    setIsViewedEnd(swiper.isEnd);
  };

  // Close the favorites limit modal
  const closeLimitModal = () => {
    setIsFavoritesLimitOpen(false);
  };

  // Open the quick view modal
  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Close the quick view modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Handle swiper initialization for quick view modal
  const onSwiperInit = (swiper) => {
    swiperRef.current = swiper;
    setIsFirstSlide(swiper.isBeginning);
    setIsLastSlide(swiper.isEnd);
  };

  // Handle slide change for quick view modal swiper
  const onSlideChange = (swiper) => {
    setIsFirstSlide(swiper.isBeginning);
    setIsLastSlide(swiper.isEnd);
  };

  // Handle quantity change within the quick view modal
  const handleModalQuantityChangeInModal = (delta) => {
    if (!selectedProduct) return;
    const productId = selectedProduct.id;
    const variant = selectedProduct.variants?.[0];
    if (!variant || !selectedProduct.available || variant.quantity <= 0) return;

    const currentQty = cartQuantities[productId] || 0;
    const newQty = Math.max(0, currentQty + delta);

    if (newQty === 0) {
      handleRemoveFromCart(productId);
      updateCartAndNotify(selectedProduct, -currentQty);
      return;
    }

    // Update quantities in state and localStorage via updateCartAndNotify
    const cart = safeParse('cartProducts');
    const productIndex = cart.findIndex((item) => item.id === productId);
    if (productIndex > -1) {
        cart[productIndex].quantity = newQty;
    } else {
        cart.push({ ...selectedProduct, quantity: newQty });
    }
    localStorage.setItem("cartProducts", JSON.stringify(cart));
    setCartQuantities(prev => ({ ...prev, [productId]: newQty }));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Ön sifariş modallarını idarə edən funksiyalar
  const handleOpenPreorder = (product) => {
    setPreorderProduct(product);
    setIsPreorderOpen(true);
  };

  const handleCloseForm = () => {
    setIsPreorderOpen(false);
    setPreorderProduct(null);
  };

  const handleRecaptchaChange = (token) => {
    console.log("reCAPTCHA token:", token);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Müraciətiniz uğurla göndərildi. Ən qısa zamanda sizinlə əlaqə saxlayacağıq.");
    handleCloseForm();
  };

  // Sevimliyə əlavə/sil
  const handleLikeToggle = (product) => {
    const updated = { ...likedProductIds };
    let updatedList = safeParse("likedProducts", []);

    if (updated[product.id]) {
      delete updated[product.id];
      updatedList = updatedList.filter((p) => p.id !== product.id);
    } else {
      if (updatedList.length >= 20) {
        setIsFavoritesLimitOpen(true);
        return;
      }
      updated[product.id] = true;
      updatedList.push(product);
    }

    localStorage.setItem("likedProducts", JSON.stringify(updatedList));
    setLikedProductIds(updated);
    window.dispatchEvent(new Event("likedProductsUpdated"));
  };

  // Scroll pozisiyasını yoxlamaq üçün effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll top funksiyası
  const scrollToTop = () => {
    scrollTop(0, true);
  };

  // Yükləmə vəziyyəti
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <img src={alinino_logo} alt="alinino_logo" className="w-40 h-40 object-contain animate-spin-reverse" />
      </div>
    );
  }

  return (
    <>
      {/* Xəritə */}
      <div className="w-full p-1 bg-gray-100 mt-12 lg:mt-0">
        <ol className="flex flex-wrap h-auto max-w-[1428px] mx-auto px-4 lg:px-16 py-2 space-x-2 text-xs text-[#777777] items-center">
          <li className="flex items-center">
            <Link to="/" className="hover:text-[#dc0708]">Əsas</Link>
          </li>
          {navigationStack.slice(1).map((item, i) => (
            <li key={i} className="flex items-center">
              <span className="mx-1">/</span>
              <span className="capitalize">{item.label}</span>
            </li>
          ))}
        </ol>
      </div>
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE ve Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera*/
        }
      `}</style>

      {/* Başlıq */}
      <div className="flex flex-row items-center gap-2 max-w-[1428px] mx-auto h-full px-10 lg:px-[64px] mt-5">
        <h2 className="text-[30px]">Kataloq</h2>
        <span className="text-[20px] font-normal text-[#999999]">{filteredProducts.length} məhsul</span>
      </div>

      {/* Məhsullar */}
      <div className="flex flex-row items-start justify-between gap-6 max-w-[1428px] mx-auto h-full px-10 mt-6 lg:px-[64px] overflow-y-auto">
       
        {/* Filtrlər */}
        <div className="w-[300px] flex-shrink-0">
          <div className="flex flex-col justify-center text-[16px] text-[#000000] font-medium">
            {navigationStack.map((item, index) => (
              <button
                key={index}
                className={`flex items-center w-full text-left py-1 px-4 rounded-md transition-all duration-200 group ${
                  index === navigationStack.length - 1
                    ? "font-bold text-[#000000] bg-[#f7f8fa] pointer-events-none"
                    : "text-[#000000] hover:text-[#f50809] hover:bg-[#f7f8fa] cursor-pointer"
                }`}
                onClick={() => {
                  if (index < navigationStack.length - 1) {
                    setNavigationStack((prev) => prev.slice(0, index + 1));
                    if (index === 0) {
                      setProducts(allProducts);
                    } else if (index === 1) {
                      const mainCatId = navigationStack[1].id;
                      if (mainCatId) {
                        handleCategoryClick({ id: mainCatId, category: navigationStack[1].label });
                      } else {
                         const cat = categories.find((c) => c.category === navigationStack[1].label);
                         if (cat) {
                            handleCategoryClick(cat);
                         } else {
                            setProducts(allProducts);
                         }
                      }
                    } else if (index === 2) {
                      const subCat = navigationStack[2].label;
                      setProducts(
                        allProducts.filter((p) =>
                          p.category_hierarchy?.[1] === subCat ||
                          p.properties?.some((prop) => prop.title === subCat)
                        )
                      );
                    } else if (index === 3) {
                      const subSubCat = navigationStack[3].label;
                      setProducts(
                        allProducts.filter((p) =>
                          p.category_hierarchy?.[2] === subSubCat ||
                          p.properties?.some((prop) => prop.title === subSubCat)
                        )
                      );
                    }
                  }
                }}
                disabled={index === navigationStack.length - 1}
              >
                {index !== navigationStack.length - 1 && (
                  <FaChevronLeft
                    className="text-[#000000] mr-1 text-[16px] transition-colors duration-200 group-hover:text-[#f50809]"
                  />
                )}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <ul className="text-[16px] text-[#000000] mx-4 mt-1">
            {currentLevel.type === "root" && (
              <>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategoryClick(cat)}
                      className="flex items-center w-full text-left py-1 px-4 rounded-md text-[#000000] hover:text-[#f50809] hover:bg-[#f7f8fa] transition-colors duration-200"
                    >
                      {cat.category}
                    </button>
                  </li>
                ))}
              </>
            )}
            {currentLevel.type === "main" && (
              getMainLevelSubcategories().map((subcat) => (
                <li key={subcat}>
                  <button
                    onClick={() => handleSubCategoryClick(subcat)}
                    className="flex items-center w-full text-left py-1 px-4 rounded-md text-[#000000] hover:text-[#f50809] hover:bg-[#f7f8fa] transition-colors duration-200"
                  >
                    {subcat}
                  </button>
                </li>
              ))
            )}
            {currentLevel.type === "sub" && (
              getSubLevelSubcategories().map((subsub) => (
                <li key={subsub}>
                  <button
                    onClick={() => handleSubSubCategoryClick(subsub)}
                    className="flex items-center w-full text-left py-1 px-4 rounded-md text-[#000000] hover:text-[#f50809] hover:bg-[#f7f8fa] transition-colors duration-200"
                  >
                    {subsub}
                  </button>
                </li>
              ))
            )}
          </ul>
          <div className="flex flex-row items-center gap-2 mt-4 mx-4 px-4">
            <span className="text-[16px] text-[#000000] font-bold">Mövcud olan məhsullar</span>
            <label htmlFor="availableFilter" className="inline-flex items-center cursor-pointer text-[#005bff]">
              <span className="relative">
                <input
                  id="availableFilter"
                  type="checkbox"
                  className="hidden peer"
                  checked={showOnlyAvailable}
                  onChange={() => setShowOnlyAvailable(prev => !prev)}
                />
                <div className="w-10 h-5 bg-[#f7f8fa] rounded-full transition-colors duration-300"></div>
                <div className="absolute inset-y-0 left-0 w-4 h-4 m-0.5 bg-[#dddddd] peer-checked:bg-[#005bff] rounded-full shadow transition-transform duration-300 transform peer-checked:translate-x-4"></div>
              </span>
            </label>
          </div>
          <div className="mx-4 mt-4 px-4">
            <span className="text-[16px] text-[#000000] font-bold">Qiymət, AZN</span>
            <div className="flex flex-row items-center gap-4 my-4">
              <div className="flex items-center gap-1 w-[110px] h-[40px] border border-[#dddddd] rounded-md p-2">
                <span className="text[12px] text-[#9c9fb3]">dən |</span>
                <span className="text[12px] text-[#000000]">{sliderValues[0].toFixed(0)}</span>
              </div>
              <div className="flex items-center gap-1 w-[110px] h-[40px] border border-[#dddddd] rounded-md p-2">
                <span className="text[14px] text-[#9c9fb3]">dək |</span>
                <span className="text[12px] text-[#000000]">{sliderValues[1].toFixed(0)}</span>
              </div>
            </div>
            <Slider
              range
              min={0}
              max={priceRange[1]}
              step={0.01}
              value={sliderValues}
              onChange={handleSliderChange}
              onChangeComplete={handleSliderChangeComplete}
              tooltip={{ open: false }}
              trackStyle={[{ backgroundColor: "#005bff", height: 4 }]}
            />
          </div>
          <div className="flex flex-row items-center justify-between bg-[#f7f8fa] mx-4 mt-4 px-4 py-2 rounded-md cursor-pointer" onClick={() => setIsThemeOpen(!isThemeOpen)}>
            <span className="text-[16px] text-[#000000] font-bold">Mövzu</span>
            {isThemeOpen ? (
              <FaChevronDown className="text-[16px] text-[#000000]" />
            ) : (
              <FaChevronRight className="text-[16px] text-[#000000]" />
            )}
          </div>
          {isThemeOpen && (
            <div className="mx-4 mt-2 px-4 flex flex-col gap-2 max-h-40 overflow-y-auto custom-scrollbar">
              {allThemes.length > 0 ? (
                allThemes.map((theme) => (
                  <label key={theme} className="flex items-center gap-2 cursor-pointer text-[14px]">
                    <input
                      type="checkbox"
                      checked={selectedThemes.has(theme)}
                      onChange={() => handleThemeChange(theme)}
                      className="text-[#005bff] rounded"
                    />
                    <span>{theme}</span>
                  </label>
                ))
              ) : (
                <span className="text-[14px] text-[#999999]">Mövzu tapılmadı</span>
              )}
            </div>
          )}
          <div className="flex flex-row items-center justify-between bg-[#f7f8fa] mx-4 mt-4 px-4 py-2 rounded-md cursor-pointer" onClick={() => setIsGenreOpen(!isGenreOpen)}>
            <span className="text-[16px] text-[#000000] font-bold">Janr</span>
            {isGenreOpen ? <FaChevronDown /> : <FaChevronRight />}
          </div>
          {isGenreOpen && (
            <div className="mx-4 mt-2 px-4 flex flex-col gap-2 max-h-40 overflow-y-auto custom-scrollbar">
              {allGenres.length > 0 ? (
                allGenres.map((genre) => (
                  <label key={genre} className="flex items-center gap-2 cursor-pointer text-[14px]">
                    <input
                      type="checkbox"
                      checked={selectedGenres.has(genre)}
                      onChange={() => handleGenreChange(genre)}
                      className="text-[#005bff] rounded"
                    />
                    <span>{genre}</span>
                  </label>
                ))
              ) : (
                <span className="text-[14px] text-[#999999]">Janr tapılmadı</span>
              )}
            </div>
          )}
          <div className="flex flex-row items-center justify-between bg-[#f7f8fa] mx-4 mt-4 px-4 py-2 rounded-md cursor-pointer" onClick={() => setIsAuthorOpen(!isAuthorOpen)}>
            <span className="text-[16px] text-[#000000] font-bold">Müəllif</span>
            {isAuthorOpen ? <FaChevronDown /> : <FaChevronRight />}
          </div>
          {isAuthorOpen && (
            <div className="mx-4 mt-2 px-4 flex flex-col gap-2 max-h-40 overflow-y-auto custom-scrollbar">
              {allAuthors.length > 0 ? (
                allAuthors.map((author) => (
                  <label key={author} className="flex items-center gap-2 cursor-pointer text-[14px]">
                    <input
                      type="checkbox"
                      checked={selectedAuthors.has(author)}
                      onChange={() => handleAuthorChange(author)}
                      className="text-[#005bff] rounded"
                    />
                    <span>{author}</span>
                  </label>
                ))
              ) : (
                <span className="text-[14px] text-[#999999]">Müəllif tapılmadı</span>
              )}
            </div>
          )}
          <div className="flex flex-row items-center justify-between bg-[#f7f8fa] mx-4 mt-4 px-4 py-2 rounded-md cursor-pointer" onClick={() => setIsLanguageOpen(!isLanguageOpen)}>
            <span className="text-[16px] text-[#000000] font-bold">Dil</span>
            {isLanguageOpen ? <FaChevronDown /> : <FaChevronRight />}
          </div>
          {isLanguageOpen && (
            <div className="mx-4 mt-2 px-4 flex flex-col gap-2 max-h-40 overflow-y-auto custom-scrollbar">
              {allLanguages.length > 0 ? (
                allLanguages.map((language) => (
                  <label key={language} className="flex items-center gap-2 cursor-pointer text-[14px]">
                    <input
                      type="checkbox"
                      checked={selectedLanguages.has(language)}
                      onChange={() => handleLanguageChange(language)}
                      className="text-[#005bff] rounded"
                    />
                    <span>{language}</span>
                  </label>
                ))
              ) : (
                <span className="text-[14px] text-[#999999]">Dil tapılmadı</span>
              )}
            </div>
          )}
          <div className="flex flex-row items-center justify-between bg-[#f7f8fa] mx-4 mt-4 px-4 py-2 rounded-md cursor-pointer" onClick={() => setIsSeriesOpen(!isSeriesOpen)}>
            <span className="text-[16px] text-[#000000] font-bold">Seriya</span>
            {isSeriesOpen ? <FaChevronDown /> : <FaChevronRight />}
          </div>
          {isSeriesOpen && (
            <div className="mx-4 mt-2 px-4 flex flex-col gap-2 max-h-40 overflow-y-auto custom-scrollbar">
              {allSeries.length > 0 ? (
                allSeries.map((series) => (
                  <label key={series} className="flex items-center gap-2 cursor-pointer text-[14px]">
                    <input
                      type="checkbox"
                      checked={selectedSeries.has(series)}
                      onChange={() => handleSeriesChange(series)}
                      className="text-[#005bff] rounded"
                    />
                    <span>{series}</span>
                  </label>
                ))
              ) : (
                <span className="text-[14px] text-[#999999]">Seriya tapılmadı</span>
              )}
            </div>
          )}
          <div className="flex flex-row items-center justify-between bg-[#f7f8fa] mx-4 mt-4 px-4 py-2 rounded-md cursor-pointer" onClick={() => setIsBrandOpen(!isBrandOpen)}>
            <span className="text-[16px] text-[#000000] font-bold">Brend</span>
            {isBrandOpen ? <FaChevronDown /> : <FaChevronRight />}
          </div>
          {isBrandOpen && (
            <div className="mx-4 mt-2 px-4 flex flex-col gap-2 max-h-40 overflow-y-auto custom-scrollbar">
              {allBrands.length > 0 ? (
                allBrands.map((brand) => (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer text-[14px]">
                    <input
                      type="checkbox"
                      checked={selectedBrands.has(brand)}
                      onChange={() => handleBrandChange(brand)}
                      className="text-[#005bff] rounded"
                    />
                    <span>{brand}</span>
                  </label>
                ))
              ) : (
                <span className="text-[14px] text-[#999999]">Brend tapılmadı</span>
              )}
            </div>
          )}
          <div className="flex flex-row items-center justify-between bg-[#f7f8fa] mx-4 mt-4 px-4 py-2 rounded-md cursor-pointer" onClick={() => setIsPageCountOpen(!isPageCountOpen)}>
            <span className="text-[16px] text-[#000000] font-bold">Səhifələrin sayı</span>
            {isPageCountOpen ? <FaChevronDown /> : <FaChevronRight />}
          </div>
          {isPageCountOpen && (
            <div className="mx-4 mt-2 px-4 flex flex-col gap-2 max-h-40 overflow-y-auto custom-scrollbar">
              {allPageCounts.length > 0 ? (
                allPageCounts.map((count) => (
                  <label key={count} className="flex items-center gap-2 cursor-pointer text-[14px]">
                    <input
                      type="checkbox"
                      checked={selectedPageCounts.has(count)}
                      onChange={() => handlePageCountChange(count)}
                      className="text-[#005bff] rounded"
                    />
                    <span>{count}</span>
                  </label>
                ))
              ) : (
                <span className="text-[14px] text-[#999999]">Səhifə sayı tapılmadı</span>
              )}
            </div>
          )}
        </div>

        {/* Məhsul Tablosu */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-20">
              <p className="text-[14px] text-[#9d9d9d] text-center mt-4">
                Seçilmiş filtrlərə uyğun məhsul tapılmadı.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {filteredProducts.map((product) => {
                const variant = product.variants?.[0] || {};
                const oldPrice = parseFloat(variant.old_price || 0);
                const newPrice = parseFloat(variant.price || 0);
                const hasDiscount = oldPrice > newPrice && oldPrice > 0;
                const discountPercent = hasDiscount
                  ? Math.round(((oldPrice - newPrice) / oldPrice) * 100)
                  : 0;
                const secondImage = product.images?.find((img) => img.position === 2)?.original_url;
                const currentQuantity = cartQuantities[product.id] || 0;
                const isOutOfStock = !variant || !product.available || variant.quantity <= 0;
                const hasExpress = product.characteristics?.some((c) => c.permalink === "ekspress");
                const hasComingSoon = product.characteristics?.some((c) => c.title === "TEZLİKLƏ!");
                const hasFreeDelivery = product.characteristics?.some((c) => c.permalink === "PULSUZ ÇATDIRILMA");
                const hasBestseller = product.characteristics?.some((c) => c.permalink?.toLowerCase() === "bestseller");

                return (
                  <article
                    key={product.id}
                    className={`flex flex-col justify-between w-full h-full px-2 py-4 rounded-md overflow-hidden bg-[#ffffff] relative transition-all duration-300 ${
                      hoveredProductId === product.id ? "shadow-[0_4px_20px_rgba(0,0,0,0.25)] z-20" : "z-0"
                    }`}
                    onMouseEnter={() => setHoveredProductId(product.id)}
                    onMouseLeave={() => setHoveredProductId(null)}
                  >
                    <div className="absolute top-3 left-3 flex flex-col items-start gap-1 p-2 z-30">
                      {hasDiscount && (
                        <div className="bg-[#f8353e] text-[#ffffff] text-[12px] font-semibold px-2 py-1 rounded-md shadow-md">
                          -{discountPercent}%
                        </div>
                      )}
                      {isOutOfStock && (
                        <div className="bg-[#000000] text-[#ffffff] text-[12px] font-semibold px-2 py-1 rounded-md shadow-md">
                          Satıldı
                        </div>
                      )}
                      {hasBestseller && (
                        <div className="bg-[#005bff] text-[#ffffff] text-[12px] font-semibold px-2 py-1 rounded-md shadow-md">
                          Bestseller
                        </div>
                      )}
                      {hasComingSoon && (
                        <div className="bg-[#005bff] text-[#ffffff] text-[12px] font-semibold px-2 py-1 rounded-md shadow-md">
                          TEZLİKLƏ!
                        </div>
                      )}
                      {hasFreeDelivery && (
                        <div className="bg-[#005bff] text-[#ffffff] text-[12px] font-semibold px-2 py-1 rounded-md shadow-md">
                          PULSUZ ÇATDIRILMA
                        </div>
                      )}
                      {hasExpress && (
                        <div className="bg-[#dcfe5b] text-[#000000] text-[12px] font-semibold px-2 py-1 rounded-md shadow-md">
                          Ekspress
                        </div>
                      )}
                    </div>
                    <div className="absolute top-3 right-3 p-2 z-30">
                      {likedProductIds[product.id] ? (
                        <FaHeart
                          className="text-[20px] text-[#f50809] cursor-pointer"
                          onClick={() => handleLikeToggle(product)}
                        />
                      ) : (
                        <FaRegHeart
                          className="text-[20px] text-[#777777] hover:text-[#f50809] cursor-pointer"
                          onClick={() => handleLikeToggle(product)}
                        />
                      )}
                    </div>
                    <Link to={`/products/${product.permalink}`} className="block">
                      <div className="w-full h-[220px] flex items-center justify-center bg-[#ffffff] overflow-hidden relative group">
                        <img
                          src={product.first_image?.original_url || "/no-image.png"}
                          alt={product.title}
                          className="w-[65%] h-fit object-contain transition-opacity duration-300"
                        />
                        {secondImage && (
                          <img
                            src={secondImage}
                            alt={`${product.title} - second`}
                            className="w-[65%] h-fit object-contain absolute inset-0 m-auto opacity-0 pointer-events-none lg:group-hover:opacity-100 lg:pointer-events-auto"
                          />
                        )}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openModal(product);
                          }}
                          className="absolute inset-x-2 bottom-0 flex items-center justify-center transition-all duration-300 z-20 opacity-0 translate-y-4 pointer-events-none lg:group-hover:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:pointer-events-auto"
                        >
                          <div className="bg-[#eeeeeee6] text-[#000000] font-medium py-1.5 w-full text-center rounded-md shadow-sm">
                            Sürətli görünüş
                          </div>
                        </button>
                      </div>
                    </Link>
                    <div className="flex flex-col flex-1 p-2 justify-between">
                      <div>
                        <div className="flex flex-row items-center justify-start gap-3">
                          <div className="text-[18px] font-semibold text-gray-900">{newPrice.toFixed(2)} AZN</div>
                          {hasDiscount && (
                            <div className="text-[16px] line-through text-gray-500">{oldPrice.toFixed(2)} AZN</div>
                          )}
                        </div>
                        <h3 className="text-[14px] text-[#000000] hover:text-[#f50809] font-semibold leading-snug">
                          {product.title || "Məhsul adı"}
                        </h3>
                        <div className="flex items-center gap-2 mt-3">
                          <div className="flex space-x-1 text-[18px] cursor-default select-none">
                            {[...Array(5)].map((_, index) => (
                              <span key={index} className="text-gray-300">
                                <FaRegStar />
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-1 text-gray-500 hover:text-[#000000]">
                            <FaRegCommentDots className="text-[16px]" />
                            <span className="text-[14px]">{product.reviews_count_cached || 0}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        {currentQuantity > 0 ? (
                          <div className="flex items-center justify-between w-[140px] h-auto gap-2 rounded-md cursor-pointer">
                            <button
                              onClick={() => handleQuantityChange(product, -1)}
                              className="text-[#ffffff] bg-[#f50809] px-1.5 py-2 rounded-l-md"
                            >
                              <FaMinus className="text-[20px] text-[#ffffff]" />
                            </button>
                            <div className="text-[14px] text-[#000000] font-medium bg-[#ffffff] flex flex-row items-center gap-1 p-1.5">
                              {currentQuantity} <span>ədəd</span>
                            </div>
                            <button
                              onClick={() => handleQuantityChange(product, 1)}
                              className="text-[#ffffff] bg-[#f50809] px-1.5 py-2 rounded-r-md"
                            >
                              <FaPlus className="text-[20px] text-[#ffffff]" />
                            </button>
                          </div>
                        ) : (
                          <div
                            className={`flex flex-row items-center justify-center w-[140px] h-auto p-1.5 gap-2 rounded-md cursor-pointer transition-opacity duration-300 ${
                              isDesktop
                                ? hoveredProductId === product.id
                                  ? "opacity-100 pointer-events-auto"
                                  : "opacity-0 pointer-events-none"
                                : "opacity-100 pointer-events-auto"
                            } ${isOutOfStock ? "bg-[#1a6bff] cursor-not-allowed" : "bg-[#f50809]"}`}
                            onClick={() => {
                                if (isOutOfStock) {
                                    handleOpenPreorder(product);
                                } else {
                                    addToCart(product);
                                }
                            }}
                          >
                            {!isOutOfStock && <BsCart3 className="text-[16px] font-black text-white sm:text-[20px]" />}
                            <span className="text-[16px] text-[#ffffff] font-medium">
                              {isOutOfStock ? "Ön sifariş" : "Səbətə at"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Baxdığınız Məhsullar */}
      {!showOrderForm && filteredViewedProducts.length > 0 && (
        <div className="w-full md:my-5">
          <div className="flex flex-col max-w-[1428px] mx-auto px-4 lg:px-16">
            <div className="flex flex-row items-center gap-6">
              <h2 className="text-[24px] sm:text-[28px] md:text-[32px] text-[#000000] font-normal">
                Baxdığınız
              </h2>
              <button
                onClick={() => {
                  localStorage.removeItem("viewedProducts");
                  setViewedProducts([]);
                }}
                className="text-[14px] text-[#000000] font-normal bg-[#eeeeee] hover:bg-[#dddddd] px-2 py-1 rounded-md cursor-pointer transition-colors duration-300"
              >
                Təmizlə
              </button>
            </div>
            <div className="relative group w-full max-w-[1428px] mx-auto px-2 sm:px-4 lg:px-[4px] mt-4">
              <Swiper
                onSwiper={(swiper) => {
                  viewedSwiperRef.current = swiper;
                  setIsViewedBeginning(swiper.isBeginning);
                }}
                onSlideChange={handleViewedSlideChange}
                modules={[Navigation]}
                loop={false}
                navigation={{
                  nextEl: ".viewed-swiper-button-next-custom",
                  prevEl: ".viewed-swiper-button-prev-custom",
                }}
                className="myViewedSwiper"
                breakpoints={{
                  0: { slidesPerView: 2, spaceBetween: 10 },
                  640: { slidesPerView: 3, spaceBetween: 15 },
                  768: { slidesPerView: 4, spaceBetween: 20 },
                  1024: { slidesPerView: 4, spaceBetween: 25 },
                  1280: { slidesPerView: 7, spaceBetween: 30 },
                }}
              >
                {filteredViewedProducts.map((prod) => {
                  const variant = prod.variants?.[0] || {};
                  const secondImage = prod.images?.find(
                    (img) => img.position === 2
                  )?.original_url;
                  return (
                    <SwiperSlide key={`viewed-${prod.id}`}>
                      <article
                        className="flex flex-col h-full bg-white rounded overflow-hidden cursor-pointer"
                        onMouseEnter={() => setHoveredProductId(prod.id)}
                        onMouseLeave={() => setHoveredProductId(null)}
                      >
                        <Link to={`/products/${prod.permalink}`} rel="noopener noreferrer">
                          <div className="w-full h-[140px] sm:h-[180px] md:h-[220px] lg:h-[260px] flex items-center justify-center bg-white overflow-hidden">
                            <img
                              src={
                                hoveredProductId === prod.id && secondImage
                                  ? secondImage
                                  : prod.first_image?.original_url ||
                                    prod.images?.[0]?.original_url
                              }
                              alt={prod.title}
                              className="w-full h-full object-contain transition-all duration-300"
                            />
                          </div>
                        </Link>
                        <div className="flex flex-col flex-1 p-2">
                          <div className="text-[14px] md:text-[16px] font-semibold text-black">
                            {Number(variant.price || 0).toFixed(2)} AZN
                          </div>
                          <h3 className="text-[12px] md:text-[14px] text-black hover:text-[#f50809] leading-snug line-clamp-2">
                            {prod.title || "Məhsul adı"}
                          </h3>
                        </div>
                      </article>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              {/* Prev button */}
              <button
                onClick={() => viewedSwiperRef.current?.slidePrev()}
                className={`viewed-swiper-button-prev-custom absolute top-1/2 -left-3 sm:-left-4 md:-left-5 lg:-left-6 -translate-y-1/2 z-20 p-2 bg-white rounded-full shadow-lg ${
                  isViewedBeginning ? "opacity-0 -translate-x-4" : "opacity-100"
                } hidden sm:flex`}
              >
                <GoArrowLeft className="text-lg" />
              </button>
              {/* Next button */}
              <button
                onClick={() => viewedSwiperRef.current?.slideNext()}
                className={`viewed-swiper-button-next-custom absolute top-1/2 -right-3 sm:-right-4 md:-right-5 lg:-right-6 -translate-y-1/2 z-20 p-2 bg-white rounded-full shadow-lg ${
                  isViewedEnd ? "opacity-0 translate-x-4" : "opacity-100"
                } hidden sm:flex`}
              >
                <GoArrowRight className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sürətli Görünüş Modalı */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-[#0a0a0a98] flex items-center justify-center z-50 cursor-pointer" onClick={closeModal}>
          <div
            ref={modalRef}
            className="flex flex-col md:flex-row w-[95%] md:w-[982px] h-auto md:h-[530px] p-4 md:p-8 rounded-lg overflow-hidden bg-[#ffffff] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={closeModal} className="absolute top-4 right-4 text-[#000000] z-50 cursor-pointer">
              <RiCloseFill className="text-[24px]" />
            </button>
            <div className="w-full md:w-[45%] h-fit">
              <div className="relative group w-full h-auto rounded-md">
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={0}
                  slidesPerView={1}
                  loop={selectedProduct.images?.length > 1}
                  onSwiper={onSwiperInit}
                  onSlideChange={onSlideChange}
                  pagination={{
                    el: '.custom-swiper-pagination',
                    clickable: true,
                    renderBullet: (index, className) => {
                      return `<span class="${className} custom-bullet"></span>`;
                    },
                  }}
                  className="h-[400px] w-full"
                >
                  {selectedProduct.images?.length > 0 ? (
                    selectedProduct.images.map((image) => (
                      <SwiperSlide key={image.id}>
                        <Link to={`/products/${selectedProduct.permalink}`} rel="noopener noreferrer">
                          <img
                            src={image.original_url}
                            alt={selectedProduct.title}
                            className="w-full h-full object-contain object-center rounded-md cursor-pointer"
                          />
                        </Link>
                      </SwiperSlide>
                    ))
                  ) : (
                    <SwiperSlide>
                      <img
                        src="/no-image.png"
                        alt="Şəkil yoxdur"
                        className="w-full h-full object-contain object-center rounded-md"
                      />
                    </SwiperSlide>
                  )}
                </Swiper>
                <button
                  onClick={() => swiperRef.current?.slidePrev()}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full shadow-md cursor-pointer transition-all duration-300 transform -translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 ${
                    isFirstSlide
                      ? 'cursor-not-allowed text-gray-400 opacity-0'
                      : 'text-gray-700 hover:text-black'
                  }`}
                  disabled={isFirstSlide}
                >
                  <GoArrowLeft className="text-3xl" />
                </button>
                <button
                  onClick={() => swiperRef.current?.slideNext()}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full shadow-md cursor-pointer transition-all duration-300 transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 ${
                    isLastSlide
                      ? 'cursor-not-allowed text-gray-400 opacity-0'
                      : 'text-gray-700 hover:text-black'
                  }`}
                  disabled={isLastSlide}
                >
                  <GoArrowRight className="text-3xl" />
                </button>
              </div>
              <div className="custom-swiper-pagination mt-[15px] flex justify-center"></div>
              <style jsx>{`
                .swiper-pagination-bullet {
                  background-color: #333;
                  width: 8px;
                  height: 8px;
                  border-radius: 9999px;
                  transition: all 0.3s ease;
                  margin: 0 4px;
                }
                .swiper-pagination-bullet-active {
                  background-color: #dc0708;
                  width: 25px;
                }
              `}</style>
            </div>
            <div className="w-full md:w-[55%] flex flex-col flex-1 justify-start">
              <div className="flex flex-row items-center gap-2 mt-2 sm:mt-0">
                {(() => {
                  const variant = selectedProduct.variants?.[0];
                  const oldPrice = parseFloat(variant?.old_price || 0);
                  const newPrice = parseFloat(variant?.price || 0);
                  const hasDiscount = oldPrice > newPrice && oldPrice > 0;
                  const discountPercent = hasDiscount
                    ? Math.round(((oldPrice - newPrice) / oldPrice) * 100)
                    : 0;
                  const isOutOfStock = !variant || !selectedProduct.available || (variant.quantity || 0) <= 0;
                  const hasExpress = selectedProduct.characteristics?.some((c) => c.permalink === "ekspress");
                  const hasComingSoon = selectedProduct.characteristics?.some((c) => c.title === "TEZLİKLƏ!");
                  const hasFreeDelivery = selectedProduct.characteristics?.some((c) => c.permalink === "PULSUZ ÇATDIRILMA");
                  const hasBestseller = selectedProduct.characteristics?.some((c) => c.permalink?.toLowerCase() === "bestseller");
                  return (
                    <>
                      {hasDiscount && (
                        <div className="bg-[#f8353e] text-[#ffffff] text-[12px] font-semibold px-2 py-1 rounded-md shadow-md">
                          -{discountPercent}%
                        </div>
                      )}
                      {isOutOfStock && (
                        <div className="bg-[#000000] text-[#ffffff] text-[12px] font-semibold px-2 py-1 rounded-md shadow-md">
                          Satıldı
                        </div>
                      )}
                      {hasBestseller && (
                        <div className="bg-[#005bff] text-[#ffffff] text-[12px] font-semibold px-2 py-1 rounded-md shadow-md">
                          Bestseller
                        </div>
                      )}
                      {hasComingSoon && (
                        <div className="bg-[#005bff] text-[#ffffff] text-[12px] font-semibold px-2 py-1 rounded-md shadow-md">
                          TEZLİKLƏ!
                        </div>
                      )}
                      {hasFreeDelivery && (
                        <div className="bg-[#005bff] text-[#ffffff] text-[12px] font-semibold px-2 py-1 rounded-md shadow-md">
                          PULSUZ ÇATDIRILMA
                        </div>
                      )}
                      {hasExpress && (
                        <div className="bg-[#dcfe5b] text-[#000000] text-[12px] font-semibold px-2 py-1 rounded-md shadow-md">
                          Ekspress
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
              <h2 className="text-[24px] font-semibold text-[#000000] mt-2">
                {selectedProduct.title || 'Məhsul adı'}
              </h2>
              <div className="flex flex-row items-center justify-start gap-3 text-[12px] text-gray-400 mt-2">
                {selectedProduct.variants?.[0]?.sku && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Artikul:</span>
                    <span>{selectedProduct.variants[0].sku}</span>
                  </div>
                )}
                {selectedProduct.unit && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Ölçü vahidi:</span>
                    <span>{selectedProduct.unit === 'pce' ? 'ədəd' : selectedProduct.unit}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-row items-center gap-3 mt-2">
                <div className="text-[26px] font-semibold text-gray-900">
                  {Number(selectedProduct.variants?.[0]?.price || 0).toFixed(2)} AZN
                </div>
                {selectedProduct.variants?.[0]?.old_price &&
                  selectedProduct.variants[0].old_price !== selectedProduct.variants[0].price && (
                    <div className="text-[26px] line-through text-gray-500">
                      {Number(selectedProduct.variants[0].old_price || 0).toFixed(2)} AZN
                    </div>
                  )}
              </div>
              {selectedProduct.variants?.[0]?.old_price &&
                selectedProduct.variants[0].old_price > selectedProduct.variants[0].price && (
                  <div className="text-[#f50809] text-[14px] font-semibold mt-2">
                    Qənaət: {Number(selectedProduct.variants[0].old_price - selectedProduct.variants[0].price).toFixed(2)} AZN
                  </div>
                )}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex space-x-1 text-[18px]">
                  {[...Array(5)].map((_, index) => (
                    <span key={index} className="text-gray-300">
                      <FaRegStar />
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-gray-500 hover:text-[#000000]">
                  <FaRegCommentDots className="text-[16px]" />
                  <span className="text-[14px] border-b border-dashed border-gray-400 hover:border-[#000000]">
                    {selectedProduct.reviews_count_cached || 0} Rəy yaz
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-10">
                <span
                  className={`w-2 h-2 rounded-full ${
                    selectedProduct.variants?.[0]?.quantity > 0 && selectedProduct.available
                      ? 'bg-[#0fce2d]'
                      : 'bg-[#f50809]'
                  }`}
                ></span>
                <span className="text-[14px] text-[#000000] font-bold">
                  {selectedProduct.variants?.[0]?.quantity > 0 && selectedProduct.available
                    ? 'Mövcuddur'
                    : 'Mövcud deyil'}
                </span>
              </div>
              <div className="flex flex-col mt-4">
                <div className="flex flex-row items-center justify-start gap-8">
                  {cartQuantities[selectedProduct.id] > 0 ? (
                    <div className="flex items-center justify-between w-full h-auto gap-2 rounded-md">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleModalQuantityChangeInModal(-1);
                        }}
                        className="h-[55px] w-[55px] text-[#ffffff] bg-[#f50809] p-4 rounded-l-md"
                      >
                        <FaMinus className="text-[20px] text-[#ffffff]" />
                      </button>
                      <Link
                        to="/cart"
                        className="flex flex-col items-center h-[55px] w-full bg-[#f7f8fa] text-[14px] text-[#000000] hover:text-[#f50809] font-medium p-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex flex-row items-center gap-1">
                          <span>{cartQuantities[selectedProduct.id]}</span>
                          <span>ədəd</span>
                        </div>
                        <span>Səbətə keç</span>
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleModalQuantityChangeInModal(1);
                        }}
                        className="h-[55px] w-[55px] text-[#ffffff] bg-[#f50809] p-4 rounded-r-md"
                      >
                        <FaPlus className="text-[20px] text-[#ffffff]" />
                      </button>
                    </div>
                  ) : (
                    <button
                      className={`flex items-center justify-center h-[55px] w-full p-2 gap-2 rounded-md cursor-pointer ${
                        selectedProduct.variants?.[0]?.quantity === 0 || !selectedProduct.available
                          ? 'bg-[#1a6bff] cursor-not-allowed'
                          : 'bg-[#f50809] hover:bg-[#e00708]'
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (selectedProduct.variants?.[0]?.quantity === 0 || !selectedProduct.available) {
                          handleOpenPreorder(selectedProduct); // Use the handler
                        } else {
                          addToCart(selectedProduct);
                        }
                      }}
                    >
                      {!(selectedProduct.variants?.[0]?.quantity === 0 || !selectedProduct.available) && (
                        <BsCart3 className="text-[16px] font-black text-white sm:text-[20px]" />
                      )}
                      <span className="text-[16px] text-[#ffffff] font-medium">
                        {selectedProduct.variants?.[0]?.quantity === 0 || !selectedProduct.available
                          ? 'Ön sifariş'
                          : 'Səbətə at'}
                      </span>
                    </button>
                  )}
                  <div className="flex items-center justify-center">
                    {likedProductIds[selectedProduct.id] ? (
                      <FaHeart
                        className="text-[24px] text-[#f50809] cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleLikeToggle(selectedProduct);
                        }}
                      />
                    ) : (
                      <FaRegHeart
                        className="text-[24px] text-[#777777] hover:text-[#f50809] cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleLikeToggle(selectedProduct);
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center mt-4">
                  <Link
                    to={`/products/${selectedProduct.permalink}`}
                    className="text-[14px] text-[#000000] hover:text-[#f50809] border-b border-dashed border-gray-400 hover:border-[#f50809]"
                  >
                    Məhsul səhifəsini açın
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sevimlilər Limit Modalı */}
      {isFavoritesLimitOpen && (
        <div className="fixed inset-0 bg-[#0a0a0a98] flex items-center justify-center z-50 cursor-pointer" onClick={closeLimitModal}>
          <div
            ref={limitModalRef}
            className="bg-white w-[400px] h-[184px] py-4 px-6 rounded-lg shadow-lg max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeLimitModal}
              className="absolute top-3 right-3 text-[#000000] z-10"
            >
              <RiCloseFill className="text-[26px]" />
            </button>
            <h3 className="text-[20px] font-semibold text-[#000000] mb-2">Diqqət!</h3>
            <p className="text-[16px] text-[#000000] mb-6">
              Sevimlilər siyahınıza 20-dən az məhsul əlavə edə bilərsiniz
            </p>
            <Link to={'/Favorites'} className="bg-[#f50809] text-white px-6 py-3 rounded-md hover:bg-[#e00708] transition">
              Sevimlilərə keçin
            </Link>
          </div>
        </div>
      )}

      {/* Ön sifariş Modalı */}
      {isPreorderOpen && preorderProduct && (
        <div
          className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-[#0a0a0a98] z-[100]"
          onClick={handleCloseForm}
        >
          <div
            ref={preorderModalRef}
            className="bg-white w-[440px] h-auto max-h-[90vh] overflow-hidden py-4 px-6 rounded-md relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-row items-center justify-between mb-4 flex-shrink-0">
              <h2 className="text-[20px] text-black font-bold">Ön sifariş</h2>
              <button onClick={handleCloseForm}>
                <RiCloseFill className="text-[20px] text-black font-bold" />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              <div className='flex flex-col mb-5'>
                <p className="text-[16px] text-black font-medium">
                  Ön sifariş – kitabların anbarda olmadığı halda sifariş vermək imkanıdır. Bizim operator tezliklə sizinlə əlaqə saxlayacaq və iki seçim təklif edəcək:
                </p>
                <p className="text-[16px] text-black font-medium">
                  1. Ola bilər ki, kitab artıq yoldadır və tezliklə mağaza qiyməti ilə anbarda olacaq. Biz sizin əlaqə məlumatlarınızı əldə edəcək və kitab anbarda olarkən sizə xəbər verəcəyik.
                </p>
                <p className="text-[16px] text-black font-medium">
                  2. Sizin üçün özəl sifarişlə kitab gətirə bilərik, lakin qiymət hazırda saytda göstəriləndən fərqli ola bilər.
                </p>
              </div>
              <form
                onSubmit={handleSubmit}
                action="#"
                className="space-y-4"
                data-alert="Müraciətiniz uğurla göndərildi. Ən qısa zamanda sizinlə əlaqə saxlayacağıq."
                data-form-name="callback"
              >
                <input name="feedback[subject]" type="hidden" defaultValue="Ön sifariş" />
                <input name="feedback[content]" type="hidden" defaultValue="Ön sifariş" />
                <input name="feedback[from]" type="hidden" defaultValue="info@alinino.az" />
                <a
                  href={`https://api.whatsapp.com/send/?phone=994513122440&text=${encodeURIComponent(`Salam. Öncədən sifariş etmək istəyirəm «${preorderProduct?.title || ''}» ${preorderProduct ? `https://alinino.az/product/${preorderProduct.permalink}` : 'https://alinino.az/'}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-row items-center justify-center gap-1 w-full border-2 border-[#25d366] py-2 rounded cursor-pointer"
                >
                  <FaWhatsapp className="text-[22px] text-[#25d366]" />
                  <p className="text-[18px] text-[#25d366] font-normal">WhatsApp-da ön sifariş</p>
                </a>
                <div className="flex flex-col">
                  <label className="mb-1">Adınız</label>
                  <input
                    type="text"
                    name="feedback[name]"
                    className="border border-[#dddddd] outline-none rounded px-3 py-2"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1">
                    E-Mail <span className="text-[#dc0708]">*</span>
                  </label>
                  <input
                    type="email"
                    name="feedback[email]"
                    className="border border-[#dddddd] outline-none rounded px-3 py-2"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1">
                    Əlaqə nömrəsi <span className="text-[#dc0708]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="feedback[phone]"
                    className="border border-[#dddddd] outline-none rounded px-3 py-2"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="mb-1">Rəylər</label>
                  <textarea name="feedback[message]" className='h-[100px] border border-[#dddddd] outline-none rounded px-3 py-2'></textarea>
                </div>
                <div className="flex justify-center">
                  <ReCAPTCHA
                    sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                    onChange={handleRecaptchaChange}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-[50px] text-[#ffffff] bg-[#0052e6] hover:bg-[#007aff] font-medium text-[20px] py-2 rounded"
                >
                  Müraciət edin
                </button>
                <input type="hidden" defaultValue="" className="js-feedback-fields js-feedback-fields-cart" data-title="Səbətin tərkibi" />
                <input type="hidden" defaultValue="https://alinino.az/" className="js-feedback-fields js-feedback-fields-url" data-title="Səhifədən göndərilib" />
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Scroll Top Düyməsi */}
      {showScrollTop && (
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={scrollToTop}
            className="relative w-12 h-12 bg-[#005bff] text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center scroll-top-button z-10"
            aria-label="Yuxarı qalx"
          >
            <FaChevronUp className="text-[22px] hover-arrow" />
          </button>
        </div>
      )}
      <style jsx>{`
        @keyframes sound-wave {
          0% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 0 0 rgba(0, 122, 255, 0.7);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow: 0 0 0 20px rgba(0, 122, 255, 0);
          }
        }
        @keyframes arrow-popup {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          15% {
            transform: translateY(-30px);
            opacity: 0;
          }
          30% {
            transform: translateY(30px);
            opacity: 0;
          }
          45% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .scroll-top-button:hover::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          animation: sound-wave 1s ease-out 1;
        }
        .hover-arrow {
          /* Animasiya başlanğıcda olmur */
        }
        .scroll-top-button:hover .hover-arrow {
          animation: arrow-popup 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}

export default Collection;
