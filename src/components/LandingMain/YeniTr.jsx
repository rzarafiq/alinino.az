import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';
import { FaRegStar, FaRegCommentDots, FaChevronRight, FaRegHeart, FaHeart, FaMinus, FaPlus, FaWhatsapp } from 'react-icons/fa';
import { RiCloseFill } from 'react-icons/ri';
import { BsCart3 } from 'react-icons/bs';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ReCAPTCHA from "react-google-recaptcha";
import { getAllProducts } from '../../services/index';
import alinino_logo from "../../assets/img/alinino_logo.png";

const YeniTr = () => {
  const productSwiperRef = useRef(null);
  const modalRef = useRef(null);
  const limitModalRef = useRef(null);
  const swiperRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [likedProducts, setLikedProducts] = useState([]);
  const [likedProductIds, setLikedProductIds] = useState({});
  const [cartQuantities, setCartQuantities] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFirstSlide, setIsFirstSlide] = useState(true);
  const [isLastSlide, setIsLastSlide] = useState(false);
  const [isFavoritesLimitOpen, setIsFavoritesLimitOpen] = useState(false);
  const [isPreorderOpen, setIsPreorderOpen] = useState(false);
  const [preorderProduct, setPreorderProduct] = useState(null);

  // Təhlükəsiz parse
  const safeParse = (key, fallback = []) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.error(`localStorage parse xətası: ${key}`, e);
      return fallback;
    }
  };

  // localStorage-dan sevimliləri yüklə
  const loadLikedProducts = () => {
    const saved = safeParse('likedProducts', []);
    setLikedProducts(saved);
    const idMap = {};
    saved.forEach((p) => (idMap[p.id] = true));
    setLikedProductIds(idMap);
  };

  // Səbət məhsullarını yüklə
  const loadCartQuantities = () => {
    const cart = safeParse('cartProducts', []);
    const quantities = {};
    cart.forEach(item => {
      quantities[item.id] = item.quantity || 0;
    });
    setCartQuantities(quantities);
  };

  useEffect(() => {
    loadLikedProducts();
    loadCartQuantities();

    const handleStorageChange = () => {
      loadLikedProducts();
      loadCartQuantities();
    };
    const handleCustomEvent = () => {
      loadLikedProducts();
      loadCartQuantities();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('likedProductsUpdated', handleCustomEvent);
    window.addEventListener('cartUpdated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('likedProductsUpdated', handleCustomEvent);
      window.removeEventListener('cartUpdated', handleCustomEvent);
    };
  }, []);

  // Səbəti yenilə
  const updateCart = (product, change) => {
    const variant = product.variants?.[0];
    if (!variant) return 0;

    const cart = safeParse('cartProducts', []);
    const index = cart.findIndex((item) => item.id === product.id);
    let newQuantity = 0;

    if (index > -1) {
      // Mövcud məhsul var
      newQuantity = cart[index].quantity + change;
      if (newQuantity <= 0) {
        // Məhsulu sil
        cart.splice(index, 1);
      } else {
        // Stok yoxlaması
        if (variant.quantity && newQuantity > variant.quantity) {
          alert(`Stokda yalnız ${variant.quantity} ədəd mövcuddur.`);
          return cart[index].quantity;
        }
        cart[index].quantity = newQuantity;
      }
    } else if (change > 0) {
      // Yeni məhsul əlavə et
      if (variant.quantity && change > variant.quantity) {
        alert(`Stokda yalnız ${variant.quantity} ədəd mövcuddur.`);
        return 0;
      }
      
      // Məhsulu düzgün formatda əlavə et
      const productToAdd = {
        id: product.id,
        title: product.title,
        permalink: product.permalink,
        first_image: product.first_image,
        variants: product.variants,
        available: product.available,
        unit: product.unit,
        reviews_count_cached: product.reviews_count_cached,
        quantity: change,
        // Variant məlumatlarını əlavə et
        price: variant.price,
        old_price: variant.old_price,
        sku: variant.sku,
        variant_quantity: variant.quantity
      };
      
      cart.push(productToAdd);
      newQuantity = change;
    }

    try {
      localStorage.setItem('cartProducts', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Səbət saxlanılanda xəta:', error);
      return 0;
    }

    return newQuantity;
  };

  const addToCart = (product) => {
    const newQuantity = updateCart(product, 1);
    if (newQuantity > 0) {
      setCartQuantities((prev) => ({ ...prev, [product.id]: newQuantity }));
    }
  };

  const handleQuantityChange = (product, change) => {
    const newQuantity = updateCart(product, change);
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

  const handleModalQuantityChange = (change) => {
    if (!selectedProduct) return;
    handleQuantityChange(selectedProduct, change);
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
    setTimeout(() => {
      swiperRef.current?.update();
    }, 100);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const closeLimitModal = () => {
    setIsFavoritesLimitOpen(false);
  };

  // Ön sifariş modalını aç
  const openPreorderModal = (product) => {
    setPreorderProduct(product);
    setIsPreorderOpen(true);
  };

  // Ön sifariş modalını bağla
  const handleCloseForm = () => {
    setIsPreorderOpen(false);
    setPreorderProduct(null);
  };

  // ReCAPTCHA dəyişikliyi
  const handleRecaptchaChange = (value) => {
    console.log("Captcha value:", value);
  };

  // Form göndərişi
  const handleSubmit = (e) => {
    e.preventDefault();
    // Burada form məlumatlarını göndərmək üçün kod yazın
    alert('Müraciətiniz uğurla göndərildi. Ən qısa zamanda sizinlə əlaqə saxlayacağıq.');
    handleCloseForm();
  };

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const onSwiperInit = (swiper) => {
    swiperRef.current = swiper;
    setIsFirstSlide(swiper.isBeginning);
    setIsLastSlide(swiper.isEnd);
  };

  const onSlideChange = (swiper) => {
    setIsFirstSlide(swiper.isBeginning);
    setIsLastSlide(swiper.isEnd);
  };

  // Modal xaricinə klik
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isModalOpen && modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
      if (isFavoritesLimitOpen && limitModalRef.current && !limitModalRef.current.contains(e.target)) {
        closeLimitModal();
      }
      // Ön sifariş modalı üçün
      if (isPreorderOpen && e.target.classList.contains('fixed') && e.target.classList.contains('top-0') && e.target.classList.contains('left-0')) {
        handleCloseForm();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isModalOpen, isFavoritesLimitOpen, isPreorderOpen]);

  // Məhsulları yüklə
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsObject = await getAllProducts();
        const turkishBooks = productsObject['Türk Dilində Kitablar'];
        setProducts(Array.isArray(turkishBooks) ? turkishBooks : []);
      } catch (error) {
        console.error('Məhsullar gətirilərkən xəta:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Pencərə ölçüsü dəyişəndə swiper yenilənsin
  useEffect(() => {
    const handleResize = () => productSwiperRef.current?.update();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sevimlilərə əlavə/sil
  const handleLikeToggle = (product) => {
    const isLiked = likedProductIds[product.id];

    if (isLiked) {
      // Sil
      const updated = likedProducts.filter((p) => p.id !== product.id);
      localStorage.setItem('likedProducts', JSON.stringify(updated));
      setLikedProducts(updated);
      setLikedProductIds((prev) => {
        const newIds = { ...prev };
        delete newIds[product.id];
        return newIds;
      });
      window.dispatchEvent(new Event('likedProductsUpdated'));
    } else {
      // Əlavə et (20 limiti yoxla)
      if (likedProducts.length >= 20) {
        setIsFavoritesLimitOpen(true);
        return;
      }

      const updated = [...likedProducts, product];
      localStorage.setItem('likedProducts', JSON.stringify(updated));
      setLikedProducts(updated);
      setLikedProductIds((prev) => ({ ...prev, [product.id]: true }));
      window.dispatchEvent(new Event('likedProductsUpdated'));
    }
  };

if (loading) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <img src={alinino_logo} alt="alinino_logo" className="w-40 h-40 object-contain animate-spin-reverse" />
    </div>
  );
}

  return (
    <section className="section widget-slider py-4">
      <div className="relative flex flex-col justify-start items-start w-full max-w-[1428px] mx-auto px-4 sm:px-6 md:px-10 lg:px-[64px] h-auto rounded-md">
        <div className="flex flex-row items-center justify-between w-full sm:w-[500px] h-auto">
          <div className="flex items-center gap-2 sm:gap-4 group-hover-trigger">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-[30px] text-[#000000] font-medium transition-colors duration-200">
              Yeni Türk nəşrləri
            </h2>
            <div className="relative overflow-hidden w-6 h-6 sm:w-7 sm:h-7 hover-group">
              <div className="absolute top-0 left-0 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-[#f7f8fa] rounded hover-group-child transition-colors duration-200">
                <FaChevronRight className="text-[14px] sm:text-[16px] text-[#000000] hover-group-icon transition-colors duration-200" />
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes slide-in-out {
            0%, 25% {
              transform: translateX(0);
              opacity: 1;
            }
            40% {
              transform: translateX(150%);
              opacity: 0;
            }
            60% {
              transform: translateX(-150%);
              opacity: 0;
            }
            75%, 100% {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .hover-group:hover .hover-group-child {
            background-color: #dc0708;
          }
          .hover-group:hover .hover-group-icon {
            color: #ffffff;
            animation: slide-in-out 1s infinite linear;
          }
          .group-hover-trigger:hover h2,
          h2:hover {
            color: #dc0708;
          }
          h2:hover ~ .hover-group .hover-group-child {
            background-color: #dc0708;
          }
          h2:hover ~ .hover-group .hover-group-icon {
            color: #ffffff;
            animation: slide-in-out 1s infinite linear;
          }
        `}</style>

        <div className="relative group mt-5 w-full max-w-[1400px] mx-auto">
          {products.length > 0 ? (
            <Swiper
              onSwiper={(swiper) => {
                productSwiperRef.current = swiper;
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
              }}
              onSlideChange={handleSlideChange}
              modules={[Navigation]}
              spaceBetween={16}
              slidesPerView={5}
              loop={false}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              className="mySwiper"
              breakpoints={{
                0: { slidesPerView: 2, spaceBetween: 10 },
                480: { slidesPerView: 2.5, spaceBetween: 12 },
                640: { slidesPerView: 3, spaceBetween: 15 },
                768: { slidesPerView: 4, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 25 },
                1280: { slidesPerView: 5, spaceBetween: 30 },
              }}
            >
              {products.map((product) => {
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
                  <SwiperSlide 
                    key={product.id || product.permalink}
                    onClick={() => window.location.href = `/products/${product.permalink}`}
                  >
                    <article
                      className="relative flex h-[320px] w-full cursor-pointer flex-col overflow-hidden rounded bg-white sm:h-[400px]"
                      onMouseEnter={() => setHoveredProductId(product.id)}
                      onMouseLeave={() => setHoveredProductId(null)}
                    >
                      <div
                        className={`absolute inset-0 z-10 flex items-center justify-center bg-transparent transition-opacity duration-300 ${
                          hoveredProductId === product.id ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <button
                          className="w-[90%] h-auto cursor-pointer rounded-md bg-[#eeeeeee6] px-4 py-1.5 text-sm font-medium text-black sm:px-6 sm:text-base"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            openModal(product);
                          }}
                        >
                          Sürətli görünüş
                        </button>
                      </div>

                      <Link to={`/products/${product.permalink}`} rel="noopener noreferrer" className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        <div className="relative flex h-[180px] w-full items-center justify-center overflow-hidden bg-white sm:h-[220px]">
                          <img
                            src={
                              hoveredProductId === product.id && secondImage
                                ? secondImage
                                : product.first_image?.original_url
                            }
                            alt={product.title}
                            className="h-auto w-[70%] object-contain transition-all duration-300 sm:w-[65%]"
                          />
                        </div>
                      </Link>

                      <div className="flex flex-grow flex-col justify-between p-2">
                        <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:gap-3">
                          <div className="flex items-center gap-1 text-sm font-semibold text-gray-900 sm:text-[18px]">
                            {newPrice} <span>AZN</span>
                          </div>
                          {hasDiscount && (
                            <div className="text-xs font-normal text-gray-500 line-through sm:text-[16px]">
                              {oldPrice} AZN
                            </div>
                          )}
                        </div>

                        <h3 className="line-clamp-2 text-xs font-normal leading-snug text-black hover:text-[#f50809] sm:text-[16px]">
                          {product.title || 'Məhsul adı'}
                        </h3>

                        <div className="mt-auto flex flex-col items-start gap-2 sm:gap-3">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <div className="flex cursor-default select-none space-x-0.5 text-[14px] sm:space-x-1 sm:text-[18px]">
                              {[...Array(5)].map((_, index) => (
                                <span key={index} className="text-gray-300">
                                  <FaRegStar />
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500 hover:text-black sm:text-sm">
                              <FaRegCommentDots className="text-[12px] sm:text-[16px]" />
                              <span>{product.reviews_count_cached || 0}</span>
                            </div>
                          </div>

                          {currentQuantity > 0 ? (
                            <div className="flex h-auto w-full max-w-[140px] items-center justify-between gap-1 rounded-md z-50">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuantityChange(product, -1);
                                }}
                                className="rounded-l-md bg-[#f50809] px-1 py-1 text-white sm:px-1.5 sm:py-2"
                              >
                                <FaMinus className="text-[16px] text-white sm:text-[20px]" />
                              </button>
                              <div className="flex items-center gap-0.5 bg-white p-1 text-xs font-medium text-black sm:gap-1 sm:p-1.5 sm:text-[14px]">
                                {currentQuantity} <span>ədəd</span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuantityChange(product, 1);
                                }}
                                className="rounded-r-md bg-[#f50809] px-1 py-1 text-white sm:px-1.5 sm:py-2"
                              >
                                <FaPlus className="text-[16px] text-white sm:text-[20px]" />
                              </button>
                            </div>
                          ) : (
                            <button
                              className={`flex h-auto w-full max-w-[140px] cursor-pointer items-center justify-center gap-1 rounded-md px-1 py-1 text-white transition-colors duration-300 sm:gap-2 z-50 sm:px-1.5 sm:py-2 ${
                                isOutOfStock ? 'bg-[#1a6bff] cursor-not-allowed' : 'bg-[#f50809]'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isOutOfStock) {
                                  openPreorderModal(product);
                                } else {
                                  addToCart(product);
                                }
                              }}
                              disabled={isOutOfStock}
                            >
                              {!isOutOfStock && <BsCart3 className="text-[16px] font-black text-white sm:text-[20px]" />}
                              <span className="text-xs font-medium text-white sm:text-[16px] z-50">
                                {isOutOfStock ? 'Ön sifariş' : 'Səbətə at'}
                              </span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="absolute top-0 left-0 z-10 flex flex-col items-start gap-1 p-2">
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

                      <div className="absolute top-0 right-0 z-10 flex flex-col items-start gap-1 p-2">
                        {isLiked ? (
                          <FaHeart
                            className="cursor-pointer text-[16px] text-[#f50809] sm:text-[20px]"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikeToggle(product);
                            }}
                          />
                        ) : (
                          <FaRegHeart
                            className="cursor-pointer text-[16px] text-gray-500 transition-colors duration-200 hover:text-[#f50809] sm:text-[20px]"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikeToggle(product);
                            }}
                          />
                        )}
                      </div>
                    </article>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          ) : (
            <p>Məhsul tapılmadı.</p>
          )}

          {/* Navigasiya düymələri */}
          <button
            onClick={() => productSwiperRef.current?.slidePrev()}
            className={`swiper-button-prev-custom absolute top-1/2 -left-3 sm:-left-5 -translate-y-1/2 z-20 p-1.5 sm:p-2 bg-white rounded-full cursor-pointer transition-all duration-300 ${
              isBeginning || products.length <= 5 ? 'opacity-0 -translate-x-5' : 'opacity-100 translate-x-0'
            } shadow-[0_0_10px_0_rgba(0,0,0,0.25)] hidden md:block`}
          >
            <GoArrowLeft className="text-lg sm:text-2xl text-black" />
          </button>
          <button
            onClick={() => productSwiperRef.current?.slideNext()}
            className={`swiper-button-next-custom absolute top-1/2 -right-3 sm:-right-5 -translate-y-1/2 z-20 p-1.5 sm:p-2 bg-white rounded-full cursor-pointer transition-all duration-300 ${
              isEnd || products.length <= 5 ? 'opacity-0 translate-x-5' : 'opacity-100 translate-x-0'
            } shadow-[0_0_10px_0_rgba(0,0,0,0.25)] hidden md:block`}
          >
            <GoArrowRight className="text-lg sm:text-2xl text-black" />
          </button>
        </div>
      </div>

      {/* Modal (Sürətli Görünüş) */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-[#0a0a0a98] flex items-center justify-center z-50 cursor-pointer">
          <div ref={modalRef} className="flex flex-col md:flex-row w-[95%] md:w-[982px] h-auto md:h-[530px] p-4 md:p-8 rounded-lg overflow-hidden bg-[#ffffff] relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-[#000000] z-50 cursor-pointer">
              <RiCloseFill className="text-[24px]" />
            </button>

            <div className="w-full md:w-[45%] h-fit">
              <div className="relative group w-full h-auto rounded-md">
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={0}
                  slidesPerView={1}
                  loop={selectedProduct.images.length > 1}
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
                  {selectedProduct.images.map((image) => (
                    <SwiperSlide key={image.id}>
                      <Link to={`/products/${selectedProduct.permalink}`} rel="noopener noreferrer">
                        <img
                          src={image.original_url}
                          alt={selectedProduct.title}
                          className="w-full h-full object-contain object-center rounded-md cursor-pointer"
                        />
                      </Link>
                    </SwiperSlide>
                  ))}
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
                  const isOutOfStock = !variant || !selectedProduct.available || variant.quantity <= 0;
                  const hasExpress = selectedProduct.characteristics?.some((c) => c.permalink === "ekspress");
                  const hasComingSoon = selectedProduct.characteristics?.some((c) => c.title === "TEZLİKLƏ!");
                  const hasFreeDelivery = selectedProduct.characteristics?.some((c) => c.permalink === "PULSUZ ÇATDIRILMA");
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
                  {selectedProduct.variants?.[0]?.price} AZN
                </div>
                {selectedProduct.variants?.[0]?.old_price &&
                  selectedProduct.variants[0].old_price !== selectedProduct.variants[0].price && (
                    <div className="text-[26px] line-through text-gray-500">
                      {selectedProduct.variants[0].old_price} AZN
                    </div>
                  )}
              </div>

              {selectedProduct.variants?.[0]?.old_price &&
                selectedProduct.variants[0].old_price > selectedProduct.variants[0].price && (
                  <div className="text-[#f50809] text-[14px] font-semibold mt-2">
                    Qənaət: {(selectedProduct.variants[0].old_price - selectedProduct.variants[0].price).toFixed(2)} AZN
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
                          openPreorderModal(selectedProduct); // Ön sifariş modalını aç
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
        <div className="fixed inset-0 bg-[#0a0a0a98] flex items-center justify-center z-50 cursor-pointer">
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
            <Link to={'/Favorites'}
              className="bg-[#f50809] text-white px-6 py-3 rounded-md hover:bg-[#e00708] transition"
            >
              Sevimlilərə keçin
            </Link>
          </div>
        </div>
      )}

      {/* Ön sifariş Modalı */}
      {isPreorderOpen && (
        <div
          className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-[#0a0a0a98] z-[100]"
          onClick={handleCloseForm}
        >
          <div
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
                  <label className="mb-1">
                    Rəylər
                  </label>
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
                <input
                  type="hidden"
                  defaultValue=""
                  className="js-feedback-fields js-feedback-fields-cart"
                  data-title="Səbətin tərkibi"
                />
                <input
                  type="hidden"
                  defaultValue="https://alinino.az/"
                  className="js-feedback-fields js-feedback-fields-url"
                  data-title="Səhifədən göndərilib"
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default YeniTr;