import { useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import { FaRegStar, FaRegCommentDots, FaRegHeart, FaHeart, FaMinus, FaPlus, FaWhatsapp, FaChevronUp } from "react-icons/fa";
import { RiCloseFill } from "react-icons/ri";
import { BsCart3 } from "react-icons/bs";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ReCAPTCHA from "react-google-recaptcha";
import { scrollTop } from "../../utility/scrollTop";

function Cart() {
  const [cartProducts, setCartProducts] = useState([]);
  const [cartQuantities, setCartQuantities] = useState({});
  const [likedProductIds, setLikedProductIds] = useState({});
  const [inputValue, setInputValue] = useState("");
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
  const [recommendProducts, setRecommendProducts] = useState([]);
  const [isFavoritesLimitOpen, setIsFavoritesLimitOpen] = useState(false);
  const limitModalRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [viewedProducts, setViewedProducts] = useState([]);
  const [isPreorderOpen, setIsPreorderOpen] = useState(false);
  const [preorderProduct, setPreorderProduct] = useState(null);
  const preorderModalRef = useRef(null);
  const [showBar, setShowBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Responsive
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Təhlükəsiz parse
  const safeParse = (key, fallback = []) => {
    try {
      const item = localStorage.getItem(key);
      const parsed = item ? JSON.parse(item) : fallback;
      return Array.isArray(parsed) ? parsed : fallback;
    } catch (e) {
      console.error(`localStorage parse xətası: ${key}`, e);
      return fallback;
    }
  };

  // Səbət məhsullarını yüklə
  useEffect(() => {
    const stored = safeParse("cartProducts", []);
    setCartProducts(stored);
    const quantities = {};
    stored.forEach((product) => {
      quantities[product.id] = product.quantity || 1;
    });
    setCartQuantities(quantities);
  }, []);

  // Sevimliləri yüklə
  useEffect(() => {
    const liked = safeParse("likedProducts", []);
    const likedMap = {};
    liked.forEach((p) => (likedMap[p.id] = true));
    setLikedProductIds(likedMap);
  }, []);

  // Baxdığınız məhsulları yüklə
  useEffect(() => {
    const viewed = safeParse('viewedProducts', []);
    setViewedProducts(viewed);
  }, []);

  const handleViewedSlideChange = (swiper) => {
    setIsViewedBeginning(swiper.isBeginning);
    setIsViewedEnd(swiper.isEnd);
  };

  const closeLimitModal = () => {
    setIsFavoritesLimitOpen(false);
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

  // Səbətdəki miqdarı dəyiş (Səbət siyahısı üçün)
  const handleModalQuantityChange = (productId, delta) => {
    setCartQuantities((prev) => {
      const updated = { ...prev };
      const currentValue = updated[productId] || 1;
      const newValue = Math.max(1, currentValue + delta);
      updated[productId] = newValue;
      const updatedCart = cartProducts.map((p) =>
        p.id === productId ? { ...p, quantity: newValue } : p
      );
      localStorage.setItem("cartProducts", JSON.stringify(updatedCart));
      setCartProducts(updatedCart);
      window.dispatchEvent(new Event("cartUpdated"));
      return updated;
    });
  };

  // Məhsulu səbətdən sil
  const handleRemoveFromCart = (id) => {
    const filtered = cartProducts.filter((p) => p.id !== id);
    localStorage.setItem("cartProducts", JSON.stringify(filtered));
    setCartProducts(filtered);
    setCartQuantities((prev) => {
      const newQuantities = { ...prev };
      delete newQuantities[id];
      return newQuantities;
    });
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Kupon təmizlə
  const handleClear = () => {
    setInputValue("");
  };

  // Ümumi məbləğ
  const totalAmount = useMemo(() => {
    return cartProducts
      .reduce((total, product) => {
        const price = Number(product.price || product.variants?.[0]?.price || 0);
        const quantity = cartQuantities[product.id] || 1;
        return total + price * quantity;
      }, 0)
      .toFixed(2);
  }, [cartProducts, cartQuantities]);

  // Tövsiyə edilən məhsullar
  useEffect(() => {
    let productSource = safeParse("allProducts", []);
    if (productSource.length === 0) {
      productSource = safeParse("viewedProducts", []);
    }
    const potentialRecommendations = productSource;
    const recommendations = potentialRecommendations
      .sort(() => 0.5 - Math.random())
      .slice(0, 8);
    setRecommendProducts(recommendations);
  }, [cartProducts, viewedProducts]);

  // Baxılan məhsullar içindən səbətdə olanları çıxar
  const filteredViewedProducts = useMemo(() => {
    const cartProductIds = new Set(cartProducts.map(p => p.id));
    return viewedProducts.filter(p => !cartProductIds.has(p.id));
  }, [viewedProducts, cartProducts]);

  // Səbətə əlavə et
  const addToCart = (product) => {
    const variant = product.variants?.[0];
    if (!variant || !product.available || variant.quantity <= 0) return;
    const existing = cartProducts.find(p => p.id === product.id);
    const newQuantity = (existing ? existing.quantity : 0) + 1;
    const updatedProduct = { ...product, quantity: newQuantity };
    const updatedCart = existing
      ? cartProducts.map(p => (p.id === product.id ? updatedProduct : p))
      : [...cartProducts, updatedProduct];
    localStorage.setItem("cartProducts", JSON.stringify(updatedCart));
    setCartProducts(updatedCart);
    setCartQuantities(prev => ({ ...prev, [product.id]: newQuantity }));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Məhsulun miqdarını dəyiş (tövsiyə bölməsində)
  const handleQuantityChange = (product, delta) => {
    const variant = product.variants?.[0];
    if (!variant || !product.available || variant.quantity <= 0) return;
    const currentQty = cartQuantities[product.id] || 0;
    const newQty = Math.max(0, currentQty + delta);
    if (newQty === 0) {
      handleRemoveFromCart(product.id);
      return;
    }
    const updatedCart = cartProducts.map(p =>
      p.id === product.id ? { ...p, quantity: newQty } : p
    );
    localStorage.setItem("cartProducts", JSON.stringify(updatedCart));
    setCartProducts(updatedCart);
    setCartQuantities(prev => ({ ...prev, [product.id]: newQty }));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Modal aç
  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Xaricinə klik
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isModalOpen && modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  // Swiper naviqasiya
  const onSwiperInit = (swiper) => {
    swiperRef.current = swiper;
    setIsFirstSlide(swiper.isBeginning);
    setIsLastSlide(swiper.isEnd);
  };

  const onSlideChange = (swiper) => {
    setIsFirstSlide(swiper.isBeginning);
    setIsLastSlide(swiper.isEnd);
  };

  // Modalda miqdarı dəyiş (Sürətli görünüş modalı üçün)
  const handleModalQuantityChangeInModal = (delta) => {
    if (!selectedProduct) return;
    const productId = selectedProduct.id;
    const variant = selectedProduct.variants?.[0];
    if (!variant || !selectedProduct.available || variant.quantity <= 0) return;
    const currentQty = cartQuantities[productId] || 0;
    const newQty = Math.max(0, currentQty + delta);
    if (newQty === 0) {
      handleRemoveFromCart(productId);
      return;
    }
    const updatedCart = cartProducts.map(p =>
      p.id === productId ? { ...p, quantity: newQty } : p
    );
    localStorage.setItem("cartProducts", JSON.stringify(updatedCart));
    setCartProducts(updatedCart);
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

  // sabit bar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < lastScrollY) {
        setShowBar(true);
      } else if (window.scrollY > lastScrollY + 50) {
        setShowBar(false);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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

  return (
    <>
      {/* Xəritə */}
      <div className="w-full p-1 bg-gray-100 mt-12 lg:mt-0">
        <ol className="flex h-8 max-w-[1428px] mx-auto px-2 md:px-10 lg:px-[64px] space-x-2 text-[12px] text-[#777777]">
          <li className="flex items-center">
            <Link to="/" className="hover:text-[#dc0708]">
              Əsas
            </Link>
          </li>
          <li className="flex items-center space-x-1">
            <span>/</span>
            <p className="px-1 font-medium cursor-default">Səbət</p>
          </li>
        </ol>
      </div>

      {/* Başlıq */}
      <div className="flex flex-row items-center justify-between max-w-[1428px] mx-auto h-full px-2 md:px-10 lg:px-[64px] mt-5">
        <div className={`w-[920px] ${cartProducts.length > 0 ? "border-b border-[#dddddd] pb-4" : ""}`}>
          <h2 className="text-[28px]">Səbət</h2>
        </div>
        {cartProducts.length > 0 && (
          <div
            onClick={() => {
              localStorage.removeItem("cartProducts");
              setCartProducts([]);
              setCartQuantities({});
              window.dispatchEvent(new Event("cartUpdated"));
            }}
            className="flex flex-row items-center gap-1 text-[#777777] pb-4 cursor-pointer"
          >
            <FiTrash2 className="text-[22px] sm:text-[20px]" />
            <span className="text-[14px] border-b border-dashed hidden sm:inline">Təmizlə</span>
          </div>
        )}
      </div>

      {/* Səbət */}
      <div className="flex flex-col gap-4 max-w-[1428px] mx-auto h-full px-2 md:px-10 lg:px-[64px] overflow-y-auto">
        {cartProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <BsCart3 className="text-[120px] text-[#f5f5f5]" />
            <p className="text-[14px] text-[#9d9d9d] text-center mt-4">
              Səbətiniz hələ ki boşdur
            </p>
            <div className="flex flex-row items-center gap-5 mt-10">
              <Link to="/" className="text-[16px] text-[#1a6bff] border-2 border-[#1a6bff] px-6 py-2 rounded-md">
                Əsas səhifə
              </Link>
              <Link to="/catalog" className="text-[16px] text-white bg-[#1a6bff] px-10 py-2.5 rounded-md">
                Kataloq
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Məhsul siyahısı */}
            <div className="flex-1 flex flex-col gap-3">
              {cartProducts.map((product) => {
                const quantity = cartQuantities[product.id] || 1;
                const unitPrice = Number(product.price || product.variants?.[0]?.price || 0);
                return (
                  <div
                    key={product.id}
                    className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-[#dddddd] pb-3 mt-3"
                  >
                    {/* Şəkil və Məhsul Adı */}
                    <div className="flex flex-row items-center gap-10 flex-1">
                      <Link to={`/products/${product.permalink}`}>
                        <img
                          src={product.image || product.first_image?.medium_url || "/no-image.png"}
                          alt={product.title}
                          className="w-[50px] h-[80px] object-cover"
                        />
                      </Link>
                      <Link to={`/products/${product.permalink}`} className="flex-1">
                        <span className="text-[14px] font-medium text-[#000000] hover:text-[#f50809] transition-colors duration-300">
                          {product.title}
                        </span>
                      </Link>
                    </div>

                    {/* Qiymət, Say, Bəyənmə və Silmə elementləri */}
                    <div className="flex flex-row items-center gap-4 w-auto ml-auto">
                      <div className="flex flex-col items-end text-[13px] min-w-[80px]">
                        <span className="text-[#777777]">
                          {quantity} × {unitPrice.toFixed(2)} AZN
                        </span>
                        <span className="text-[15px] text-[#000000] font-semibold">
                          {(unitPrice * quantity).toFixed(2)} AZN
                        </span>
                      </div>
                      <div className="flex items-center gap-3 rounded-md">
                        <button
                          onClick={() => handleModalQuantityChange(product.id, -1)}
                          className="text-[#777777] hover:text-[#000000]"
                        >
                          <FaMinus className="text-[14px]" />
                        </button>
                        <div className="flex items-center justify-center text-[14px] text-[#000000] font-medium w-[70px] h-[40px] border border-[#dddddd] rounded">
                          <span>{quantity}</span>
                        </div>
                        <button
                          onClick={() => handleModalQuantityChange(product.id, 1)}
                          className="text-[#777777] hover:text-[#000000]"
                        >
                          <FaPlus className="text-[14px]" />
                        </button>
                      </div>
                      <div className="flex items-center justify-center">
                        {likedProductIds[product.id] ? (
                          <FaHeart
                            className="text-[24px] text-[#f50809] cursor-pointer"
                            onClick={() => handleLikeToggle(product)}
                          />
                        ) : (
                          <FaRegHeart
                            className="text-[24px] text-[#777777] hover:text-[#f50809] cursor-pointer"
                            onClick={() => handleLikeToggle(product)}
                          />
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(product.id)}
                        className="text-[#777777] hover:text-[#dc2626]"
                      >
                        <FiTrash2 size={22} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Kupon və Sifariş */}
            <div className="w-full md:w-[365px] bg-[#f7f8fa] rounded p-1 mt-6 md:mt-0">
              <div className="flex flex-row items-center justify-between m-4">
                <h2 className="text-[18px] text-[#000000] font-normal">ÜMUMİ:</h2>
                <span className="text-[18px] text-[#000000] font-semibold">{totalAmount} AZN</span>
              </div>
              <div className="flex flex-col justify-center gap-2 bg-[#ffffff] p-4 mt-5 rounded">
                <p className="text-[14px] text-[#000000] font-normal">
                  Promokod və ya endirim kuponu (Hər sifarişdə yalnız bir promokod istifadə etmək mümkündür)
                </p>
                <div className="flex flex-row items-center gap-2">
                  <div className="relative w-[230px]">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Kuponun kodunu qeyd edin"
                      className="border border-[#dddddd] p-2.5 pr-8 rounded-md w-full outline-none placeholder:text-[14px]"
                    />
                    {inputValue && (
                      <RiCloseFill
                        onClick={handleClear}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[18px] text-[#777777] hover:text-[#f50809] cursor-pointer"
                      />
                    )}
                  </div>
                  <p className="text-[14px] text-[#000000] hover:text-[#f50809] font-normal border-b border-dashed border-[#000000] hover:border-[#f50809] cursor-pointer">
                    Qəbul etmək
                  </p>
                </div>
                <button className="w-full h-[50px] bg-[#f50809] text-white text-[18px] py-2 mt-3 rounded-md hover:bg-[#dc2626] transition">
                  Sifariş edin
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sabitlənmiş bar */}
        {cartProducts.length > 0 && (
          <div
            className={`fixed bottom-0 left-0 right-0 w-full bg-white p-4 z-10 flex flex-row items-center justify-between transition-all duration-300 md:hidden ${
              showBar ? "translate-y-0" : "translate-y-[100%]"
            } shadow-[0_-4px_6px_rgba(0,0,0,0.1)]`}
          >
            <div className="flex flex-col">
              <span className="text-[16px] text-[#000000] font-semibold">
                {totalAmount} AZN
              </span>
              <span className="text-[14px] text-[#555555]">
                {cartProducts.reduce(
                  (sum, product) => sum + (cartQuantities[product.id] || 1),
                  0
                )}{" "}
                məhsul
              </span>
            </div>
            <button className="bg-[#f50809] text-white text-[16px] px-6 py-2 rounded-md hover:bg-[#dc2626]">
              Səbətə əlavə et
            </button>
          </div>
        )}
      </div>

      {/* Tövsiyə edirik */}
      {recommendProducts.length > 0 && (
        <div className="w-full mt-5">
          <div className="flex flex-col max-w-[1428px] mx-auto px-4 lg:px-16">
            <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-normal">Tövsiyə edirik</h2>
            <div className="max-w-[1428px] mx-auto w-full">
              <div
                className={`
                  grid grid-cols-2 gap-[10px]
                  max-[480px]:gap-[12px]
                  sm:grid-cols-3 sm:gap-[15px]
                  md:grid-cols-4 md:gap-[20px]
                  lg:grid-cols-4 lg:gap-[25px]
                  xl:grid-cols-5 xl:gap-[30px]
                `}
              >
                {recommendProducts.map((product) => {
                  const variant = product.variants?.[0] || {};
                  const oldPrice = parseFloat(variant.old_price || 0);
                  const newPrice = parseFloat(variant.price || 0);
                  const hasDiscount = oldPrice > newPrice && oldPrice > 0;
                  const discountPercent = hasDiscount
                    ? Math.round(((oldPrice - newPrice) / oldPrice) * 100)
                    : 0;
                  const secondImage = product.images?.find((img) => img.position === 2)?.original_url;
                  const isLiked = likedProductIds[product.id];
                  const currentQuantity = cartQuantities[product.id] || 0;
                  const isOutOfStock = !variant || !product.available || variant.quantity <= 0;
                  const hasExpress = product.characteristics?.some((c) => c.permalink === "ekspress");
                  const hasComingSoon = product.characteristics?.some((c) => c.title === "TEZLİKLƏ!");
                  const hasFreeDelivery = product.characteristics?.some((c) => c.permalink === "PULSUZ ÇATDIRILMA");
                  const hasBestseller = product.characteristics?.some((c) => c.permalink.toLowerCase() === "bestseller");

                  return (
                    <article
                      key={product.id}
                      className="flex flex-col justify-between w-full h-full px-2 py-4 rounded-md overflow-hidden bg-[#ffffff] relative transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
                      onMouseEnter={() => setHoveredProductId(product.id)}
                      onMouseLeave={() => setHoveredProductId(null)}
                    >
                      {/* Etiketlər */}
                      <div className="absolute top-3 left-3 flex flex-col items-start gap-1 p-2 z-30">
                        {hasDiscount && (
                          <div className="bg-[#f8353e] text-[#ffffff] text-[10px] sm:text-[11px] lg:text-[12px] font-semibold px-2 py-1 rounded-md shadow-md">
                            -{discountPercent}%
                          </div>
                        )}
                        {isOutOfStock && (
                          <div className="bg-[#000000] text-[#ffffff] text-[10px] sm:text-[11px] lg:text-[12px] font-semibold px-2 py-1 rounded-md shadow-md">
                            Satıldı
                          </div>
                        )}
                        {hasBestseller && (
                          <div className="bg-[#005bff] text-[#ffffff] text-[10px] sm:text-[11px] lg:text-[12px] font-semibold px-2 py-1 rounded-md shadow-md">
                            Bestseller
                          </div>
                        )}
                        {hasComingSoon && (
                          <div className="bg-[#005bff] text-[#ffffff] text-[10px] sm:text-[11px] lg:text-[12px] font-semibold px-2 py-1 rounded-md shadow-md">
                            TEZLİKLƏ!
                          </div>
                        )}
                        {hasFreeDelivery && (
                          <div className="bg-[#005bff] text-[#ffffff] text-[8.8px] sm:text-[10px] lg:text-[11px] font-semibold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md shadow-md">
                            PULSUZ ÇATDIRILMA
                          </div>
                        )}
                        {hasExpress && (
                          <div className="bg-[#dcfe5b] text-[#000000] text-[10px] sm:text-[11px] lg:text-[12px] font-semibold px-2 py-1 rounded-md shadow-md">
                            Ekspress
                          </div>
                        )}
                      </div>

                      {/* Sevimlilər ikonu */}
                      <div className="absolute top-3 right-3 p-2 z-30">
                        <FaHeart
                          className="text-[18px] sm:text-[19px] lg:text-[20px] text-[#f50809] cursor-pointer"
                          onClick={() => handleLikeToggle(product)}
                        />
                      </div>

                      {/* Şəkil */}
                      <Link to={`/products/${product.permalink}`} className="block">
                        <div className="w-full h-[180px] sm:h-[200px] md:h-[220px] flex items-center justify-center bg-[#ffffff] overflow-hidden relative group">
                          <img
                            src={product.first_image?.original_url || "/no-image.png"}
                            alt={product.title}
                            className="w-[60%] sm:w-[65%] h-fit object-contain transition-opacity duration-300"
                          />
                          {secondImage && (
                            <img
                              src={secondImage}
                              alt={`${product.title} - second`}
                              className="w-[60%] sm:w-[65%] h-fit object-contain absolute inset-0 m-auto opacity-0 pointer-events-none lg:group-hover:opacity-100 lg:pointer-events-auto"
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
                            <div className="bg-[#eeeeeee6] text-[#000000] font-medium py-1 sm:py-1.5 w-full text-center rounded-md shadow-sm text-[12px] sm:text-[13px] lg:text-[14px]">
                              Sürətli görünüş
                            </div>
                          </button>
                        </div>
                      </Link>

                      {/* Məzmun */}
                      <div className="flex flex-col flex-1 p-2">
                        {/* Məhsul məlumatları (həmişə görünür) */}
                        <div>
                          <div className="flex flex-row items-center justify-start sm:gap-3 flex-wrap">
                            <div className="text-[16px] sm:text-[17px] lg:text-[18px] font-semibold text-gray-900">{newPrice.toFixed(2)} AZN</div>
                            {hasDiscount && (
                              <div className="text-[14px] sm:text-[15px] lg:text-[16px] line-through text-gray-500">{oldPrice.toFixed(2)} AZN</div>
                            )}
                          </div>

                          <h3 className="text-[12px] sm:text-[13px] lg:text-[14px] text-[#000000] hover:text-[#f50809] font-semibold leading-snug line-clamp-2 mt-1">
                            {product.title || "Məhsul adı"}
                          </h3>

                          <div className="flex items-center gap-2 mt-2 sm:mt-3">
                            <div className="flex space-x-1 text-[16px] sm:text-[17px] lg:text-[18px] cursor-default select-none">
                              {[...Array(5)].map((_, index) => (
                                <span key={index} className="text-gray-300">
                                  <FaRegStar />
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-1 text-gray-500 hover:text-[#000000]">
                              <FaRegCommentDots className="text-[14px] sm:text-[15px] lg:text-[16px]" />
                              <span className="text-[12px] sm:text-[13px] lg:text-[14px]">{product.reviews_count_cached || 0}</span>
                            </div>
                          </div>
                        </div>

                        {/* Əməliyyatlar - Mobil/desktopa görə fərqli davranış */}
                        <div className="mt-auto h-[50px] sm:h-[55px] lg:h-[60px] flex items-end">
                          {/* 0-1024px: Həmişə görünür */}
                          <div className="w-full lg:hidden">
                            {currentQuantity > 0 ? (
                              <div className="flex h-auto w-full max-w-[120px] sm:max-w-[130px] lg:max-w-[140px] items-center justify-between gap-1 rounded-md">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuantityChange(product, -1);
                                  }}
                                  className="rounded-l-md bg-[#f50809] px-1 py-1 text-white sm:px-1.5 sm:py-2"
                                >
                                  <FaMinus className="text-[14px] sm:text-[15px] lg:text-[16px] text-white" />
                                </button>
                                <div className="flex items-center gap-0.5 bg-white p-1 text-[10px] sm:text-[11px] lg:text-[12px] font-medium text-black sm:gap-1 sm:p-1.5">
                                  {currentQuantity} <span>ədəd</span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuantityChange(product, 1);
                                  }}
                                  className="rounded-r-md bg-[#f50809] px-1 py-1 text-white sm:px-1.5 sm:py-2"
                                >
                                  <FaPlus className="text-[14px] sm:text-[15px] lg:text-[16px] text-white" />
                                </button>
                              </div>
                            ) : (
                              <button
                                className={`flex h-auto w-full max-w-[120px] sm:max-w-[130px] lg:max-w-[140px] cursor-pointer items-center justify-center gap-1 rounded-md px-1 py-1 text-white transition-colors duration-300 sm:gap-2 sm:px-1.5 sm:py-2 ${
                                  isOutOfStock ? 'bg-[#1a6bff] cursor-not-allowed' : 'bg-[#f50809]'
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isOutOfStock) {
                                    handleOpenPreorder(product);
                                  } else {
                                    addToCart(product);
                                  }
                                }}
                              >
                                {!isOutOfStock && <BsCart3 className="text-[14px] sm:text-[15px] lg:text-[16px] font-black text-white" />}
                                <span className="text-[11px] sm:text-[12px] lg:text-[13px] font-medium text-white">
                                  {isOutOfStock ? 'Ön sifariş' : 'Səbətə at'}
                                </span>
                              </button>
                            )}
                          </div>

                          {/* 1024px+: Hover zamanı görünür */}
                          <div
                            className={`w-full hidden lg:block transition-all duration-300 transform opacity-0 translate-y-2 ${
                              hoveredProductId === product.id ? "opacity-100 translate-y-0" : "pointer-events-none"
                            }`}
                          >
                            {currentQuantity > 0 ? (
                              <div className="flex h-auto w-full max-w-[120px] sm:max-w-[130px] lg:max-w-[140px] items-center justify-between gap-1 rounded-md">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuantityChange(product, -1);
                                  }}
                                  className="rounded-l-md bg-[#f50809] px-1 py-1 text-white sm:px-1.5 sm:py-2"
                                >
                                  <FaMinus className="text-[14px] sm:text-[15px] lg:text-[16px] text-white" />
                                </button>
                                <div className="flex items-center gap-0.5 bg-white p-1 text-[10px] sm:text-[11px] lg:text-[12px] font-medium text-black sm:gap-1 sm:p-1.5">
                                  {currentQuantity} <span>ədəd</span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuantityChange(product, 1);
                                  }}
                                  className="rounded-r-md bg-[#f50809] px-1 py-1 text-white sm:px-1.5 sm:py-2"
                                >
                                  <FaPlus className="text-[14px] sm:text-[15px] lg:text-[16px] text-white" />
                                </button>
                              </div>
                            ) : (
                              <button
                                className={`flex h-auto w-full max-w-[120px] sm:max-w-[130px] lg:max-w-[140px] cursor-pointer items-center justify-center gap-1 rounded-md px-1 py-1 text-white transition-colors duration-300 sm:gap-2 sm:px-1.5 sm:py-2 ${
                                  isOutOfStock ? 'bg-[#1a6bff] cursor-not-allowed' : 'bg-[#f50809]'
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isOutOfStock) {
                                    handleOpenPreorder(product);
                                  } else {
                                    addToCart(product);
                                  }
                                }}
                              >
                                {!isOutOfStock && <BsCart3 className="text-[14px] sm:text-[15px] lg:text-[16px] font-black text-white" />}
                                <span className="text-[11px] sm:text-[12px] lg:text-[13px] font-medium text-white">
                                  {isOutOfStock ? 'Ön sifariş' : 'Səbətə at'}
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Baxdığınız Məhsullar */}
      {filteredViewedProducts.length > 0 && (
        <div className="w-full mt-5">
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
                  const hasFreeDelivery = selectedProduct.characteristics?.some((c) => c.permalink === "free_delivery");
                  const hasBestseller = selectedProduct.characteristics?.some((c) => c.permalink.toLowerCase() === "bestseller");
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
                          handleOpenPreorder(selectedProduct);
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

        /* Digər CSS-lər olduğu kimi qalır */
      `}
      </style>
    </>
  );
}

export default Cart;