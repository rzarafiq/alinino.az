import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaRegStar, FaRegCommentDots, FaMinus, FaPlus, FaHeart, FaRegHeart, FaWhatsapp, FaChevronUp } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";
import { RiCloseFill, RiInformation2Line } from "react-icons/ri";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ReCAPTCHA from "react-google-recaptcha";
import { scrollTop } from "../../utility/scrollTop";

function Favorites() {
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [likedProducts, setLikedProducts] = useState([]);
  const [likedProductIds, setLikedProductIds] = useState({});
  const [cartQuantities, setCartQuantities] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFirstSlide, setIsFirstSlide] = useState(true);
  const [isLastSlide, setIsLastSlide] = useState(false);
  const modalRef = useRef(null);
  const swiperRef = useRef(null);
  const [isPreorderOpen, setIsPreorderOpen] = useState(false);
  const [preorderProduct, setPreorderProduct] = useState(null);
  const preorderModalRef = useRef(null);

  // Responsive üçün
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const isDesktop = windowWidth >= 1024;

  // localStorage-dən səbət miqdarlarını yüklə
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cartProducts')) || [];
    const quantities = {};
    cart.forEach((item) => {
      quantities[item.id] = item.quantity || 1;
    });
    setCartQuantities(quantities);
  }, []);

  // Səbəti yenilə və hadisə göndər
  const updateCartAndNotify = (product, quantityChange) => {
    const cart = JSON.parse(localStorage.getItem('cartProducts')) || [];
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

    localStorage.setItem('cartProducts', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    return newQuantity;
  };

  // Səbətə əlavə et
  const addToCart = (product) => {
    const newQuantity = updateCartAndNotify(product, 1);
    setCartQuantities((prev) => ({
      ...prev,
      [product.id]: newQuantity,
    }));
  };

  // Miqdarı dəyiş (məhsul üzərində)
  const handleQuantityChange = (product, change) => {
    const newQuantity = updateCartAndNotify(product, change);
    if (newQuantity === 0) {
      setCartQuantities((prev) => {
        const updated = { ...prev };
        delete updated[product.id];
        return updated;
      });
    } else {
      setCartQuantities((prev) => ({
        ...prev,
        [product.id]: newQuantity,
      }));
    }
  };

  // Modalda miqdarı dəyiş
  const handleModalQuantityChange = (change) => {
    if (!selectedProduct) return;
    handleQuantityChange(selectedProduct, change);
  };

  // localStorage-dan sevimliləri yüklə
  const loadLikedProducts = () => {
    const saved = JSON.parse(localStorage.getItem("likedProducts")) || [];
    setLikedProducts(saved);

    // likedProductIds map-i yenilə
    const likedMap = {};
    saved.forEach((p) => (likedMap[p.id] = true));
    setLikedProductIds(likedMap);
  };

  useEffect(() => {
    loadLikedProducts();

    const handleStorageChange = () => loadLikedProducts();
    const handleCustomEvent = () => loadLikedProducts();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("likedProductsUpdated", handleCustomEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("likedProductsUpdated", handleCustomEvent);
    };
  }, []);

  // Sevimliyə əlavə/sil
  const handleLikeToggle = (product) => {
    const isLiked = likedProducts.some((p) => p.id === product.id);
    const updated = isLiked
      ? likedProducts.filter((p) => p.id !== product.id)
      : [...likedProducts, product];

    setLikedProducts(updated);
    localStorage.setItem("likedProducts", JSON.stringify(updated));
    window.dispatchEvent(new Event("likedProductsUpdated"));
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

  // Ön sifariş funksiyaları
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

  const [showScrollTop, setShowScrollTop] = useState(false);

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
        <ol className="flex h-8 max-w-[1428px] mx-auto px-10 lg:px-[64px] space-x-2 text-[12px] text-[#777777]">
          <li className="flex items-center">
            <Link to="/" className="hover:text-[#dc0708]">
              Əsas
            </Link>
          </li>
          <li className="flex items-center space-x-1">
            <span>/</span>
            <p className="px-1 font-medium cursor-default">Sevimlilər</p>
          </li>
        </ol>
      </div>

      {/* Başlıq */}
      <div className="flex flex-row items-center justify-between max-w-[1428px] mx-auto h-full px-10 lg:px-[64px] mt-5">
        <h2 className="text-[28px]">Sevimlilər</h2>
      </div>

      {/* Məhsul siyahısı */}
      <div className="flex flex-col gap-4 max-w-[1428px] mx-auto h-full px-4 sm:px-6 mb-5 lg:px-[64px] overflow-y-auto">
        {likedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaRegHeart className="text-[80px] sm:text-[100px] lg:text-[120px] text-[#f5f5f5]" />
            <p className="text-[14px] text-[#9d9d9d] text-center mt-4">
              Sevimliləriniz hazırda boşdur
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 mt-10">
              <Link
                to="/"
                className="text-[14px] sm:text-[16px] text-[#1a6bff] border-2 border-[#1a6bff] px-6 py-2 rounded-md w-full sm:w-auto text-center"
              >
                Əsas səhifə
              </Link>
              <Link
                to="/catalog"
                className="text-[14px] sm:text-[16px] text-white bg-[#1a6bff] px-8 sm:px-10 py-2 sm:py-2.5 rounded-md w-full sm:w-auto text-center"
              >
                Kataloq
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-2 bg-[#f7f8fa] p-3 rounded-md mt-4">
              <RiInformation2Line className="text-[20px] sm:text-[22px] lg:text-[24px] text-[#777777] flex-shrink-0 mt-0.5" />
              <p className="text-[12px] sm:text-[13px] lg:text-[14px] text-[#888888]">
                Diqqət edin! Sevimlilərinizə 20-dən çox məhsul əlavə edə bilməzsiniz. Seçimi saxlamaq üçün şəxsi hesabınıza{" "}
                <Link to="/user" className="underline">daxil olun</Link>.
              </p>
            </div>

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
                {likedProducts.map((product) => {
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
          </>
        )}
      </div>

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
                          handleModalQuantityChange(-1);
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
                          handleModalQuantityChange(1);
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
                    <FaHeart
                      className="text-[24px] text-[#f50809] cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleLikeToggle(selectedProduct);
                      }}
                    />
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

export default Favorites;