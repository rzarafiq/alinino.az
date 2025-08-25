import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { GoArrowLeft, GoArrowRight, GoShareAndroid } from 'react-icons/go';
import { FaRegHeart, FaHeart, FaMinus, FaPlus, FaRegStar, FaRegCommentDots, FaRegQuestionCircle, FaChevronUp, FaChevronDown, FaWhatsapp } from 'react-icons/fa';
import { RiCloseFill } from 'react-icons/ri';
import { BsCart3, BsPencil } from 'react-icons/bs';
import { MdOutlineDescription } from 'react-icons/md';
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import ReCAPTCHA from 'react-google-recaptcha';
import instance from '../../services/instance';
import alinino_logo from "../../assets/img/alinino_logo.png";
import { scrollTop } from "../../utility/scrollTop";

function Product() {
  const { permalink } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [allProducts, setAllProducts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [viewedProducts, setViewedProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const modalRef = useRef(null);
  const swiperRef = useRef(null);
  const [isFirstSlide, setIsFirstSlide] = useState(true);
  const [isLastSlide, setIsLastSlide] = useState(false);
  const limitModalRef = useRef(null);
  const [isFavoritesLimitOpen, setIsFavoritesLimitOpen] = useState(false);
  const productSwiperRef = useRef(null);
  const viewedSwiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isViewedBeginning, setIsViewedBeginning] = useState(true);
  const [isViewedEnd, setIsViewedEnd] = useState(false);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [likedProducts, setLikedProducts] = useState([]);
  const [likedProductIds, setLikedProductIds] = useState({});
  const [cartQuantities, setCartQuantities] = useState({});
  const [isPreorderOpen, setIsPreorderOpen] = useState(false);
  const [preorderProduct, setPreorderProduct] = useState(null);
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const safeParse = (key, fallback = []) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.error(`localStorage parse xətası: ${key}`, e);
      return fallback;
    }
  };

  // getByPermalink funksiyasını useCallback ilə yadda saxlayaq
  const getByPermalink = useCallback((searchPermalink) => {
    if (!product?.properties || !product?.characteristics) return null;
    const prop = product.properties.find(
      (p) => p.permalink === searchPermalink || (p.title && p.title.toLowerCase() === searchPermalink.toLowerCase())
    );
    if (!prop) {
      const char = product.characteristics.find(
        (c) => c.title && c.title.toLowerCase() === searchPermalink.toLowerCase()
      );
      return char?.title ?? null;
    }
    const ch = product.characteristics.find((c) => c.property_id === prop.id);
    return ch?.title ?? null;
  }, [product]);

  // Məhsulları API-dən gətirən funksiya
  const getAllProducts = async () => {
    try {
      const res = await instance.get('/products');
      return res.data;
    } catch (err) {
      console.error('Məhsullar gətirilə bilmədi:', err);
      throw new Error('Məhsullar gətirilə bilmədi');
    }
  };

  // Məhsulu yüklə və ayrıca bütün məhsulları state-ə qoy
  useEffect(() => {
    const fetchProduct = async () => {
      if (!permalink) return;
      try {
        setLoading(true);
        const allProductsRaw = await getAllProducts();
        // API-dən gələn data formatı nə olursa olsun array-ə çevirək
        const allItems = Array.isArray(allProductsRaw)
          ? allProductsRaw
          : Object.values(allProductsRaw).flat();
        setAllProducts(allItems);
        const found = allItems.find((p) => p.permalink === permalink);
        if (found) {
          setProduct(found);
          // Baxdığınız məhsullara əlavə et (yalnız eyni deyilsə)
          const viewed = safeParse('viewedProducts', []);
          const updatedViewed = [found, ...viewed.filter(p => p.id !== found.id)];
          // Maksimum 20 məhsul saxla
          if (updatedViewed.length > 20) updatedViewed.length = 20;
          localStorage.setItem('viewedProducts', JSON.stringify(updatedViewed));
          setViewedProducts(updatedViewed);
          const cart = safeParse('cartProducts', []);
          const cartItem = cart.find((it) => it.id === found.id);
          setCartQuantity(cartItem?.quantity || 0);
          const liked = safeParse('likedProducts', []);
          setLikedProducts(liked);
          const likedIds = liked.reduce((acc, p) => {
            acc[p.id] = true;
            return acc;
          }, {});
          setLikedProductIds(likedIds);
          setIsLiked(likedIds[found.id] || false); // Ana məhsul bəyənilibmi?
        } else {
          setError('Məhsul tapılmadı');
        }
      } catch (err) {
        setError('Məhsul yüklənərkən xəta baş verdi');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [permalink]);

  // Produkt state dəyişdikdən sonra bənzər məhsulları hesablamaq
  useEffect(() => {
    if (!product || allProducts.length === 0) {
      setSimilarProducts([]);
      return;
    }
    const findAuthor = (p) => {
      const authorChar = p.characteristics?.find((c) => {
        return c.permalink === 'avtor' || c.permalink === 'müəllif' || c.permalink === 'author';
      });
      return authorChar?.title || null;
    };
    const productAuthor = findAuthor(product);
    const isSimilar = (p) => {
      if (p.id === product.id) return false; // özünü çıxar
      // Prioritet 1: eyni category_id varsa
      if (product.category_id && p.category_id && product.category_id === p.category_id) return true;
      // Prioritet 2: eyni əsas kateqoriya hiyerarşisi varsa (ilk səviyyə)
      const prodMainCat = product.category_hierarchy?.[0];
      const pMainCat = p.category_hierarchy?.[0];
      if (prodMainCat && pMainCat && prodMainCat === pMainCat) return true;
      // Prioritet 3: eyni müəllif varsa
      const author = findAuthor(p);
      if (productAuthor && author && productAuthor.toLowerCase() === author.toLowerCase()) return true;
      // sənə uyğun daha çox şərt əlavə etmək olar (seriya, janr vs.)
      return false;
    };
    const filtered = allProducts.filter(isSimilar);
    // Sırala: mövcud olanlar birinci; sonra qiymət, sonra title
    filtered.sort((a, b) => {
      const aVariant = a.variants?.[0] || {};
      const bVariant = b.variants?.[0] || {};
      const aAvail = a.available && (aVariant.quantity || 0) > 0;
      const bAvail = b.available && (bVariant.quantity || 0) > 0;
      if (aAvail !== bAvail) return aAvail ? -1 : 1;
      const aPrice = parseFloat(aVariant.price || 0);
      const bPrice = parseFloat(bVariant.price || 0);
      if (aPrice !== bPrice) return aPrice - bPrice;
      return (a.title || '').localeCompare(b.title || '');
    });
    setSimilarProducts(filtered.slice(0, 20)); // maksimum 20 göstər
  }, [product, allProducts]);

  // Səbətə əlavə/sil
  const updateCart = (delta) => {
    if (!product) return;
    const newQuantity = Math.max(0, cartQuantity + delta);
    if (newQuantity === 0 && cartQuantity === 0) return;
    const cart = safeParse('cartProducts', []);
    const productIndex = cart.findIndex((item) => item.id === product.id);
    if (productIndex > -1) {
      if (newQuantity === 0) {
        cart.splice(productIndex, 1);
      } else {
        cart[productIndex].quantity = newQuantity;
      }
    } else if (newQuantity > 0) {
      const variant = product.variants?.[0];
      cart.push({
        id: product.id,
        title: product.title,
        price: parseFloat(variant?.price) || 0,
        old_price: parseFloat(variant?.old_price) || 0,
        quantity: newQuantity,
        permalink: product.permalink,
        image: product.first_image?.url || product.images?.[0]?.url,
        sku: variant?.sku,
      });
    }
    localStorage.setItem('cartProducts', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    setCartQuantity(newQuantity);
  };

  // Ana məhsul üçün bəyənmə/bəyənməmə funksiyası
  const toggleLike = () => {
    if (!product) return;
    const isCurrentlyLiked = isLiked;
    if (isCurrentlyLiked) {
      // Sil
      const updated = likedProducts.filter((p) => p.id !== product.id);
      localStorage.setItem('likedProducts', JSON.stringify(updated));
      setLikedProducts(updated);
      setLikedProductIds((prev) => {
        const newIds = { ...prev };
        delete newIds[product.id];
        return newIds;
      });
      setIsLiked(false);
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
      setIsLiked(true); // Ana məhsul state-ni yenilə
      window.dispatchEvent(new Event('likedProductsUpdated'));
    }
  };

  // Bənzər məhsullar və modal üçün ümumi bəyənmə/bəyənməmə funksiyası
  const handleLikeToggle = (prod) => {
    const isLikedLocal = likedProductIds[prod.id];
    if (isLikedLocal) {
      // Sil
      const updated = likedProducts.filter((p) => p.id !== prod.id);
      localStorage.setItem('likedProducts', JSON.stringify(updated));
      setLikedProducts(updated);
      setLikedProductIds((prev) => {
        const newIds = { ...prev };
        delete newIds[prod.id];
        return newIds;
      });
      // Əgər silinən məhsul ana məhsuldaysa, ana məhsul state-ni də yenilə
      if (prod.id === product?.id) {
        setIsLiked(false);
      }
      window.dispatchEvent(new Event('likedProductsUpdated'));
    } else {
      // Əlavə et (20 limiti yoxla)
      if (likedProducts.length >= 20) {
        setIsFavoritesLimitOpen(true);
        return;
      }
      const updated = [...likedProducts, prod];
      localStorage.setItem('likedProducts', JSON.stringify(updated));
      setLikedProducts(updated);
      setLikedProductIds((prev) => ({ ...prev, [prod.id]: true }));
      // Əgər əlavə edilən məhsul ana məhsuldaysa, ana məhsul state-ni də yenilə
      if (prod.id === product?.id) {
        setIsLiked(true);
      }
      window.dispatchEvent(new Event('likedProductsUpdated'));
    }
  };

  // Qiymət məlumatları
  const { price, oldPrice, hasDiscount, discountPercent } = useMemo(() => {
    const variant = product?.variants?.[0] || {};
    const currentPrice = parseFloat(variant.price) || 0;
    const basePrice = parseFloat(variant.old_price || variant.base_price || 0);
    const discount = basePrice > currentPrice;
    return {
      price: currentPrice.toFixed(2),
      oldPrice: basePrice.toFixed(2),
      hasDiscount: discount,
      discountPercent: discount ? Math.round(((basePrice - currentPrice) / basePrice) * 100) : 0,
    };
  }, [product]);

  // Mövcudluq
  const isOutOfStock = useMemo(() => {
    const variant = product?.variants?.[0];
    return !product?.available || (variant?.quantity || 0) <= 0;
  }, [product]);

  // Şəkillər
  const images = useMemo(() => {
    if (product?.images?.length > 0) return product.images;
    if (product?.first_image) return [product.first_image];
    return [];
  }, [product]);

  const publisher = getByPermalink('izdatelstvo') || getByPermalink('nəşriyyat') || getByPermalink('yayincilik');
  const author = getByPermalink('avtor') || getByPermalink('müəllif') || getByPermalink('author');
  // const onlineSpecialPrice = getByPermalink('onlayna-ozel-qiymet');
  // Updated logic to check for the characteristic existence correctly
  const onlineSpecialPrice = product?.characteristics?.some(c => c.permalink === 'onlayna-ozel-qiymet');
  const baseClass = 'flex items-center justify-center gap-1.5 px-4 py-2 rounded-md cursor-pointer transition-colors';
  const activeClass = 'bg-[#005bff] text-[#ffffff]';
  const inactiveClass = 'bg-[#f7f8fa] text-[#000000] hover:bg-[#005bff] hover:text-[#ffffff]';

  // Slayderin dəyişməsi zamanı arrowların aktivliyini yenilə
  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  // Baxdığınız məhsullar slayderi üçün dəyişiklik
  const handleViewedSlideChange = (swiper) => {
    setIsViewedBeginning(swiper.isBeginning);
    setIsViewedEnd(swiper.isEnd);
  };

  // Sürətli görünüş modalı açmaq üçün (indi alert yerinə modal açır)
  const openModal = (prod) => {
    setSelectedProduct(prod);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    // reset swiper ref ve indikatorlar
    swiperRef.current = null;
    setIsFirstSlide(true);
    setIsLastSlide(false);
  };

  // Modal swiper init və slide change funksiyaları
  const onSwiperInit = (s) => {
    swiperRef.current = s;
    setIsFirstSlide(s.isBeginning);
    setIsLastSlide(s.isEnd);
  };

  const onSlideChange = (s) => {
    setIsFirstSlide(s.isBeginning);
    setIsLastSlide(s.isEnd);
  };

  // Səbətə əlavə etmək və miqdarı dəyişmək funksiyası (similar slider üçün)
  const handleQuantityChange = (prod, delta) => {
    setCartQuantities((prev) => {
      const current = prev[prod.id] || 0;
      const newCount = current + delta;
      if (newCount < 0) return prev;
      return { ...prev, [prod.id]: newCount };
    });
  };

  // Birbaşa səbətə əlavə et (similar slider üçün)
  const addToCart = (prod) => {
    setCartQuantities((prev) => {
      if (prev[prod.id]) return prev;
      return { ...prev, [prod.id]: 1 };
    });
  };

  // Modal daxilində məhsul miqdarı dəyişmək
  const handleModalQuantityChange = (delta) => {
    if (!selectedProduct) return;
    setCartQuantities((prev) => {
      const current = prev[selectedProduct.id] || 0;
      const newCount = Math.max(0, current + delta);
      return { ...prev, [selectedProduct.id]: newCount };
    });
  };

  // Limit modalını bağlamaq üçün
  const closeLimitModal = () => {
    setIsFavoritesLimitOpen(false);
  };

  // Ön sifariş modalını açmaq üçün funksiya
  const openPreorderModal = (prod) => {
    setPreorderProduct(prod);
    setIsPreorderOpen(true);
  };

  // Ön sifariş modalını bağlamaq üçün funksiya
  const handleCloseForm = () => {
    setIsPreorderOpen(false);
    setPreorderProduct(null);
    setRecaptchaValue(null);
  };

  // ReCAPTCHA dəyişdikdə çağrılacaq funksiya
  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  // Formu göndərmək üçün funksiya
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!recaptchaValue) {
      alert('Zəhmət olmasa, ReCAPTCHA-nı doldurun.');
      return;
    }
    alert(e.target.getAttribute('data-alert') || 'Form göndərildi!');
    handleCloseForm();
  };

  // Modal bağlanmasını idarə et
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
      if (limitModalRef.current && !limitModalRef.current.contains(event.target)) {
        closeLimitModal();
      }
      // Ön sifariş modalı üçün klik xaricində bağlama
      if (isPreorderOpen && event.target.classList.contains('fixed') && event.target.classList.contains('inset-0')) {
         handleCloseForm();
      }
    };
    if (isModalOpen || isFavoritesLimitOpen || isPreorderOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen, isFavoritesLimitOpen, isPreorderOpen]);

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

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <img src={alinino_logo} alt="alinino_logo" className="w-40 h-40 object-contain animate-spin-reverse" />
      </div>
    );
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="container mx-auto p-4">Məhsul tapılmadı.</div>;
  }

  return (
    <>
      {/* Xəritə */}
      <div className="w-full p-1 bg-gray-100 mt-12 lg:mt-0">
        <ol className="flex overflow-x-auto whitespace-nowrap max-w-[1428px] mx-auto px-4 lg:px-16 py-2 text-xs text-[#777777] items-center hide-scrollbar">
          <li className="flex items-center flex-shrink-0">
            <Link to="/" className="hover:text-[#dc0708]">Əsas</Link>
          </li>
          {product.category_hierarchy?.map((cat, i) => (
            <li key={i} className="flex items-center flex-shrink-0">
              <span className="mx-1">/</span>
              <span className="capitalize">{cat}</span>
            </li>
          ))}
          <li className="flex items-center flex-shrink-0">
            <span className="mx-1">/</span>
            <span className="font-medium text-gray-900 truncate max-w-[200px]">{product.title}</span>
          </li>
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
      
      {/* Məhsul məlumatları */}     
      <div className="max-w-[1428px] mx-auto px-4 sm:px-6 lg:px-18 py-6 sm:py-8 lg:py-10 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
        {/* Şəkillər (sol) */}
        <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-8">
          <div className="w-full lg:w-24 relative">
            <div className="hidden lg:flex flex-col justify-center items-center relative h-[600px]">
              <button className="thumb-swiper-button-prev mb-2 px-5 py-1 bg-white border border-[#eeeeee] rounded-sm text-[#999999] hover:text-[#005bff] transition-colors z-10">
                <FaChevronUp className="text-lg" />
              </button>
              <Swiper
                onSwiper={setThumbsSwiper}
                direction="vertical"
                spaceBetween={1}
                slidesPerView={7}
                freeMode
                watchSlidesProgress
                modules={[FreeMode, Thumbs, Navigation]}
                navigation={{
                  nextEl: '.thumb-swiper-button-next',
                  prevEl: '.thumb-swiper-button-prev',
                }}
                className="my-thumbs-swiper-v h-full"
              >
                {images.map((img) => (
                  <SwiperSlide
                    key={`thumb-v-${img.id || img.url}`}
                    className="cursor-pointer overflow-hidden mx-auto rounded-md py-1 px-3 transition-all duration-200"
                  >
                    <img
                      src={img.url || img.medium_url}
                      alt={`${product.title} thumbnail`}
                      className="w-[48px] h-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <button className="thumb-swiper-button-next mt-2 px-5 py-1 bg-white border border-[#eeeeee] rounded-sm text-[#999999] hover:text-[#005bff] transition-colors z-10">
                <FaChevronDown className="text-lg" />
              </button>
            </div>
          </div>
          <div className="relative w-full lg:flex-1 group">
            <Swiper
              modules={[Navigation, Thumbs, Pagination]}
              spaceBetween={10}
              slidesPerView={1}
              loop={images.length > 1}
              navigation={{
                nextEl: '.swiper-button-next-custom',
                prevEl: '.swiper-button-prev-custom',
              }}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              pagination={{
                clickable: true,
                el: '.custom-swiper-pagination',
              }}
              className="w-full lg:w-[450px] h-[300px] sm:h-[400px] lg:h-[600px]"
            >
              {images.map((img) => (
                <SwiperSlide key={img.id || img.url}>
                  <img
                    src={img.large_url || img.original_url || img.url}
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <button className="swiper-button-prev-custom absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full shadow-md transition-all duration-300 transform -translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 hidden lg:block">
              <GoArrowLeft className="text-lg md:text-xl lg:text-3xl text-gray-700" />
            </button>
            <button className="swiper-button-next-custom absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full shadow-md transition-all duration-300 transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 hidden lg:block">
              <GoArrowRight className="text-lg md:text-xl lg:text-3xl text-gray-700" />
            </button>
            <div className="custom-swiper-pagination flex justify-center mt-4 lg:hidden"></div>
          </div>
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

            /* Yalnız aktiv thumbnail border alsın */
            .my-thumbs-swiper-v .swiper-slide {
              border: none;
            }
            .my-thumbs-swiper-v .swiper-slide-thumb-active {
              border: 2px solid #005bff;
              border-radius: 6px;
            }
          `}</style>
        </div>





        {/* Məlumatlar (sağ) */}
        <div className="flex flex-col justify-start">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2 sm:mt-0">
            {hasDiscount && (
              <div className="bg-[#f8353e] text-[#ffffff] text-[10px] sm:text-[12px] font-semibold px-2 py-0.5 rounded-md shadow-md">
                -{discountPercent}%
              </div>
            )}
            {isOutOfStock && (
              <div className="bg-[#000000] text-[#ffffff] text-[10px] sm:text-[12px] font-semibold px-2 py-0.5 rounded-md shadow-md">
                Satıldı
              </div>
            )}
            {product.characteristics?.some(c => c.permalink?.toLowerCase() === "bestseller") && (
              <div className="bg-[#005bff] text-[#ffffff] text-[10px] sm:text-[12px] font-semibold px-2 py-0.5 rounded-md shadow-md">
                Bestseller
              </div>
            )}
            {getByPermalink('tezlikle') && (
              <div className="bg-[#005bff] text-[#ffffff] text-[10px] sm:text-[12px] font-semibold px-2 py-0.5 rounded-md shadow-md">
                TEZLİKLƏ!
              </div>
            )}
            {getByPermalink('PULSUZ ÇATDIRILMA') && (
              <div className="bg-[#005bff] text-[#ffffff] text-[10px] sm:text-[12px] font-semibold px-2 py-0.5 rounded-md shadow-md">
                PULSUZ ÇATDIRILMA
              </div>
            )}
            {getByPermalink('ekspress') && (
              <div className="bg-[#dcfe5b] text-[#000000] text-[10px] sm:text-[12px] font-semibold px-2 py-0.5 rounded-md shadow-md">
                Ekspress
              </div>
            )}
          </div>
          
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-black mt-2">{product.title}</h1>
          
          {/* Nəşriyyat */}
          {publisher && (
            <div className="flex flex-row items-center gap-1.5 mt-2">
              <span className="text-[14px] sm:text-[16px] text-[#000000] font-medium whitespace-nowrap">Nəşriyyat:</span>
              <span className="text-[14px] sm:text-[16px] text-[#f50809] hover:text-[#000000] underline truncate">{publisher}</span>
            </div>
          )}
          
          {/* Müəllif */}
          {author && (
            <div className="flex flex-row items-center gap-1.5 mt-1">
              <span className="text-[14px] sm:text-[16px] text-[#000000] font-medium whitespace-nowrap">Müəllif:</span>
              <span className="text-[14px] sm:text-[16px] text-[#f50809] hover:text-[#000000] underline truncate">{author}</span>
            </div>
          )}
          
          <div className="flex flex-row items-center justify-start gap-2 sm:gap-3 text-[12px] sm:text-[14px] text-gray-400 mt-2">
            {/* Artikul */}
            {product.variants?.[0]?.sku && (
              <div className="flex items-center gap-1.5">
                <span className="font-semibold">Artikul:</span>
                <span>{product.variants[0].sku}</span>
              </div>
            )}
            {/* Ölçü vahidi */}
            {product.unit && (
              <div className="flex items-center gap-1.5">
                <span className="font-semibold">Ölçü vahidi:</span>
                <span>{product.unit === 'pce' ? 'ədəd' : product.unit}</span>
              </div>
            )}
          </div>
          
          {/* Qiymət */}
          <div className="flex flex-row items-baseline gap-2 sm:gap-3 mt-3">
            <p className="text-xl sm:text-2xl lg:text-[26px] font-semibold text-gray-900">{price} AZN</p>
            {hasDiscount && (
              <p className="text-xl sm:text-2xl lg:text-[26px] font-medium line-through text-[#999999]">{oldPrice} AZN</p>
            )}
          </div>
          {hasDiscount && (
            <p className="text-[#f50809] text-xs sm:text-sm font-semibold mt-1">
              Qənaət: {(parseFloat(oldPrice) - parseFloat(price)).toFixed(2)} AZN
            </p>
          )}
          
          {/* Reytinq */}
          <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-3">
            <div className="flex space-x-0.5 sm:space-x-1 text-base sm:text-lg text-gray-300">
              {[...Array(5)].map((_, index) => (
                <FaRegStar key={index} />
              ))}
            </div>
            <a href="#reviews" className="flex items-center gap-1 text-gray-500 hover:text-black">
              <FaRegCommentDots className="text-sm sm:text-base" />
              <span className="text-xs sm:text-sm border-b border-dashed border-gray-400 hover:border-black">
                {product.reviews_count_cached || 0} Rəy yaz
              </span>
            </a>
          </div>
          
          {/* Onlayna özəl qiymət */}
          {onlineSpecialPrice && (
            <div className="flex flex-row items-center justify-center w-[120px] sm:w-[140px] lg:w-[150px] h-[24px] sm:h-[28px] lg:h-[30px] bg-[#46a53b] text-[10px] sm:text-[12px] text-[#ffffff] font-light p-1.5 sm:p-2 mt-3 sm:mt-4 lg:mt-5 rounded-md">
              <span>Onlayna özəl qiymət</span>
            </div>
          )}
          
          {/* Mövcudluq */}
          <div className="flex items-center gap-1.5 sm:gap-2 mt-4 sm:mt-6 lg:mt-8">
            <span
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${!isOutOfStock ? 'bg-[#46a53b]' : 'bg-[#f50809]'}`}
            ></span>
            <span className="text-xs sm:text-sm font-bold text-black">
              {!isOutOfStock ? 'Mövcuddur' : 'Mövcud deyil'}
            </span>
          </div>
          
          {/* Səbət */}
          <div className="flex flex-row items-center justify-start gap-3 sm:gap-4 mt-4">
            {cartQuantity > 0 ? (
              <div className="flex flex-row items-center justify-start h-[44px] sm:h-[50px] lg:h-[55px] w-full">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateCart(-1);
                  }}
                  className="h-[44px] sm:h-[50px] lg:h-[55px] w-[44px] sm:w-[50px] lg:w-[55px] text-[#ffffff] bg-[#f50809] p-2 sm:p-3 lg:p-4 rounded-l-md"
                >
                  <FaMinus className="text-[14px] sm:text-[18px] lg:text-[20px] text-[#ffffff]" />
                </button>
                <Link
                  to="/cart"
                  className="flex flex-col items-center h-[44px] sm:h-[50px] lg:h-[55px] w-full bg-[#f7f8fa] text-[12px] sm:text-[14px] lg:text-[14px] text-[#000000] hover:text-[#f50809] font-medium p-1 sm:p-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-row items-center gap-1">
                    <span>{cartQuantity}</span>
                    <span>ədəd</span>
                  </div>
                  <span>Səbətə keç</span>
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateCart(1);
                  }}
                  className="h-[44px] sm:h-[50px] lg:h-[55px] w-[44px] sm:w-[50px] lg:w-[55px] text-[#ffffff] bg-[#f50809] p-2 sm:p-3 lg:p-4 rounded-r-md"
                >
                  <FaPlus className="text-[14px] sm:text-[18px] lg:text-[20px] text-[#ffffff]" />
                </button>
              </div>
            ) : (
              <button
                className={`flex items-center justify-center h-[44px] sm:h-[50px] lg:h-[55px] w-full p-2 gap-1.5 sm:gap-2 rounded-md cursor-pointer ${
                  product?.variants?.[0]?.quantity === 0 || !product?.available
                    ? 'bg-[#1a6bff] cursor-not-allowed'
                    : 'bg-[#f50809] hover:bg-[#e00708]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (product?.variants?.[0]?.quantity > 0 && product?.available) {
                    updateCart(1);
                  } else if (product?.variants?.[0]?.quantity === 0 || !product?.available) {
                    openPreorderModal(product);
                  }
                }}
                disabled={product?.variants?.[0]?.quantity === 0 || !product?.available}
              >
                {!(product?.variants?.[0]?.quantity === 0 || !product?.available) && (
                  <BsCart3 className="text-[14px] sm:text-[16px] lg:text-[20px] font-black text-white" />
                )}
                <span className="text-[14px] sm:text-[16px] lg:text-[16px] text-[#ffffff] font-medium">
                  {product?.variants?.[0]?.quantity === 0 || !product?.available
                    ? 'Ön sifariş'
                    : 'Səbətə at'}
                </span>
              </button>
            )}
            <div className="flex items-center justify-center">
              {isLiked ? (
                <FaHeart
                  className="text-[20px] sm:text-[22px] lg:text-[24px] text-[#f50809] cursor-pointer"
                  onClick={toggleLike}
                />
              ) : (
                <FaRegHeart
                  className="text-[20px] sm:text-[22px] lg:text-[24px] text-[#777777] hover:text-[#f50809] cursor-pointer"
                  onClick={toggleLike}
                />
              )}
            </div>
          </div>
          
          {/* Sual ver və Paylaşın */}
          <div className="flex items-center gap-3 sm:gap-4 mt-4 sm:mt-6">
            <button className="flex items-center gap-1.5 text-[#000000] hover:text-[#f50809] transition-colors cursor-pointer">
              <FaRegQuestionCircle className="text-[16px] sm:text-[18px] lg:text-[20px]" />
              <span className="text-[14px] sm:text-[16px] font-medium border-b border-dashed">Sual ver</span>
            </button>
            <button className="flex items-center gap-1.5 text-[#000000] hover:text-[#f50809] transition-colors cursor-pointer">
              <GoShareAndroid className="text-[16px] sm:text-[18px] lg:text-[20px]" />
              <span className="text-[14px] sm:text-[16px] font-medium border-b border-dashed">Paylaşın</span>
            </button>
          </div>
          
          {/* Daxil olduğu kateqoriyalar */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4 sm:mt-5">
            {product.category_hierarchy?.map((cat, i) => (
              <span
                key={i}
                className="text-[12px] sm:text-[14px] text-[#999999] border hover:text-[#f50809] border-[#eeeeee] hover:border-[#f50809] px-2 py-0.5 sm:px-3 sm:py-1 rounded-sm transition-colors cursor-pointer"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Təsvir və Xüsusiyyətlər */}
      <div className='w-full mt-5'>
        <div className="flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-5 max-w-[1428px] mx-auto px-4 lg:px-16">
          <button
            onClick={() => setActiveTab('description')}
            className={`${baseClass} ${activeTab === 'description' ? activeClass : inactiveClass} flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3`}
          >
            <MdOutlineDescription className="text-[20px] sm:text-[24px]" />
            <span className="text-[14px] sm:text-[16px]">Təsvir</span>
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            className={`${baseClass} ${activeTab === 'specifications' ? activeClass : inactiveClass} flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3`}
          >
            <HiOutlineAdjustmentsHorizontal className="text-[20px] sm:text-[24px]" />
            <span className="text-[14px] sm:text-[16px]">Xüsusiyyətlər</span>
          </button>
        </div>
        <div className="py-5 px-4 lg:px-16 max-w-[1428px] mx-auto">
          {activeTab === 'description' && (
            <div className="text-[#333333] leading-relaxed text-[14px] sm:text-base">
              {product.description ? (
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              ) : (
                <p className="text-[#888888] italic">Təsvir mövcud deyil.</p>
              )}
            </div>
          )}
          {activeTab === 'specifications' && (
            <div className="space-y-3">
              {product ? (
                (() => {
                  const isbnFromChars = getByPermalink('isbn');
                  const isbnFromVariant =
                    product.variants?.[0]?.sku || product.variants?.[0]?.barcode || null;
                  // Prioritize ISBN from characteristics, then variant
                  const isbn = isbnFromChars || isbnFromVariant || null;
                  const fields = [
                    { key: 'isbn', label: 'ISBN', value: isbn },
                    { key: 'avtor', label: 'Müəllif', value: getByPermalink('avtor') },
                    { key: 'zhanr', label: 'Janr', value: getByPermalink('zhanr') },
                    { key: 'pagesnumber', label: 'Səhifə sayı', value: getByPermalink('pagesnumber') },
                    { key: 'izdatelstvo', label: 'Nəşriyyat', value: getByPermalink('izdatelstvo') },
                    { key: 'yazik', label: 'Dil', value: getByPermalink('yazik') },
                    { key: 'pereplyot', label: 'Cild', value: getByPermalink('pereplyot') },
                    { key: 'label', label: 'Etiket', value: getByPermalink('label') },
                  ];
                  const anyValueExists = fields.some((f) => !!f.value);
                  return anyValueExists ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0 sm:gap-x-[200px] gap-y-2">
                      {fields.map((f) => f.value && (
                        <div key={f.key} className="flex justify-between py-1 text-[14px] sm:text-base">
                          <span className="text-[#000000]">{f.label}</span>
                          <span className="flex-1 border-b border-dotted border-[#dddddd] mx-2"></span>
                          <span className="text-[#999999]">{f.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#999999] italic text-[14px] sm:text-base">Xüsusiyyətlər mövcud deyil.</p>
                  );
                })()
              ) : (
                <p className="text-[#999999] italic text-[14px] sm:text-base">Xüsusiyyətlər mövcud deyil.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Rəylər */}
      <div className="w-full mt-5">
        <div className="flex flex-col max-w-[1428px] mx-auto px-4 lg:px-16">
          <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-normal">Məhsul haqqında rəylər</h2>
          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 sm:gap-5 mt-5">
            <div className="flex items-center justify-start gap-3 bg-[#f7f8fa] text-[#999999] flex-1 min-w-[150px] sm:min-w-[200px] h-auto sm:h-[50px] py-2 sm:py-2.5 px-4 sm:px-5 rounded-md">
              <BsPencil className="text-2xl sm:text-3xl font-bold" />
              <span className="text-sm sm:text-base">
                Burada hələ heç kim rəy yazmayıb. Birinci olun!
              </span>
            </div>
            <button className="text-[16px] sm:text-lg md:text-[20px] bg-[#7d6fa0] hover:bg-[#9187a8] text-white font-medium w-full sm:w-[280px] md:w-[330px] h-auto sm:h-[50px] py-2 sm:py-2.5 px-4 rounded-md transition-colors duration-300">
              Rəy yazın
            </button>
          </div>
        </div>
      </div>

      {/* Bənzər məhsullar */}
      <div className="w-full mt-5">
        <div className="flex flex-col max-w-[1428px] mx-auto px-4 lg:px-16">
          <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-normal">Bənzər məhsullar</h2>
          <div className="relative flex flex-col justify-start items-start group w-full max-w-[1428px] mx-auto px-2 sm:px-4 lg:px-[4px] h-auto rounded-md">
            <div className="relative group mt-5 w-full max-w-[1428px] mx-auto">
              {similarProducts.length > 0 ? (
                <Swiper
                  onSwiper={(swiper) => {
                    productSwiperRef.current = swiper;
                    setIsBeginning(swiper.isBeginning);
                  }}
                  onSlideChange={handleSlideChange}
                  modules={[Navigation]}
                  spaceBetween={10}
                  slidesPerView={2}
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
                  {similarProducts.map((prod) => {
                    const variant = prod.variants?.[0] || {};
                    const oldPrice = parseFloat(variant.old_price || 0);
                    const newPrice = parseFloat(variant.price || 0);
                    const hasDiscount = oldPrice > newPrice && oldPrice > 0;
                    const discountPercent = hasDiscount
                      ? Math.round(((oldPrice - newPrice) / oldPrice) * 100)
                      : 0;
                    const secondImage = prod.images?.find((img) => img.position === 2)?.original_url;
                    const isLiked = likedProductIds[prod.id];
                    const currentQuantity = cartQuantities[prod.id] || 0;
                    const isOutOfStock = !variant || !prod.available || (variant.quantity || 0) <= 0;
                    const hasExpress = prod.characteristics?.some((c) => c.permalink === "ekspress");
                    const hasComingSoon = prod.characteristics?.some((c) => c.title === "TEZLİKLƏ!");
                    const hasFreeDelivery = prod.characteristics?.some((c) => c.permalink === "PULSUZ ÇATDIRILMA");
                    const hasBestseller = prod.characteristics?.some((c) => c.permalink.toLowerCase() === "bestseller");
                    return (
                      <SwiperSlide key={`similar-${prod.id}`}>
                        <article
                          className="relative flex h-[320px] w-full cursor-pointer flex-col overflow-hidden rounded bg-white sm:h-[400px]"
                          onMouseEnter={() => setHoveredProductId(prod.id)}
                          onMouseLeave={() => setHoveredProductId(null)}
                        >
                          {/* Clickable area for product navigation */}
                          <div
                            className="absolute inset-0 z-0 cursor-pointer"
                            onClick={() => navigate(`/products/${prod.permalink}`)} // Navigate on click
                          ></div>
                          <div
                            className={`absolute inset-0 z-10 flex items-center justify-center bg-transparent transition-opacity duration-300 ${
                              hoveredProductId === prod.id ? 'opacity-100' : 'opacity-0'
                            }`}
                          >
                            <button
                              className="w-[90%] h-auto cursor-pointer rounded-md bg-[#eeeeeee6] px-4 py-1.5 text-sm font-medium text-black sm:px-6 sm:text-base"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent navigation click
                                e.preventDefault();
                                openModal(prod);
                              }}
                            >
                              Sürətli görünüş
                            </button>
                          </div>
                          <Link to={`/products/${prod.permalink}`} rel="noopener noreferrer" className="flex-shrink-0 z-0"> {/* Add z-index */}
                            <div className="relative flex h-[180px] w-full items-center justify-center overflow-hidden bg-white sm:h-[220px]">
                              <img
                                src={
                                  hoveredProductId === prod.id && secondImage
                                    ? secondImage
                                    : prod.first_image?.original_url || prod.images?.[0]?.original_url
                                }
                                alt={prod.title}
                                className="h-auto w-[70%] object-contain transition-all duration-300 sm:w-[65%]"
                              />
                            </div>
                          </Link>
                          <div className="flex flex-grow flex-col justify-between p-2 z-0"> {/* Add z-index */}
                            <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:gap-3">
                              <div className="flex items-center gap-1 text-sm font-semibold text-gray-900 sm:text-[18px]">
                                {newPrice.toFixed(2)} <span>AZN</span>
                              </div>
                              {hasDiscount && (
                                <div className="text-xs font-normal text-gray-500 line-through sm:text-[16px]">
                                  {oldPrice.toFixed(2)} AZN
                                </div>
                              )}
                            </div>
                            <h3 className="line-clamp-2 text-xs font-normal leading-snug text-black hover:text-[#f50809] sm:text-[16px]">
                              {prod.title || 'Məhsul adı'}
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
                                  <span>{prod.reviews_count_cached || 0}</span>
                                </div>
                              </div>
                              {currentQuantity > 0 ? (
                                <div className="flex h-auto w-full max-w-[140px] items-center justify-between gap-1 rounded-md z-50">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleQuantityChange(prod, -1);
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
                                      handleQuantityChange(prod, 1);
                                    }}
                                    className="rounded-r-md bg-[#f50809] px-1 py-1 text-white sm:px-1.5 sm:py-2"
                                  >
                                    <FaPlus className="text-[16px] text-white sm:text-[20px]" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  className={`flex h-auto w-full max-w-[140px] cursor-pointer items-center justify-center gap-1 z-100 rounded-md px-1 py-1 text-white transition-colors duration-300 sm:gap-2 sm:px-1.5 sm:py-2 ${
                                    isOutOfStock ? 'bg-[#1a6bff] cursor-not-allowed' : 'bg-[#f50809]'
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isOutOfStock) {
                                      addToCart(prod);
                                    } else {
                                      openPreorderModal(prod);
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
                                  handleLikeToggle(prod);
                                }}
                              />
                            ) : (
                              <FaRegHeart
                                className="cursor-pointer text-[16px] text-gray-500 transition-colors duration-200 hover:text-[#f50809] sm:text-[20px]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLikeToggle(prod);
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
              {/* Sol naviqasiya düyməsi - mobil üçün gizli */}
              <button
                onClick={() => productSwiperRef.current?.slidePrev()}
                className={`swiper-button-prev-custom absolute top-1/2 -left-2 sm:-left-3 md:-left-4 lg:-left-5 -translate-y-1/2 z-20 p-1.5 sm:p-2 bg-white rounded-full cursor-pointer transition-all duration-300 shadow-[0_0_5px_0_rgba(0,0,0,0.25)] sm:shadow-[0_0_10px_0_rgba(0,0,0,0.25)] ${
                  isBeginning ? 'opacity-0 -translate-x-3 sm:-translate-x-5' : 'opacity-100 translate-x-0'
                } hidden sm:flex`}
              >
                <GoArrowLeft className="text-base sm:text-lg md:text-xl lg:text-2xl text-black" />
              </button>
              {/* Sağ naviqasiya düyməsi - mobil üçün gizli */}
              <button
                onClick={() => productSwiperRef.current?.slideNext()}
                className={`swiper-button-next-custom absolute top-1/2 -right-2 sm:-right-3 md:-right-4 lg:-right-5 -translate-y-1/2 z-20 p-1.5 sm:p-2 bg-white rounded-full cursor-pointer transition-all duration-300 shadow-[0_0_5px_0_rgba(0,0,0,0.25)] sm:shadow-[0_0_10px_0_rgba(0,0,0,0.25)] ${
                  isEnd ? 'opacity-0 translate-x-3 sm:translate-x-5' : 'opacity-100 translate-x-0'
                } hidden sm:flex`}
              >
                <GoArrowRight className="text-base sm:text-lg md:text-xl lg:text-2xl text-black" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Baxdığınız Məhsullar */}
      {viewedProducts.length > 1 && (
        <div className="w-full mt-5">
          <div className="flex flex-col max-w-[1428px] mx-auto px-4 lg:px-16">
            <div className="flex flex-row items-center gap-6">
              <h2 className="text-[24px] sm:text-[28px] md:text-[32px] text-[#000000] font-normal">Baxdığınız</h2>
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
            <div className="relative flex flex-col justify-start items-start group w-full max-w-[1428px] mx-auto p-2 sm:px-4 lg:px-[4px] h-auto rounded-md">
              <div className="relative group w-full max-w-[1428px] mx-auto">
                <Swiper
                  onSwiper={(swiper) => {
                    viewedSwiperRef.current = swiper;
                    setIsViewedBeginning(swiper.isBeginning);
                  }}
                  onSlideChange={handleViewedSlideChange}
                  modules={[Navigation]}
                  spaceBetween={10}
                  slidesPerView={2}
                  loop={false}
                  navigation={{
                    nextEl: '.viewed-swiper-button-next-custom',
                    prevEl: '.viewed-swiper-button-prev-custom',
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
                  {/* Cari məhsulu çıxar, yalnız digərlərini göstər */}
                  {viewedProducts.filter(p => p.id !== product?.id).map((prod) => {
                    const variant = prod.variants?.[0] || {};
                    const oldPriceNum = parseFloat(variant.old_price || 0);
                    const newPriceNum = parseFloat(variant.price || 0);
                    const prodHasDiscount = oldPriceNum > newPriceNum && oldPriceNum > 0;
                    const prodDiscountPercent = prodHasDiscount
                      ? Math.round(((oldPriceNum - newPriceNum) / oldPriceNum) * 100)
                      : 0;
                    const hasExpress = prod.characteristics?.some(
                      (char) => char.permalink === 'ekspress'
                    );
                    const secondImage = prod.images?.find((img) => img.position === 2)?.original_url;
                    const likedLocal = likedProductIds[prod.id];
                    const currentQuantity = cartQuantities[prod.id] || 0;
                    const prodVariant = prod.variants?.[0] || {};
                    const isProdOutOfStock = prodVariant.quantity === 0 || !prod.available;
                    return (
                      <SwiperSlide key={`viewed-${prod.id}`}>
                        <article
                          className="flex flex-col w-full h-full rounded overflow-hidden bg-[#ffffff] relative cursor-pointer"
                          onMouseEnter={() => setHoveredProductId(prod.id)}
                          onMouseLeave={() => setHoveredProductId(null)}
                        >
                          <Link to={`/products/${prod.permalink}`} rel="noopener noreferrer">
                            <div className="w-full h-[140px] sm:h-[180px] md:h-[220px] lg:h-[260px] flex items-center justify-center bg-[#ffffff] overflow-hidden relative">
                              <img
                                src={
                                  hoveredProductId === prod.id && secondImage
                                    ? secondImage
                                    : prod.first_image?.original_url
                                }
                                alt={prod.title}
                                className="w-full h-full object-contain transition-all duration-300"
                              />
                            </div>
                          </Link>
                          <div className="flex flex-col flex-1 p-2">
                            <div className="text-[14px] md:text-[16px] font-semibold text-[#000000]">
                              {parseFloat(variant.price || 0).toFixed(2)} AZN
                            </div>
                            <h3 className="text-[12px] md:text-[14px] text-[#000000] hover:text-[#f50809] leading-snug line-clamp-2">
                              {prod.title || 'Məhsul adı'}
                            </h3>
                          </div>
                        </article>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
                {/* Sol naviqasiya düyməsi - mobil üçün gizli */}
                <button
                  onClick={() => viewedSwiperRef.current?.slidePrev()}
                  className={`viewed-swiper-button-prev-custom absolute top-1/2 -left-2 sm:-left-3 md:-left-4 lg:-left-5 -translate-y-1/2 z-20 p-1.5 sm:p-2 bg-white rounded-full cursor-pointer transition-all duration-300 shadow-[0_0_5px_0_rgba(0,0,0,0.25)] sm:shadow-[0_0_10px_0_rgba(0,0,0,0.25)] ${
                    isViewedBeginning ? 'opacity-0 -translate-x-3 sm:-translate-x-5' : 'opacity-100 translate-x-0'
                  } hidden sm:flex`}
                >
                  <GoArrowLeft className="text-base sm:text-lg md:text-xl lg:text-2xl text-black" />
                </button>
                {/* Sağ naviqasiya düyməsi - mobil üçün gizli */}
                <button
                  onClick={() => viewedSwiperRef.current?.slideNext()}
                  className={`viewed-swiper-button-next-custom absolute top-1/2 -right-2 sm:-right-3 md:-right-4 lg:-right-5 -translate-y-1/2 z-20 p-1.5 sm:p-2 bg-white rounded-full cursor-pointer transition-all duration-300 shadow-[0_0_5px_0_rgba(0,0,0,0.25)] sm:shadow-[0_0_10px_0_rgba(0,0,0,0.25)] ${
                    isViewedEnd ? 'opacity-0 translate-x-3 sm:translate-x-5' : 'opacity-100 translate-x-0'
                  } hidden sm:flex`}
                >
                  <GoArrowRight className="text-base sm:text-lg md:text-xl lg:text-2xl text-black" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  {parseFloat(selectedProduct.variants?.[0]?.price || 0).toFixed(2)} AZN
                </div>
                {selectedProduct.variants?.[0]?.old_price &&
                  selectedProduct.variants[0].old_price !== selectedProduct.variants[0].price && (
                    <div className="text-[26px] line-through text-gray-500">
                      {parseFloat(selectedProduct.variants[0].old_price).toFixed(2)} AZN
                    </div>
                  )}
              </div>
              {selectedProduct.variants?.[0]?.old_price &&
                selectedProduct.variants[0].old_price > selectedProduct.variants[0].price && (
                  <div className="text-[#f50809] text-[14px] font-semibold mt-2">
                    Qənaət: {(parseFloat(selectedProduct.variants[0].old_price) - parseFloat(selectedProduct.variants[0].price)).toFixed(2)} AZN
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
                        if (selectedProduct.variants?.[0]?.quantity > 0 && selectedProduct.available) {
                          addToCart(selectedProduct);
                        } else if (selectedProduct.variants?.[0]?.quantity === 0 || !selectedProduct.available) {
                          // Ön sifariş modalını aç
                          openPreorderModal(selectedProduct);
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
              onClick={closeLimitModal}
            >
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
                  disabled={!recaptchaValue}
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

export default Product;