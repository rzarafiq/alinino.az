import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { GoArrowLeft, GoArrowRight, GoShareAndroid } from 'react-icons/go';
import { FaRegHeart, FaHeart, FaMinus, FaPlus, FaRegStar, FaRegCommentDots, FaRegQuestionCircle, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { BsCart3, BsPencil } from 'react-icons/bs';
import { MdOutlineDescription } from 'react-icons/md';
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import instance from '../../services/instance';

function Product() {
  const { permalink } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  // getByPermalink funksiyasını useMemo ilə yadda saxlayaq
  const getByPermalink = useCallback((searchPermalink) => {
    if (!product?.properties || !product?.characteristics) return null;
    
    // Check for permalink or title in properties
    const prop = product.properties.find(
      (p) => p.permalink === searchPermalink || (p.title && p.title.toLowerCase() === searchPermalink.toLowerCase())
    );

    if (!prop) {
      // If not found, check characteristics directly for a case-insensitive title match
      const char = product.characteristics.find(
        (c) => c.title && c.title.toLowerCase() === searchPermalink.toLowerCase()
      );
      return char?.title ?? null;
    }
    
    // Find characteristic by property_id
    const ch = product.characteristics.find((c) => c.property_id === prop.id);
    return ch?.title ?? null;
  }, [product]);

  // Məhsulu yüklə
  const getAllProducts = async () => {
    try {
      const res = await instance.get('/products');
      return res.data;
    } catch (err) {
      console.error('Məhsullar gətirilə bilmədi:', err);
      throw new Error('Məhsullar gətirilə bilmədi');
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!permalink) return;

      try {
        setLoading(true);
        const allProductsRaw = await getAllProducts();
        const allItems = Array.isArray(allProductsRaw)
          ? allProductsRaw
          : Object.values(allProductsRaw).flat();

        const found = allItems.find((p) => p.permalink === permalink);

        if (found) {
          setProduct(found);
          const cart = JSON.parse(localStorage.getItem('cartProducts')) || [];
          const cartItem = cart.find((it) => it.id === found.id);
          setCartQuantity(cartItem?.quantity || 0);

          const liked = JSON.parse(localStorage.getItem('likedProducts')) || [];
          setIsLiked(liked.some((p) => p.id === found.id));
        } else {
          setError('Məhsul tapılmadı');
        }
      } catch (err) {
        setError('Məhsul yüklənərkən xəta baş verdi');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [permalink]);

  // Səbətə əlavə/sil
  const updateCart = (delta) => {
    if (!product) return;

    const newQuantity = Math.max(0, cartQuantity + delta);
    if (newQuantity === 0 && cartQuantity === 0) return;

    const cart = JSON.parse(localStorage.getItem('cartProducts')) || [];
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

  // Sevimlilərə əlavə/sil
  const toggleLike = () => {
    if (!product) return;

    const liked = JSON.parse(localStorage.getItem('likedProducts')) || [];
    const isAlready = liked.some((p) => p.id === product.id);

    const updated = isAlready
      ? liked.filter((p) => p.id !== product.id)
      : [
          ...liked,
          {
            id: product.id,
            title: product.title,
            permalink: product.permalink,
            image: product.first_image?.url,
            price: product.variants?.[0]?.price,
          },
        ];

    localStorage.setItem('likedProducts', JSON.stringify(updated));
    window.dispatchEvent(new Event('likedProductsUpdated'));
    setIsLiked(!isAlready);
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
  const onlineSpecialPrice = getByPermalink('onlayna-ozel-qiymet');
  
  const baseClass = 'flex items-center justify-center gap-1.5 px-4 py-2 rounded-md cursor-pointer transition-colors';
  const activeClass = 'bg-[#005bff] text-[#ffffff]';
  const inactiveClass = 'bg-[#f7f8fa] text-[#000000] hover:bg-[#005bff] hover:text-[#ffffff]';
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-red-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="py-20 text-center text-red-500">
        <p>{error || 'Məhsul tapılmadı.'}</p>
        <Link to="/catalog" className="text-blue-600 hover:underline mt-2 block">
          Kataloqa qayıt
        </Link>
      </div>
    );
  }

const productSwiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [likedProductIds, setLikedProductIds] = useState({});
  const [cartQuantities, setCartQuantities] = useState({});

  // Slayderin dəyişməsi zamanı arrowların aktivliyini yenilə
  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  // Məhsulu sürətli görünüşdə göstərmək üçün modal açma (nümunə alert)
  const openModal = (product) => {
    alert(`Sürətli görünüş: ${product.title}`);
  };

  // Sevimli toggl etmək
  const handleLikeToggle = (product) => {
    setLikedProductIds((prev) => {
      const newLikes = { ...prev };
      if (newLikes[product.id]) {
        delete newLikes[product.id];
      } else {
        newLikes[product.id] = true;
      }
      return newLikes;
    });
  };

  // Səbətə əlavə etmək və miqdarı dəyişmək funksiyası
  const handleQuantityChange = (product, delta) => {
    setCartQuantities((prev) => {
      const current = prev[product.id] || 0;
      const newCount = current + delta;
      if (newCount < 0) return prev;
      return { ...prev, [product.id]: newCount };
    });
  };

  // Birbaşa səbətə əlavə et
  const addToCart = (product) => {
    setCartQuantities((prev) => {
      if (prev[product.id]) return prev;
      return { ...prev, [product.id]: 1 };
    });
  };
  



  return (
    <>
      {/* Xəritə */}
      <div className="w-full p-1 bg-gray-100 mt-12 lg:mt-0">
        <ol className="flex flex-wrap h-auto max-w-[1428px] mx-auto px-4 lg:px-16 py-2 space-x-2 text-xs text-[#777777] items-center">
          <li className="flex items-center">
            <Link to="/" className="hover:text-[#dc0708]">Əsas</Link>
          </li>
          {product.category_hierarchy?.map((cat, i) => (
            <li key={i} className="flex items-center">
              <span className="mx-1">/</span>
              <span className="capitalize">{cat}</span>
            </li>
          ))}
          <li className="flex items-center">
            <span className="mx-1">/</span>
            <span className="font-medium text-gray-900 truncate max-w-[200px] sm:max-w-none">{product.title}</span>
          </li>
        </ol>
      </div>
      {/* Məhsul məlumatları */}
      <div className="max-w-[1428px] mx-auto px-4 lg:px-18 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Şəkillər (sol) */}
        <div className="flex flex-col-reverse lg:flex-row gap-4">
          <div className="w-full lg:w-24 relative">
            <div className="hidden lg:block relative h-[550px]">
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
                    className="cursor-pointer overflow-hidden mx-auto rounded-md border-2 border-transparent swiper-slide-thumb-active:border-[#005bff] transition-all duration-200"
                  >
                    <img
                      src={img.url || img.medium_url}
                      alt={`${product.title} thumbnail`}
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <button className="thumb-swiper-button-prev absolute -top-8 left-1/2 -translate-x-1/2 z-10 px-5 py-1 bg-white border border-[#eeeeee] rounded-sm text-[#999999] hover:text-[#005bff] transition-colors">
                <FaChevronUp className="text-lg" />
              </button>
              <button className="thumb-swiper-button-next absolute -bottom-8 left-1/2 -translate-x-1/2 z-10 px-5 py-1 bg-white border border-[#eeeeee] rounded-sm text-[#999999] hover:text-[#005bff] transition-colors">
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
              className="h-[300px] sm:h-[400px] lg:h-[550px] w-[400px]"
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
              <GoArrowLeft className="text-xl lg:text-3xl text-gray-700" />
            </button>
            <button className="swiper-button-next-custom absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full shadow-md transition-all duration-300 transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 hidden lg:block">
              <GoArrowRight className="text-xl lg:text-3xl text-gray-700" />
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
          `}</style>
        </div>
        

        {/* Məlumatlar (sağ) */}
        <div className="flex flex-col justify-start">
          <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
            {hasDiscount && (
              <span className="bg-[#f50809] text-white font-semibold px-2 py-0.5 rounded-sm text-xs">
                -{discountPercent}%
              </span>
            )}
            {getByPermalink('ekspress') && (
              <span className="bg-[#dcfe5c] text-black px-2 py-0.5 rounded-sm text-xs font-medium">
                Ekspress
              </span>
            )}
            {getByPermalink('tezlikle') && (
              <span className="bg-[#005bff] text-white font-semibold px-2 py-0.5 rounded-sm text-xs">
                Tezliklə!
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-semibold text-black mt-2">{product.title}</h1>

          {/* Nəşriyyat */}
          {publisher && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 mt-2">
              <span className="text-[16px] text-[#000000] font-medium">Nəşriyyat:</span>
              <span className="text-[16px] text-[#f50809] hover:text-[#000000] underline">{publisher}</span>
            </div>
          )}

          {/* Müəllif */}
          {author && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 mt-1">
              <span className="text-[16px] text-[#000000] font-medium">Müəllif:</span>
              <span className="text-[16px] text-[#f50809] hover:text-[#000000] underline">{author}</span>
            </div>
          )}

          <div className="flex flex-row items-center justify-start gap-3 text-[14px] text-gray-400 mt-2">
            {/* Artikul */}
            {product.variants?.[0]?.sku && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">Artikul:</span>
                <span>{product.variants[0].sku}</span>
              </div>
            )}

            {/* Ölçü vahidi */}
            {product.unit && (
              <div className="flex items-center gap-2">
                <span className="font-semibold">Ölçü vahidi:</span>
                <span>{product.unit === 'pce' ? 'ədəd' : product.unit}</span>
              </div>
            )}
          </div>

          {/* Qiymət */}
          <div className="flex flex-row items-baseline gap-3 mt-4">
            <p className="text-2xl sm:text-[26px] font-semibold text-gray-900">{price} AZN</p>
            {hasDiscount && (
              <p className="text-2xl sm:text-[26px] font-medium line-through text-[#999999]">{oldPrice} AZN</p>
            )}
          </div>

          {hasDiscount && (
            <p className="text-[#f50809] text-sm font-semibold mt-1">
              Qənaət: {(oldPrice - price).toFixed(2)} AZN
            </p>
          )}

          {/* Reytinq */}
          <div className="flex items-center gap-4 mt-3">
            <div className="flex space-x-1 text-lg text-gray-300">
              {[...Array(5)].map((_, index) => (
                <FaRegStar key={index} />
              ))}
            </div>
            <a href="#reviews" className="flex items-center gap-1.5 text-gray-500 hover:text-black">
              <FaRegCommentDots className="text-base" />
              <span className="text-sm border-b border-dashed border-gray-400 hover:border-black">
                {product.reviews_count_cached || 0} Rəy yaz
              </span>
            </a>
          </div>

          {/* Onlayna özəl qiymət */}
          {onlineSpecialPrice && (
            <div className="flex flex-row items-center justify-center w-[150px] h-[30px] bg-[#46a53b] text-[12px] text-[#ffffff] font-light p-2 mt-5 rounded-md">
              <span>Onlayna özəl qiymət</span>
            </div>
          )}

          {/* Mövcudluq */}
          <div className="flex items-center gap-2 mt-8">
            <span
              className={`w-2.5 h-2.5 rounded-full ${!isOutOfStock ? 'bg-[#46a53b]' : 'bg-[#f50809]'}`}
            ></span>
            <span className="text-sm font-bold text-black">
              {!isOutOfStock ? 'Mövcuddur' : 'Mövcud deyil'}
            </span>
          </div>

          {/* Səbət */}
          <div className="flex flex-row items-center justify-start gap-4 mt-5">
            {cartQuantity > 0 ? (
              <div className="flex items-center justify-between w-full lg:w-[550px] h-[55px] p-2 gap-2 rounded-md">
                <button
                  onClick={() => updateCart(-1)}
                  className="text-[#ffffff] w-[55px] h-[55px] bg-[#f50809] p-4 rounded-l-md"
                >
                  <FaMinus className="text-[24px] text-[#ffffff]" />
                </button>
                <Link to="/cart">
                  <div className="flex flex-col items-center w-full h-[55px] text-[14px] text-[#000000] hover:text-[#f50809] font-medium p-2">
                    <div className="flex flex-row items-center gap-1">
                      <span>Səbətə at</span>
                      <span>{cartQuantity}</span>
                      <span>ədəd</span>
                    </div>
                    <span>Keçid et</span>
                  </div>
                </Link>
                <button
                  onClick={() => updateCart(1)}
                  className="text-[#ffffff] bg-[#f50809] w-[55px] h-[55px] p-4 rounded-r-md"
                >
                  <FaPlus className="text-[24px] text-[#ffffff]" />
                </button>
              </div>
            ) : (
              <button
                disabled={isOutOfStock}
                onClick={() => !isOutOfStock && updateCart(1)}
                className={`flex items-center justify-center w-full lg:w-[550px] h-[55px] p-2 gap-2 rounded-md cursor-pointer ${
                  isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#f50809]'
                }`}
              >
                <BsCart3 className="text-[30px] text-[#ffffff] font-extrabold" />
                <span className="text-[20px] text-[#ffffff] font-medium">
                  {isOutOfStock ? 'Mövcud deyil' : 'Səbətə at'}
                </span>
              </button>
            )}

            <div className="flex items-center justify-center">
              {isLiked ? (
                <FaHeart
                  className="text-[24px] text-[#f50809] cursor-pointer"
                  onClick={toggleLike}
                />
              ) : (
                <FaRegHeart
                  className="text-[24px] text-[#777777] hover:text-[#f50809] cursor-pointer"
                  onClick={toggleLike}
                />
              )}
            </div>
          </div>

          {/* Sual ver və Paylaşın */}
          <div className="flex items-center gap-4 mt-6">
            <button className="flex items-center gap-2 text-[#000000] hover:text-[#f50809] transition-colors cursor-pointer">
              <FaRegQuestionCircle className="text-[20px]" />
              <span className="text-[16px] font-medium border-b border-dashed">Sual ver</span>
            </button>
            <button className="flex items-center gap-2 text-[#000000] hover:text-[#f50809] transition-colors cursor-pointer">
              <GoShareAndroid className="text-[20px]" />
              <span className="text-[16px] font-medium border-b border-dashed">Paylaşın</span>
            </button>
          </div>

          {/* Daxil olduğu kateqoriyalar */}
          <div className="flex flex-wrap gap-2 mt-5">
            {product.category_hierarchy?.map((cat, i) => (
              <span
                key={i}
                className="text-[14px] text-[#999999] border hover:text-[#f50809] border-[#eeeeee] hover:border-[#f50809] px-3 py-1 rounded-sm transition-colors cursor-pointer"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className='w-full mt-5'>
        <div className="flex flex-row flex-wrap items-center justify-center gap-5 max-w-[1428px] mx-auto px-4 lg:px-16">
          <button
            onClick={() => setActiveTab('description')}
            className={`${baseClass} ${activeTab === 'description' ? activeClass : inactiveClass}`}
          >
            <MdOutlineDescription className="text-[24px]" />
            <span className="text-[16px]">Təsvir</span>
          </button>
          <button
            onClick={() => setActiveTab('specifications')}
            className={`${baseClass} ${activeTab === 'specifications' ? activeClass : inactiveClass}`}
          >
            <HiOutlineAdjustmentsHorizontal className="text-[24px]" />
            <span className="text-[16px]">Xüsusiyyətlər</span>
          </button>
        </div>
        <div className="py-5 px-4 lg:px-16 max-w-[1428px] mx-auto">
          {activeTab === 'description' && (
            <div className="text-[#333333] leading-relaxed">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[200px] gap-y-2">
                      {fields.map((f) => f.value && (
                        <div key={f.key} className="flex justify-between py-1">
                          <span className="text-[#000000]">{f.label}</span>
                          <span className="flex-1 border-b border-dotted border-[#dddddd] mx-2"></span>
                          <span className="text-[#999999]">{f.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#999999] italic">Xüsusiyyətlər mövcud deyil.</p>
                  );
                })()
              ) : (
                <p className="text-[#999999] italic">Xüsusiyyətlər mövcud deyil.</p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="w-full mt-5">
        <div className="flex flex-col max-w-[1428px] mx-auto px-4 lg:px-16">
          <h2 className="text-[32px] font-normal">Məhsul haqqında rəylər</h2>
          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-5 mt-5">
            <div className="flex items-center justify-start gap-3 bg-[#f7f8fa] text-[#999999] flex-1 min-w-[200px] h-[50px] py-2.5 px-5 rounded-md">
              <BsPencil className="text-3xl font-bold" />
              <span className="text-base sm:text-[16px]">
                Burada hələ heç kim rəy yazmayıb. Birinci olun!
              </span>
            </div>
            <button className="bg-[#7d6fa0] hover:bg-[#9187a8] text-lg sm:text-[20px] text-white font-medium w-full sm:w-[330px] h-[50px] p-2.5 rounded-md">
              Rəy yazın
            </button>
          </div>
        </div>
      </div>
      <div className="w-full mt-5">
        <div className="flex flex-col max-w-[1428px] mx-auto px-4 lg:px-16">
          <h2 className="text-[32px] font-normal">Bənzər məhsullar</h2>
          <div className="relative flex flex-col justify-start items-start group w-full max-w-[1428px] mx-auto px-10 lg:px-[64px] h-auto rounded-md">
            <div className="relative group mt-5 w-full max-w-[1400px] mx-auto">
              {products.length > 0 ? (
                <Swiper
                  onSwiper={(swiper) => {
                    productSwiperRef.current = swiper;
                    setIsBeginning(swiper.isBeginning);
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
                    const hasExpress = product.characteristics?.some(
                      (char) => char.permalink === 'ekspress'
                    );
                    const secondImage = product.images?.find((img) => img.position === 2)?.original_url;
                    const isLiked = likedProductIds[product.id];
                    const currentQuantity = cartQuantities[product.id] || 0;
                    const isOutOfStock = variant.quantity === 0 || !product.available;
    
                    return (
                      <SwiperSlide key={product.id || `product-${Math.random()}`}>
                        <article
                          className="flex flex-col w-full h-full rounded overflow-hidden bg-[#ffffff] relative cursor-pointer"
                          onMouseEnter={() => setHoveredProductId(product.id)}
                          onMouseLeave={() => setHoveredProductId(null)}
                        >
                          <div
                            className={`absolute bottom-40 left-0 right-0 flex items-center justify-center transition-opacity duration-300 z-10 ${
                              hoveredProductId === product.id ? 'opacity-100' : 'opacity-0'
                            }`}
                          >
                            <button
                              className="w-full h-auto bg-[#eeeeeee6] text-[#000000] font-medium py-1.5 px-6 rounded-md cursor-pointer"
                              onClick={() => openModal(product)}
                            >
                              Sürətli görünüş
                            </button>
                          </div>
    
                          <Link to={`/products/${product.permalink}`} rel="noopener noreferrer">
                            <div className="w-full h-[220px] flex items-center justify-center bg-[#ffffff] overflow-hidden relative">
                              <img
                                src={
                                  hoveredProductId === product.id && secondImage
                                    ? secondImage
                                    : product.first_image?.original_url
                                }
                                alt={product.title}
                                className="w-[65%] h-fit object-contain transition-all duration-300"
                              />
                            </div>
                          </Link>
    
                          <div className="flex flex-col flex-1 p-2">
                            <div className="flex flex-row items-center justify-start gap-3">
                              <div className="text-[18px] font-semibold text-gray-900">
                                {variant.price} AZN
                              </div>
                              {variant.old_price && variant.old_price !== variant.price && (
                                <div className="text-[16px] line-through text-gray-500">
                                  {variant.old_price} AZN
                                </div>
                              )}
                            </div>
    
                            <h3 className="text-[14px] text-[#000000] hover:text-[#f50809] font-semibold leading-snug">
                              {product.title || 'Məhsul adı'}
                            </h3>
    
                            <div className="flex flex-col items-start justify-start gap-3 mt-6">
                              <div className="flex items-center gap-2">
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
                                  className={`flex flex-row items-center justify-center w-[140px] h-auto p-1.5 gap-2 rounded-md cursor-pointer ${
                                    isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#f50809]'
                                  }`}
                                  onClick={() => !isOutOfStock && addToCart(product)}
                                >
                                  <BsCart3 className="text-[20px] text-[#ffffff] font-black" />
                                  <span className="text-[16px] text-[#ffffff] font-medium">
                                    {isOutOfStock ? 'Stokda yoxdur' : 'Səbətə at'}
                                  </span>
                                </div>
                              )}
                            </div>
    
                            <div className="absolute top-0 left-0 flex flex-col items-start gap-1 mt-1">
                              {hasDiscount && (
                                <span className="bg-[#f50809] text-[#ffffff] font-semibold px-2 py-0.5 rounded-sm text-[12px]">
                                  -{discountPercent}%
                                </span>
                              )}
                              {hasExpress && (
                                <span className="bg-[#dcfe5c] text-[#000000] px-2 py-0.5 rounded-sm text-[12px] font-medium">
                                  Ekspress
                                </span>
                              )}
                              {product?.characteristics?.some((c) => c.title === 'TEZLİKLƏ!') && (
                                <span className="bg-[#005bff] text-[#ffffff] font-semibold px-2 py-0.5 rounded-sm text-[12px]">
                                  Tezliklə!
                                </span>
                              )}
                            </div>
    
                            <div className="absolute top-0 right-0 flex flex-col items-start gap-1 mt-1">
                              {isLiked ? (
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
                          </div>
                        </article>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              ) : (
                <p>Məhsul tapılmadı.</p>
              )}
    
              <button
                onClick={() => productSwiperRef.current?.slidePrev()}
                className={`swiper-button-prev-custom absolute top-1/2 -left-5 -translate-y-1/2 z-20 p-2 bg-white rounded-full cursor-pointer transition-all duration-300 ${
                  isBeginning ? 'opacity-0 -translate-x-5' : 'opacity-100 translate-x-0'
                } shadow-[0_0_10px_0_rgba(0,0,0,0.25)]`}
              >
                <GoArrowLeft className="text-2xl text-black" />
              </button>
              <button
                onClick={() => productSwiperRef.current?.slideNext()}
                className={`swiper-button-next-custom absolute top-1/2 -right-5 -translate-y-1/2 z-20 p-2 bg-white rounded-full cursor-pointer transition-all duration-300 ${
                  isEnd ? 'opacity-0 translate-x-5' : 'opacity-100 translate-x-0'
                } shadow-[0_0_10px_0_rgba(0,0,0,0.25)]`}
              >
                <GoArrowRight className="text-2xl text-black" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Product;