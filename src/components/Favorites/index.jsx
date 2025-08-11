import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaRegStar, FaRegCommentDots, FaMinus, FaPlus, FaHeart, FaRegHeart, } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";
import { RiCloseFill, RiInformation2Line } from "react-icons/ri";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function Favorites() {
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [likedProducts, setLikedProducts] = useState([]);
  const [cartQuantities, setCartQuantities] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFirstSlide, setIsFirstSlide] = useState(true);
  const [isLastSlide, setIsLastSlide] = useState(false);
  const modalRef = useRef(null);
  const swiperRef = useRef(null);

  // localStorage-dən səbət miqdarlarını yüklə
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cartProducts')) || [];
    const quantities = {};
    cart.forEach((item) => {
      quantities[item.id] = item.quantity;
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
    const newQuantity = updateCartAndNotify(selectedProduct, change);
    setCartQuantities((prev) => ({
      ...prev,
      [selectedProduct.id]: newQuantity === 0 ? 0 : newQuantity,
    }));
  };

  // localStorage-dan sevimliləri yüklə
  const loadLikedProducts = () => {
    const saved = JSON.parse(localStorage.getItem("likedProducts")) || [];
    setLikedProducts(saved);
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

  // Modal açılıb-bağlıb yoxlamaq üçün
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

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isDesktop = windowWidth >= 1024;

  return (
    <>
      {/* Breadcrumb */}
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
      <div className="flex flex-col gap-4 max-w-[1428px] mx-auto h-full px-10 lg:px-[64px] overflow-y-auto">
        {likedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FaRegHeart className="text-[120px] text-[#f5f5f5]" />
            <p className="text-[14px] text-[#9d9d9d] text-center mt-4">
              Sevimliləriniz hazırda boşdur
            </p>
            <div className="flex flex-row items-center gap-5 mt-10">
              <Link
                to="/"
                className="text-[16px] text-[#1a6bff] border-2 border-[#1a6bff] px-6 py-2 rounded-md"
              >
                Əsas səhifə
              </Link>
              <Link
                to="/catalog"
                className="text-[16px] text-white bg-[#1a6bff] px-10 py-2.5 rounded-md"
              >
                Kataloq
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-2 bg-[#f7f8fa] p-3 rounded-md mt-4">
              <RiInformation2Line className="text-2xl text-gray-500" />
              <p className="text-sm text-gray-600">
                Diqqət edin! Sevimlilərinizə 20-dən çox məhsul əlavə edə bilməzsiniz. Seçimi saxlamaq üçün şəxsi hesabınıza{" "}
                <span className="cursor-pointer underline">daxil olun</span>.
              </p>
            </div>

            <div className="max-w-[1428px] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 my-6">
              {likedProducts.map((product) => {
                const variant = product.variants?.[0] || {};
                const price = parseFloat(variant.price) || 0;
                const oldPrice = parseFloat(variant.old_price) || 0;
                const secondImage = product.images?.find((img) => img.position === 2)?.original_url;
                const currentQuantity = cartQuantities[product.id] || 0;
                const isOutOfStock = variant.quantity === 0 || !product.available;
                const hasDiscount = oldPrice > price;
                const discountPercent = hasDiscount ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
                const hasExpress = product.characteristics?.some((c) => c.permalink === "ekspress");

                return (
                  <article
                    key={product.id}
                    className={`flex flex-col justify-between w-full h-full px-2 py-4 rounded-md overflow-hidden bg-[#ffffff] relative transition-all duration-300 ${
                      hoveredProductId === product.id ? "shadow-[0_4px_20px_rgba(0,0,0,0.25)] z-20" : "z-0"
                    }`}
                    onMouseEnter={() => setHoveredProductId(product.id)}
                    onMouseLeave={() => setHoveredProductId(null)}
                  >
                    {/* Etiketlər (sabit top offset) */}
                    <div className="absolute top-3 left-3 flex flex-col items-start gap-1 p-2 z-30">
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
                      {product?.characteristics?.some((c) => c.title === "TEZLİKLƏ!") && (
                        <span className="bg-[#005bff] text-[#ffffff] font-semibold px-2 py-0.5 rounded-sm text-[12px]">
                          Tezliklə!
                        </span>
                      )}
                    </div>

                    {/* Sevimlilər ikonu (sabit top offset) */}
                    <div className="absolute top-3 right-3 p-2 z-30">
                      {likedProducts.some((p) => p.id === product.id) ? (
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

                    {/* Şəkil konteyneri */}
                    <Link to={`/products/${product.permalink}`} className="block">
                      <div className="w-full h-[220px] flex items-center justify-center bg-[#ffffff] overflow-hidden relative group">
                        {/* Birinci şəkil (əsas) */}
                        <img
                          src={product.first_image?.original_url || "/no-image.png"}
                          alt={product.title}
                          className="w-[65%] h-fit object-contain transition-opacity duration-300"
                        />

                        {/* İkinci şəkil — overlay; yalnız lg ekranlarda hover zamanı görünəcək */}
                        {secondImage && (
                          <img
                            src={secondImage}
                            alt={`${product.title} - second`}
                            className="w-[65%] h-fit object-contain transition-opacity duration-300 absolute inset-0 m-auto opacity-0 pointer-events-none lg:group-hover:opacity-100 lg:pointer-events-auto"
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

                    {/* Məzmun: qiymət, başlıq və footer (səbət hissəsi) */}
                    <div className="flex flex-col flex-1 p-2 justify-between">
                      <div>
                        {/* Qiymət */}
                        <div className="flex flex-row items-center justify-start gap-3">
                          <div className="text-[18px] font-semibold text-gray-900">{price.toFixed(2)} AZN</div>
                          {hasDiscount && (
                            <div className="text-[16px] line-through text-gray-500">{oldPrice.toFixed(2)} AZN</div>
                          )}
                        </div>

                        {/* Başlıq */}
                        <h3 className="text-[14px] text-[#000000] hover:text-[#f50809] font-semibold leading-snug">
                          {product.title || "Məhsul adı"}
                        </h3>

                        {/* Reytinq və rəylər */}
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

                      {/* Səbət əməliyyatları — footer kimi sabit altında qalacaq */}
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
                            } ${isOutOfStock ? "bg-gray-400 cursor-not-allowed" : "bg-[#f50809]"}`}
                            onClick={() => !isOutOfStock && handleQuantityChange(product, 1)}
                          >
                            <BsCart3 className="text-[20px] text-[#ffffff] font-black" />
                            <span className="text-[16px] text-[#ffffff] font-medium">
                              {isOutOfStock ? "Stokda yoxdur" : "Səbətə at"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
      
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Sürətli Görünüş Modalı */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-[#0a0a0a98] flex items-center justify-center z-50 cursor-pointer">
          <div ref={modalRef} className="flex flex-col md:flex-row w-[95%] md:w-[982px] h-auto md:h-[530px] rounded-lg overflow-hidden bg-[#ffffff] relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-[#000000] z-50 cursor-pointer">
              <RiCloseFill className="text-[24px]" />
            </button>

            <div className="w-full md:w-1/2 h-fit p-4 md:p-8">
              <div className="relative group w-full h-auto rounded-md">
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={0}
                  slidesPerView={1}
                  loop={false}
                  onSwiper={onSwiperInit}
                  onSlideChange={onSlideChange}
                  pagination={{
                    el: ".custom-swiper-pagination",
                    clickable: true,
                    renderBullet: (index, className) => `<span class="${className} custom-bullet"></span>`,
                  }}
                  className="h-[400px] w-full"
                >
                  {selectedProduct.images?.map((image) => (
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
                    isFirstSlide ? "cursor-not-allowed text-gray-400 opacity-0" : "text-gray-700 hover:text-black"
                  }`}
                  disabled={isFirstSlide}
                >
                  <GoArrowLeft className="text-3xl" />
                </button>
                <button
                  onClick={() => swiperRef.current?.slideNext()}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full shadow-md cursor-pointer transition-all duration-300 transform translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 ${
                    isLastSlide ? "cursor-not-allowed text-gray-400 opacity-0" : "text-gray-700 hover:text-black"
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

            <div className="flex flex-col flex-1 justify-start p-4 md:p-8">
              <div className="flex flex-row items-center gap-2 mt-2 sm:mt-0">
                {selectedProduct.variants?.[0]?.old_price &&
                  selectedProduct.variants[0].old_price > selectedProduct.variants[0].price && (
                    <span className="bg-[#f50809] text-[#ffffff] font-semibold px-2 py-0.5 rounded-sm text-[12px]">
                      -{Math.round(
                        ((selectedProduct.variants[0].old_price - selectedProduct.variants[0].price) /
                          selectedProduct.variants[0].old_price) *
                          100
                      )}
                      %
                    </span>
                  )}
                {selectedProduct.characteristics?.some((c) => c.permalink === "ekspress") && (
                  <span className="bg-[#dcfe5c] text-[#000000] px-2 py-0.5 rounded-sm text-[12px] font-medium">
                    Ekspress
                  </span>
                )}
                {selectedProduct.characteristics?.some((c) => c.title === "TEZLİKLƏ!") && (
                  <span className="bg-[#005bff] text-[#ffffff] font-semibold px-2 py-0.5 rounded-sm text-[12px]">
                    Tezliklə!
                  </span>
                )}
              </div>

              <h2 className="text-[24px] font-semibold text-[#000000] mt-2">{selectedProduct.title || "Məhsul adı"}</h2>

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
                    <span>{selectedProduct.unit === "pce" ? "ədəd" : selectedProduct.unit}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-row items-center gap-3 mt-2">
                <div className="text-[26px] font-semibold text-gray-900">{selectedProduct.variants?.[0]?.price} AZN</div>
                {selectedProduct.variants?.[0]?.old_price &&
                  selectedProduct.variants[0].old_price !== selectedProduct.variants[0].price && (
                    <div className="text-[26px] line-through text-gray-500">{selectedProduct.variants[0].old_price} AZN</div>
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
                      ? "bg-[#0fce2d]"
                      : "bg-[#f50809]"
                  }`}
                ></span>
                <span className="text-[14px] text-[#000000] font-bold">
                  {selectedProduct.variants?.[0]?.quantity > 0 && selectedProduct.available ? "Mövcuddur" : "Mövcud deyil"}
                </span>
              </div>

              <div className="flex flex-col mt-4">
                <div className="flex flex-row items-center justify-start gap-8">
                  {cartQuantities[selectedProduct.id] > 0 ? (
                    <div className="flex items-center justify-between w-full h-auto gap-2 rounded-md">
                      <button
                        onClick={() => handleQuantityChange(selectedProduct, -1)}
                        className="text-[#ffffff] bg-[#f50809] px-2 py-2 rounded-l-md"
                      >
                        <FaMinus className="text-[20px] text-[#ffffff]" />
                      </button>
                      <Link
                        to="/cart"
                        className="flex flex-col items-center text-[14px] text-[#000000] hover:text-[#f50809] font-medium p-2"
                      >
                        <div className="flex flex-row items-center gap-1">
                          <span>Səbətə at</span>
                          <span>{cartQuantities[selectedProduct.id]}</span>
                          <span>ədəd</span>
                        </div>
                        <span>Keçmək</span>
                      </Link>
                      <button
                        onClick={() => handleQuantityChange(selectedProduct, 1)}
                        className="text-[#ffffff] bg-[#f50809] px-2 py-2 rounded-r-md"
                      >
                        <FaPlus className="text-[20px] text-[#ffffff]" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`flex items-center justify-center w-full h-auto p-2 gap-2 rounded-md cursor-pointer ${
                        selectedProduct.variants?.[0]?.quantity === 0 || !selectedProduct.available
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#f50809]"
                      }`}
                      onClick={() =>
                        selectedProduct.variants?.[0]?.quantity > 0 &&
                        selectedProduct.available &&
                        handleQuantityChange(selectedProduct, 1)
                      }
                    >
                      <BsCart3 className="text-[20px] text-[#ffffff] font-black" />
                      <span className="text-[16px] text-[#ffffff] font-medium">
                        {selectedProduct.variants?.[0]?.quantity === 0 || !selectedProduct.available
                          ? "Stokda yoxdur"
                          : "Səbətə at"}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-center">
                    {likedProducts.some((p) => p.id === selectedProduct.id) ? (
                      <FaHeart
                        className="text-[24px] text-[#f50809] cursor-pointer"
                        onClick={() => handleLikeToggle(selectedProduct)}
                      />
                    ) : (
                      <FaRegHeart
                        className="text-[24px] text-[#777777] hover:text-[#f50809] cursor-pointer"
                        onClick={() => handleLikeToggle(selectedProduct)}
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center mt-4">
                  <Link
                    to="/Product"
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
      
    </>
  );
}

export default Favorites;