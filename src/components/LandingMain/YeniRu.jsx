import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';
import { FaRegCommentDots, FaChevronRight, FaRegHeart, FaHeart, FaMinus, FaPlus, } from 'react-icons/fa';
import { RiCloseFill } from 'react-icons/ri';
import { BsCart3 } from 'react-icons/bs';
import { FaRegStar } from 'react-icons/fa';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { getAllProducts } from '../../services/index';

const YeniRu = () => {
  const productSwiperRef = useRef(null);
  const modalRef = useRef(null);
  const swiperRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [hoveredProductId, setHoveredProductId] = useState(null);
  const [likedProductIds, setLikedProductIds] = useState({});
  const [cartQuantities, setCartQuantities] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFirstSlide, setIsFirstSlide] = useState(true);
  const [isLastSlide, setIsLastSlide] = useState(false);

  // localStorage-dən səbət miqdarlarını yüklə
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cartProducts')) || [];
    const quantities = {};
    cart.forEach((item) => {
      quantities[item.id] = item.quantity;
    });
    setCartQuantities(quantities);
  }, []);

  // localStorage-dən bəyənilənləri yüklə
  useEffect(() => {
    const liked = JSON.parse(localStorage.getItem('likedProducts')) || [];
    const likedIds = {};
    liked.forEach((p) => {
      likedIds[p.id] = true;
    });
    setLikedProductIds(likedIds);
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

  // Modalı aç
  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Modalı bağla
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Slider dəyişəndə
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
    setCurrentSlideIndex(swiper.activeIndex);
    setIsFirstSlide(swiper.isBeginning);
    setIsLastSlide(swiper.isEnd);
  };

  // Modalın xaricinə klikləmə
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isModalOpen && modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  // Məhsulları yüklə
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsObject = await getAllProducts();
        const russianBooks = productsObject['Rus Dilində Kitablar'];
        if (Array.isArray(russianBooks)) {
          setProducts(russianBooks);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Məhsullar gətirilərkən xəta baş verdi:', error);
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

  // Bəyənmə funksiyası
  const handleLikeToggle = (product) => {
    const currentLiked = JSON.parse(localStorage.getItem('likedProducts')) || [];
    const updated = likedProductIds[product.id]
      ? currentLiked.filter((p) => p.id !== product.id)
      : [...currentLiked, product];

    localStorage.setItem('likedProducts', JSON.stringify(updated));
    setLikedProductIds((prev) => ({
      ...prev,
      [product.id]: !prev[product.id],
    }));
    window.dispatchEvent(new Event('likedProductsUpdated'));
  };

  if (loading) {
    return (
      <div className="w-15 h-15 absolute left-[50%] bottom-[5%] border-4 border-dashed rounded-full animate-spin border-[#f50809]"></div>
    );
  }

  return (
    <section className="section widget-slider py-4">
      <div className="relative flex flex-col justify-start items-start group w-full max-w-[1428px] mx-auto px-10 lg:px-[64px] h-auto rounded-md">
        <div className="flex flex-row items-center justify-between w-[375px] h-auto">
          <div className="flex items-center gap-4 group-hover-trigger">
            <h2 className="text-[30px] text-[#000000] font-medium transition-colors duration-200">
              Yeni Rus Nəşrləri
            </h2>
            <div className="relative overflow-hidden w-7 h-7 hover-group">
              <div className="absolute top-0 left-0 flex items-center justify-center w-7 h-7 bg-[#f7f8fa] rounded hover-group-child transition-colors duration-200">
                <FaChevronRight className="text-[16px] text-[#000000] hover-group-icon transition-colors duration-200" />
              </div>
            </div>
          </div>
          <style jsx>{`
            @keyframes slide-in-out {
              0%,
              25% {
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
              75%,
              100% {
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
            .group-hover-trigger:hover h2 {
              color: #dc0708;
            }
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
        </div>

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

      {/* Modal (Sürətli Görünüş) */}
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
                {selectedProduct.characteristics?.some((c) => c.permalink === 'ekspress') && (
                  <span className="bg-[#dcfe5c] text-[#000000] px-2 py-0.5 rounded-sm text-[12px] font-medium">
                    Ekspress
                  </span>
                )}
                {selectedProduct.characteristics?.some((c) => c.title === 'TEZLİKLƏ!') && (
                  <span className="bg-[#005bff] text-[#ffffff] font-semibold px-2 py-0.5 rounded-sm text-[12px]">
                    Tezliklə!
                  </span>
                )}
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
                        onClick={handleModalQuantityChange.bind(null, -1)}
                        className="text-[#ffffff] bg-[#f50809] px-2 py-2 rounded-l-md"
                      >
                        <FaMinus className="text-[20px] text-[#ffffff]" />
                      </button>
                      <Link to="/Cart">
                        <div className="flex flex-col items-center text-[14px] text-[#000000] hover:text-[#f50809] font-medium p-2">
                          <div className="flex flex-row items-center gap-1">
                            <span>Səbətə at</span>
                            <span>{cartQuantities[selectedProduct.id]}</span>
                            <span>ədəd</span>
                          </div>
                          <span>Keçmək</span>
                        </div>
                      </Link>
                      <button
                        onClick={handleModalQuantityChange.bind(null, 1)}
                        className="text-[#ffffff] bg-[#f50809] px-2 py-2 rounded-r-md"
                      >
                        <FaPlus className="text-[20px] text-[#ffffff]" />
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`flex items-center justify-center w-full h-auto p-2 gap-2 rounded-md cursor-pointer ${
                        selectedProduct.variants?.[0]?.quantity === 0 || !selectedProduct.available
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-[#f50809]'
                      }`}
                      onClick={() =>
                        selectedProduct.variants?.[0]?.quantity > 0 &&
                        selectedProduct.available &&
                        addToCart(selectedProduct)
                      }
                    >
                      <BsCart3 className="text-[20px] text-[#ffffff] font-black" />
                      <span className="text-[16px] text-[#ffffff] font-medium">
                        {selectedProduct.variants?.[0]?.quantity === 0 || !selectedProduct.available
                          ? 'Stokda yoxdur'
                          : 'Səbətə at'}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-center">
                    {likedProductIds[selectedProduct.id] ? (
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
    </section>
  );
};

export default YeniRu;
