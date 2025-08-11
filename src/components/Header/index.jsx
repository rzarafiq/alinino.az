import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom"
import ReCAPTCHA from "react-google-recaptcha";
import { BsCart3, BsThreeDots } from "react-icons/bs"
import { FaChevronLeft, FaChevronRight, FaFacebookF, FaInstagram, FaPinterest, FaRegClock, FaRegHeart, FaRegUser, FaTelegram, FaWhatsapp, FaYoutube } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6";
import { FiMail, FiPhone, FiTrash2 } from "react-icons/fi"
import { RiCloseFill, RiMenuLine } from "react-icons/ri";
import { CgClose, CgSearch } from "react-icons/cg";
import { BiCommentDetail } from "react-icons/bi";
import azFlag from "../../assets/img/az.png";
import enFlag from "../../assets/img/en.png";
import ruFlag from "../../assets/img/ru.png";
import alinino_logo from "../../assets/img/alinino_logo.png";
import whatsapp from "../../assets/img/whatsapp.png";
import facebook from "../../assets/img/facebook.png";
import instagram from "../../assets/img/instagram.png";
import youtube from "../../assets/img/youtube.png";
import x from "../../assets/img/x.png";
import telegram from "../../assets/img/telegram.png";
import pinterest from "../../assets/img/pinterest.png";
import { getAllCategories } from "../../services/index";
import { getAllProducts } from "../../services/index";


const languages = [
  { code: "az", label: "Azərbaycan", flag: azFlag },
  { code: "en", label: "English", flag: enFlag },
  { code: "ru", label: "Русский", flag: ruFlag },
];


function Header() {

  const [isHovered, setIsHovered] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [subSubcategories, setSubSubcategories] = useState([]);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showWhatsapp, setShowWhatsapp] = useState(false);
  const [showFacebook, setShowFacebook] = useState(false);
  const [showInstagram, setShowInstagram] = useState(false);
  const [showYoutube, setShowYoutube] = useState(false);
  const [showX, setShowX] = useState(false);
  const [showTelegram, setShowTelegram] = useState(false);
  const [showPinterest, setShowPinterest] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedMainCategoryIndex, setSelectedMainCategoryIndex] = useState(null);
  const [selectedSubCategoryName, setSelectedSubCategoryName] = useState(null);

  const isAnyModalOpen = showForm || showFacebook || showInstagram || showYoutube || showX || showTelegram || showPinterest;

  const openMenu = () => {
    if (!isAnyModalOpen) {
      setIsMenuOpen(true);
    }
  };

   const closeMenu = () => {
    setIsMenuOpen(false);
    setMenuLevel(0);
    setActiveIndex(null);
    setActiveSubcategory(null);
  };

  const handleOpenForm = () => {
    setShowForm(true);
    closeMenu();
  };

  const handleOpenSocialModal = (setModalState) => {
    setModalState(true);
    closeMenu();
  };

  const handleCloseSocialModal = (setModalState) => {
    setModalState(false);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaToken(value);
  };


useEffect(() => {
  const handleScroll = () => {
    setIsSticky(window.scrollY > 10);
  };
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

useEffect(() => {
  async function fetchData() {
    try {
      const catData = await getAllCategories();
      console.log("Gələn kateqoriyalar:", catData);
      setCategories(catData);

      const data = await getAllProducts();

      const subcatMap = {};
      const subsubcatMap = {};

      Object.keys(data).forEach((mainCat) => {
        const products = data[mainCat];
        const subcats = new Set();
        const subsubcats = {};

        products.forEach((item) => {
          const subcat = item.category_hierarchy?.[1];
          const subsubcat = item.category_hierarchy?.[2];

          if (subcat) {
            subcats.add(subcat);
            if (subsubcat) {
              if (!subsubcats[subcat]) subsubcats[subcat] = new Set();
              subsubcats[subcat].add(subsubcat);
            }
          }
        });

        subcatMap[mainCat] = Array.from(subcats).map((name, i) => ({ id: i, name }));
        const subsubObj = {};
        Object.keys(subsubcats).forEach((sub) => {
          subsubObj[sub] = Array.from(subsubcats[sub]).map((name, i) => ({ id: i, name }));
        });
        subsubcatMap[mainCat] = subsubObj;
      });

      setSubcategories(subcatMap);
      setSubSubcategories(subsubcatMap);
    } catch (e) {
      console.error("Xəta baş verdi:", e);
      setError("Məlumat alınarkən xəta baş verdi");
    }
  }

  fetchData();
}, []);

if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen && !isAnyModalOpen) {
        closeMenu();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMenuOpen, isAnyModalOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!recaptchaToken) {
      alert("Zəhmət olmasa reCAPTCHA-nı tamamlayın.");
      return;
    }
  
    handleCloseForm();
    handleCloseSocialModal(setShowWhatsapp);
    handleCloseSocialModal(setShowFacebook);
    handleCloseSocialModal(setShowInstagram);
    handleCloseSocialModal(setShowYoutube);
    handleCloseSocialModal(setShowX);
    handleCloseSocialModal(setShowTelegram);
    handleCloseSocialModal(setShowPinterest);

    setRecaptchaToken(null);
    e.target.reset();
  };
 
  const getHeaderTitle = () => {
    if (currentLevel === 2 && selectedSubCategoryName) {
      return selectedSubCategoryName;
    }
    if (currentLevel === 1 && selectedMainCategoryIndex !== null) {
      return categories[selectedMainCategoryIndex]?.category;
    }
    return "Kateqoriyalar";
  };

  const handleCategoryClick = (index) => {
    setSelectedMainCategoryIndex(index);
    setCurrentLevel(1);
    setActiveIndex(index);
    setSelectedSubCategoryName(null);
  };

  const handleSubCategoryClick = (subCategoryName) => {
    setSelectedSubCategoryName(subCategoryName);
    setCurrentLevel(2);
    setActiveSubcategory(subCategoryName);
  };

  const handleGoBack = () => {
    if (currentLevel === 2) {
      setCurrentLevel(1);
      setSelectedSubCategoryName(null);
      setActiveSubcategory(null);
    } else if (currentLevel === 1) {
      setCurrentLevel(0);
      setSelectedMainCategoryIndex(null);
      setActiveIndex(null);
    }
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
    setCurrentLevel(0);
    setSelectedMainCategoryIndex(null);
    setSelectedSubCategoryName(null);
    setActiveIndex(null);
    setActiveSubcategory(null);
  };

// const [likedProducts, setLikedProducts] = useState([]);

// const loadLikedProducts = () => {
//   const data = JSON.parse(localStorage.getItem("likedProducts")) || [];
//   setLikedProducts(data);
// };

// useEffect(() => {
//   loadLikedProducts();
//   window.addEventListener("likedProductsUpdated", loadLikedProducts);
//   return () => window.removeEventListener("likedProductsUpdated", loadLikedProducts);
// }, []);

// const onRemove = useCallback((id) => {
//   setLikedProducts((prev) => {
//     const updated = prev.filter((item) => item.id !== id);
//     localStorage.setItem("likedProducts", JSON.stringify(updated));
//     window.dispatchEvent(new Event("likedProductsUpdated"));

//     return updated;
//   });
// }, []);



 const [likedProducts, setLikedProducts] = useState([]);

  const loadLikedProducts = useCallback(() => {
    const data = JSON.parse(localStorage.getItem("likedProducts")) || [];
    setLikedProducts(data);
  }, []);

  useEffect(() => {
    loadLikedProducts();
    window.addEventListener("likedProductsUpdated", loadLikedProducts);
    return () => window.removeEventListener("likedProductsUpdated", loadLikedProducts);
  }, [loadLikedProducts]);

  const onRemove = useCallback((id) => {
    setLikedProducts((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem("likedProducts", JSON.stringify(updated));
      window.dispatchEvent(new Event("likedProductsUpdated"));
      return updated;
    });
  }, []);





const [isActive, setIsActive] = useState(false);
  const inputWrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputWrapperRef.current && !inputWrapperRef.current.contains(e.target)) {
        setIsActive(false);
      }
    };

    if (isActive) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isActive]);

const [isContactOpen, setIsContactOpen] = useState(false);
const handleOpenContact = () => setIsContactOpen(true);
const handleCloseContact = () => setIsContactOpen(false);

const [isUserOpen, setIsUserOpen] = useState(false);
const handleOpenUser = () => setIsUserOpen(true);
const handleCloseUser = () => setIsUserOpen(false);

const [isFavoriteOpen, setIsFavoriteOpen] = useState(false);
const handleOpenFavorite = () => setIsFavoriteOpen(true);
const handleCloseFavorite = () => setIsFavoriteOpen(false);

const [isCartOpen, setIsCartOpen] = useState(false);
const handleOpenCart = () => setIsCartOpen(true);
const handleCloseCart = () => setIsCartOpen(false);

const [isSearchOpen, setIsSearchOpen] = useState(false);
const handleOpenSearch = () => setIsSearchOpen(true);
const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setIsActive(false);
  };

const scrollRef = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const checkScrollable = () => {
      setIsScrollable(el.scrollHeight > el.clientHeight);
    };
    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, [likedProducts]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputWrapperRef.current && inputWrapperRef.current.contains(event.target)) {
        return;
      }
      if (isActive) {
        setIsActive(false);
      }
    };
    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActive, isSearchOpen]);


  const [cartProducts, setCartProducts] = useState([]);
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("cartProducts")) || [];
    setCartProducts(data);
    const updateCart = () => {
      const updatedData = JSON.parse(localStorage.getItem("cartProducts")) || [];
      setCartProducts(updatedData);
    };
    window.addEventListener("cartUpdated", updateCart);
    return () => {
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);
  const totalQuantity = cartProducts.reduce((total, item) => total + item.quantity, 0);

// const [cartQuantities, setCartQuantities] = useState({});
// const quantities = {};
//     stored.forEach((product) => {
//       quantities[product.id] = product.quantity || 1;
//     });
//     setCartQuantities(quantities);
//   }, []);


 const [cartItems, setCartItems] = useState([]);

  // localStorage-dan səbəti yüklə
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(stored);
  }, []);

  // cartItems dəyişəndə localStorage-i yenilə
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);




  return (
    <>
      <div className="hidden lg:block w-full bg-[#f7f8fa]">
        <div className="flex flex-row items-center justify-between max-w-[1428px] mx-auto px-10 lg:px-[64px] h-[45px]">
          <div className="flex flex-row items-center gap-5">
            <div className="relative group inline-block z-6">
              <button className="flex items-center gap-2 py-1 px-3 bg-[#eeeeee] rounded-md cursor-pointer">
                <img src={azFlag} alt="language" className="w-5 h-3.5 rounded-sm" />
                <span className="text-sm font-medium text-gray-700">AZ</span>
              </button>
              <div
                className="absolute left-0 mt-1 w-[140px] bg-[#ffffff] rounded-md shadow-lg z-10
                          opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0
                          pointer-events-none group-hover:pointer-events-auto
                          transition-all duration-300 ease-in-out"
              >
                <ul className="py-1">
                  {languages.map((lang) => (
                    <li
                      key={lang.code}
                      className={
                        `flex items-center gap-2 px-4 py-2 text-sm cursor-pointer ` +
                        ((lang.code.toLowerCase() === 'az')
                          ? 'text-[#089cff] font-semibold'
                          : 'text-gray-700 hover:text-[#089cff]')
                      }
                    >
                      <img src={lang.flag} alt={lang.label} className="w-7 h-5 rounded-sm" />
                      <span>{lang.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Link to={'/'}><p className="text-[14px] text-black hover:text-[#f50809] font-normal">Tez-tez verilən suallar</p></Link>
          </div>
          <div className="flex flex-row items-center gap-5">
            <div className="flex flex-row items-center gap-1 cursor-pointer">
              <FaWhatsapp onClick={() => handleOpenSocialModal(setShowWhatsapp)} className="text-[20px] text-[#25d366]" />
              <p className="text-[14px] text-[#000000] hover:text-[#25d366] font-normal">WhatsApp</p>
            </div>
            <Link to={'/'} className="flex flex-row items-center gap-2">
              <FiPhone className="text-[18px] text-[#f50809]" />
              <p className="text-[14px] text-[#000000] hover:text-[#f50809] font-normal">(+99451) 312 24 40</p>
              <p className="text-[14px] text-[#000000] hover:text-[#f50809] font-normal">(+99477) 597 14 65</p>
              <p className="text-[14px] text-[#000000] hover:text-[#f50809] font-normal">(+99412) 431 40 67</p>
            </Link>
            <div className="relative group inline-block" onMouseEnter={openMenu}onMouseLeave={closeMenu}>
              <BsThreeDots className="text-[20px] text-[#000000] font-normal cursor-pointer" />
              <div
                className={`flex flex-col absolute top-6 right-0 bg-[#ffffff] w-[300px] h-auto p-[20px] gap-5 z-[100] shadow-lg rounded-lg
                          ${isMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-4 invisible"}
                          transition-all duration-300 ease-in-out transform origin-top-right`}
              >
                <button onClick={handleOpenForm} className="flex items-center justify-center w-full h-[34px] px-[15px] text-[14px] text-[#ffffff] bg-[#0052e6] hover:bg-[#007aff] rounded-md cursor-pointer">
                  Zəng sifarişi
                </button>
                <Link to={'/'} className="flex flex-row items-center gap-2">
                  <FiMail className="text-[16px] text-[#f50809]" />
                  <p className="text-[14px] text-[#000000] hover:text-[#f50809] font-normal">info@alinino.az</p>
                </Link>
                <div className="flex flex-row items-start gap-2">
                  <FaRegClock className="text-[16px] text-[#f50809]" />
                  <p className="text-[14px] text-[#000000] font-normal">
                    Biz həftənin 7 günü, saat 9:00 - <br />20:00 qədər çatdırılma edirik.
                  </p>
                </div>
                <div className="flex flex-row flex-wrap gap-2">
                  <div className="flex items-center justify-center w-[45px] h-[45px] bg-[#f7f8fa] rounded-md cursor-pointer">
                    <FaFacebookF onClick={() => handleOpenSocialModal(setShowFacebook)} className="text-[20px] text-[#3b5998]" />
                  </div>
                  <div className="flex items-center justify-center w-[45px] h-[45px] bg-[#f7f8fa] rounded-md cursor-pointer">
                    <FaInstagram onClick={() => handleOpenSocialModal(setShowInstagram)} className="text-[24px] text-[#654C9F]" />
                  </div>
                  <div className="flex items-center justify-center w-[45px] h-[45px] bg-[#f7f8fa] rounded-md cursor-pointer">
                    <FaYoutube onClick={() => handleOpenSocialModal(setShowYoutube)} className="text-[24px] text-[#f50809]" />
                  </div>
                  <div className="flex items-center justify-center w-[45px] h-[45px] bg-[#f7f8fa] rounded-md cursor-pointer">
                    <FaXTwitter onClick={() => handleOpenSocialModal(setShowX)} className="text-[20px] text-[#000000]" />
                  </div>
                  <div className="flex items-center justify-center w-[45px] h-[45px] bg-[#f7f8fa] rounded-md cursor-pointer">
                    <FaTelegram onClick={() => handleOpenSocialModal(setShowTelegram)} className="text-[22px] text-[#2ca3d6]" />
                  </div>
                  <div className="flex items-center justify-center w-[45px] h-[45px] bg-[#f7f8fa] rounded-md cursor-pointer">
                    <FaPinterest onClick={() => handleOpenSocialModal(setShowPinterest)} className="text-[22px] text-[#f50809]" />
                  </div>
                </div>
              </div>
              {showForm && (
                <div
                  className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-[#0a0a0a98] z-[100]"
                  onClick={handleCloseForm}
                >
                  <div
                    className="bg-white w-[440px] h-auto py-4 px-6 rounded-md relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-row items-center justify-between mb-4">
                      <h2 className="text-[16px] text-black font-bold">Geri zəng edin</h2>
                      <button onClick={handleCloseForm}>
                        <RiCloseFill className="text-[20px] text-black font-bold" />
                      </button>
                    </div>
                    <p className="text-[14px] text-black mb-6">
                      Zəhmət olmasa adınızı və əlaqə telefon nömrənizi qeyd edin.
                      Operatorumuz sizə ən qısa zamanda zəng edəcək.
                    </p>
                    <form
                      onSubmit={handleSubmit}
                      action="#"
                      className="space-y-4"
                      data-alert="Müraciətiniz uğurla göndərildi. Ən qısa zamanda sizinlə əlaqə saxlayacağıq."
                      data-form-name="callback"
                    >
                      <input name="feedback[subject]" type="hidden" defaultValue="Geri zəng edin" />
                      <input name="feedback[content]" type="hidden" defaultValue="Geri zəng edin" />
                      <input name="feedback[from]" type="hidden" defaultValue="info@alinino.az" />

                      <div className="flex flex-col">
                        <label className="mb-1">Adınız</label>
                        <input
                          type="text"
                          name="feedback[name]"
                          className="border border-gray-300 outline-none rounded px-3 py-2"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="mb-1">
                          Əlaqə nömrəsi <span className="text-[#dc0708]">*</span>
                        </label>
                        <input
                          type="tel"
                          name="feedback[phone]"
                          className="border border-gray-300 outline-none rounded px-3 py-2"
                          required
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="mb-1">
                          Sizə zəng etmək üçün hanı variant uyğundur? <span className="text-[#dc0708]">*</span>
                        </label>
                        <select
                          name="feedback[call_method]"
                          className="border border-gray-300 outline-none rounded px-3 py-2"
                          required
                        >
                          <option value="Adi zəng">Adi zəng</option>
                          <option value="WhatsApp">WhatsApp</option>
                        </select>
                      </div>

                      <div className="flex justify-center">
                        <ReCAPTCHA
                          sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                          onChange={handleRecaptchaChange}
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full text-[#ffffff] bg-[#0052e6] hover:bg-[#007aff] font-medium py-2 rounded"
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
              )}
              {showWhatsapp && (
                <div
                  className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-[#0a0a0a98] z-[100]"
                  onClick={() => handleCloseSocialModal(setShowWhatsapp)}
                >
                  <div
                    className="bg-white w-[360px] h-auto p-5 rounded-md relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-row items-center justify-end">
                      <button onClick={() => handleCloseSocialModal(setShowWhatsapp)}>
                        <RiCloseFill className="text-[24px] text-black font-bold" />
                      </button>
                    </div>
                    <h2 className="text-[18px] text-black font-bold">WhatsApp</h2>
                    <div onSubmit={handleSubmit} className="flex flex-row items-center justify-between gap-2 p-2 mt-2 border border-gray-200 rounded">
                      <img src={whatsapp} alt="whatsapp" className="w-[100px] h-[100px]" />
                      <p className="text-[14px] text-[#000000] font-normal">Digər cihazdan [sosial] bölməsini açmaq üçün bu QR kodunu skan edin</p>
                    </div>
                    <Link to={'https://api.whatsapp.com/send?phone=994513122440'} className="flex flex-row items-center justify-center w-full gap-2 bg-gray-200 mt-5 py-3 rounded">
                      <FaWhatsapp className="text-[20px] text-[#000000]" />
                      <p className="text-[14px] text-[#000000] font-medium">Aç WhatsApp</p>
                    </Link>
                  </div>
                </div>
              )}
              {showFacebook && (
                <div
                  className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-[#0a0a0a98] z-[100]"
                  onClick={() => handleCloseSocialModal(setShowFacebook)}
                >
                  <div
                    className="bg-white w-[360px] h-auto p-5 rounded-md relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-row items-center justify-end">
                      <button onClick={() => handleCloseSocialModal(setShowFacebook)}>
                        <RiCloseFill className="text-[24px] text-black font-bold" />
                      </button>
                    </div>
                    <h2 className="text-[18px] text-black font-bold">Facebook</h2>
                    <div onSubmit={handleSubmit} className="flex flex-row items-center justify-between gap-2 p-2 mt-2 border border-gray-200 rounded">
                      <img src={facebook} alt="facebook" className="w-[100px] h-[100px]" />
                      <p className="text-[14px] text-[#000000] font-normal">Digər cihazdan [sosial] bölməsini açmaq üçün bu QR kodunu skan edin</p>
                    </div>
                    <Link to={'https://www.facebook.com/aliandnino.azerbaijan'} className="flex flex-row items-center justify-center w-full gap-2 bg-gray-200 mt-5 py-3 rounded">
                      <FaFacebookF className="text-[20px] text-[#000000]" />
                      <p className="text-[14px] text-[#000000] font-medium">Aç Facebook</p>
                    </Link>
                  </div>
                </div>
              )}
              {showInstagram && (
                <div
                  className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-[#0a0a0a98] z-[100]"
                  onClick={() => handleCloseSocialModal(setShowInstagram)}
                >
                  <div
                    className="bg-white w-[360px] h-auto p-5 rounded-md relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-row items-center justify-end">
                      <button onClick={() => handleCloseSocialModal(setShowInstagram)}>
                        <RiCloseFill className="text-[24px] text-black font-bold" />
                      </button>
                    </div>
                    <h2 className="text-[18px] text-black font-bold">Instagram</h2>
                    <div onSubmit={handleSubmit} className="flex flex-row items-center justify-between gap-2 p-2 mt-2 border border-gray-200 rounded">
                      <img src={instagram} alt="instagram" className="w-[100px] h-[100px]" />
                      <p className="text-[14px] text-[#000000] font-normal">Digər cihazdan [sosial] bölməsini açmaq üçün bu QR kodunu skan edin</p>
                    </div>
                    <Link to={'https://www.instagram.com/ali_and_nino/'} className="flex flex-row items-center justify-center w-full gap-2 bg-gray-200 mt-5 py-3 rounded">
                      <FaInstagram className="text-[20px] text-[#000000]" />
                      <p className="text-[14px] text-[#000000] font-medium">Aç Instagram</p>
                    </Link>
                  </div>
                </div>
              )}
              {showYoutube && (
                <div
                  className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-[#0a0a0a98] z-[100]"
                  onClick={() => handleCloseSocialModal(setShowYoutube)}
                >
                  <div
                    className="bg-white w-[360px] h-auto p-5 rounded-md relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-row items-center justify-end">
                      <button onClick={() => handleCloseSocialModal(setShowYoutube)}>
                        <RiCloseFill className="text-[24px] text-black font-bold" />
                      </button>
                    </div>
                    <h2 className="text-[18px] text-black font-bold">YouTube</h2>
                    <div onSubmit={handleSubmit} className="flex flex-row items-center justify-between gap-2 p-2 mt-2 border border-gray-200 rounded">
                      <img src={youtube} alt="youtube" className="w-[100px] h-[100px]" />
                      <p className="text-[14px] text-[#000000] font-normal">Digər cihazdan [sosial] bölməsini açmaq üçün bu QR kodunu skan edin</p>
                    </div>
                    <Link to={'https://www.instagram.com/ali_and_nino/'} className="flex flex-row items-center justify-center w-full gap-2 bg-gray-200 mt-5 py-3 rounded">
                      <FaYoutube className="text-[20px] text-[#000000]" />
                      <p className="text-[14px] text-[#000000] font-medium">Aç YouTube</p>
                    </Link>
                  </div>
                </div>
              )}
              {showX && (
                <div
                  className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-[#0a0a0a98] z-[100]"
                  onClick={() => handleCloseSocialModal(setShowX)}
                >
                  <div
                    className="bg-white w-[360px] h-auto p-5 rounded-md relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-row items-center justify-end">
                      <button onClick={() => handleCloseSocialModal(setShowX)}>
                        <RiCloseFill className="text-[24px] text-black font-bold" />
                      </button>
                    </div>
                    <h2 className="text-[18px] text-black font-bold">X</h2>
                    <div onSubmit={handleSubmit} className="flex flex-row items-center justify-between gap-2 p-2 mt-2 border border-gray-200 rounded">
                      <img src={x} alt="x" className="w-[100px] h-[100px]" />
                      <p className="text-[14px] text-[#000000] font-normal">Digər cihazdan [sosial] bölməsini açmaq üçün bu QR kodunu skan edin</p>
                    </div>
                    <Link to={'https://x.com/Ali_and_Nino'} className="flex flex-row items-center justify-center w-full gap-2 bg-gray-200 mt-5 py-3 rounded">
                      <FaXTwitter className="text-[20px] text-[#000000]" />
                      <p className="text-[14px] text-[#000000] font-medium">Aç X</p>
                    </Link>
                  </div>
                </div>
              )}
              {showTelegram && (
                <div
                  className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-[#0a0a0a98] z-[100]"
                  onClick={() => handleCloseSocialModal(setShowTelegram)}
                >
                  <div
                    className="bg-white w-[360px] h-auto p-5 rounded-md relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-row items-center justify-end">
                      <button onClick={() => handleCloseSocialModal(setShowTelegram)}>
                        <RiCloseFill className="text-[24px] text-black font-bold" />
                      </button>
                    </div>
                    <h2 className="text-[18px] text-black font-bold">Telegram</h2>
                    <div onSubmit={handleSubmit} className="flex flex-row items-center justify-between gap-2 p-2 mt-2 border border-gray-200 rounded">
                      <img src={telegram} alt="telegram" className="w-[100px] h-[100px]" />
                      <p className="text-[14px] text-[#000000] font-normal">Digər cihazdan [sosial] bölməsini açmaq üçün bu QR kodunu skan edin</p>
                    </div>
                    <Link to={'https://t.me/ali_nino'} className="flex flex-row items-center justify-center w-full gap-2 bg-gray-200 mt-5 py-3 rounded">
                      <FaTelegram className="text-[20px] text-[#000000]" />
                      <p className="text-[14px] text-[#000000] font-medium">Aç Telegram</p>
                    </Link>
                  </div>
                </div>
              )}
              {showPinterest && (
                <div
                  className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-[#0a0a0a98] z-[100]"
                  onClick={() => handleCloseSocialModal(setShowPinterest)}
                >
                  <div
                    className="bg-white w-[360px] h-auto p-5 rounded-md relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-row items-center justify-end">
                      <button onClick={() => handleCloseSocialModal(setShowPinterest)}>
                        <RiCloseFill className="text-[24px] text-black font-bold" />
                      </button>
                    </div>
                    <h2 className="text-[18px] text-black font-bold">Pinterest</h2>
                    <div onSubmit={handleSubmit} className="flex flex-row items-center justify-between gap-2 p-2 mt-2 border border-gray-200 rounded">
                      <img src={pinterest} alt="pinterest" className="w-[100px] h-[100px]" />
                      <p className="text-[14px] text-[#000000] font-normal">Digər cihazdan [sosial] bölməsini açmaq üçün bu QR kodunu skan edin</p>
                    </div>
                    <Link to={'https://www.pinterest.com/ali_and_nino/'} className="flex flex-row items-center justify-center w-full gap-2 bg-gray-200 mt-5 py-3 rounded">
                      <FaPinterest className="text-[20px] text-[#000000]" />
                      <p className="text-[14px] text-[#000000] font-medium">Aç Pinterest</p>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <nav className={`hidden lg:block w-full bg-[#ffffff] sticky top-0 z-50 transition-all duration-300 ${isSticky ? 'h-[120px] shadow-md' : 'h-[135px]'}`}>
        <div className="flex flex-row items-center justify-between max-w-[1428px] mx-auto h-full px-10 lg:px-[64px] transition-all duration-300">
          <Link to={'/'}><img src={alinino_logo} alt="alinino_logo" className="w-[100px] h-auto" /></Link>
          <div className="relative inline-block z-50"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setActiveIndex(null);
                }}
          >
            <div className="flex flex-row items-center gap-3 bg-[#dc0708] hover:bg-[#f50809] p-3 rounded-md cursor-pointer transition-colors duration-300">
              <div
                className={`text-2xl text-[#ffffff] transition-transform duration-700 ${
                  isHovered ? "scale-100" : "scale-115"
                }`}
              >
                {isHovered ? <CgClose /> : <RiMenuLine />}
              </div>
              <span className="text-[16px] text-[#ffffff]">Kataloq</span>
            </div>
            <div className={`absolute top-21 -left-32 w-[340px] h-[calc(100vh-100px)] bg-[#ffffff] rounded z-10 overflow-y-auto transition-all duration-300 transform ${isHovered ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-4 invisible"}`}
              style={{ boxShadow: `0 4px 10px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.08)` }}>
              <ul className="py-2 px-4 space-y-1">
                {Array.isArray(categories) && categories.length > 0 ? (
                  categories.map((item, index) => {
                    const hasSubcategories = subcategories[item.category]?.length > 0;
                    return (
                      <li
                        key={item.id}
                        className="flex justify-between items-center text-[14px] text-[#000000] hover:text-[#f50809] py-1 rounded cursor-pointer transition-colors duration-200"
                        onMouseEnter={() => {
                          setActiveIndex(index);
                          setIsHovered(true);
                        }}
                        onMouseLeave={() => setIsHovered(false)}
                      >
                        <span>{item.category}</span>
                        {hasSubcategories && <FaChevronRight />}
                      </li>
                    );
                  })
                ) : (
                  <li className="text-gray-500 p-4">Kateqoriya yoxdur</li>
                )}
              </ul>
            </div>
            {activeIndex !== null && categories[activeIndex] && subcategories[categories[activeIndex].category]?.length > 0 && (
              <div
                className="absolute top-21 left-53 w-[960px] h-[calc(100vh-100px)] bg-[#ffffff] rounded z-10 overflow-y-auto transition-all duration-300 transform opacity-100 translate-x-0 visible"
                style={{
                  boxShadow: `0 4px 10px rgba(0, 0, 0, 0.1), 0 1px 8px rgba(0, 0, 0, 0.08)`,
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <ul className="py-2 px-4 space-y-1 flex flex-row items-start gap-30">
                  {subcategories[categories[activeIndex].category].map((subcategory) => (
                    <li
                      key={subcategory.id}
                      className="text-[14px] text-black font-semibold py-1 rounded cursor-pointer transition-colors duration-200"
                    >
                      <span>{subcategory.name}</span>
                      <ul className="mt-1 space-y-1">
                        {subSubcategories[categories[activeIndex].category]?.[subcategory.name]?.length > 0 ? (
                          subSubcategories[categories[activeIndex].category][subcategory.name].map((subsub) => (
                            <li
                              key={subsub.id}
                              className="text-[14px] text-gray-600 hover:text-[#f50809] font-normal"
                            >
                              {subsub.name}
                            </li>
                          ))
                        ) : (
                          <li className="text-gray-400">Alt-kateqoriya yoxdur</li>
                        )}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="relative w-full h-auto z-50" style={{ width: "clamp(430px, calc(430px + (580 * ((88vw - 1024px) / 270))), 784px)" }}>
            {isActive && (<div className="fixed inset-0 bg-[#0a0a0a98] z-60 transition-opacity duration-300"></div>)}
            <div ref={inputWrapperRef} className={`relative h-[45px] rounded ${ isActive ? "z-60 outline-5 outline-white" : "" }`}>
              <input type="search" placeholder="Kataloq üzrə axtarış" onFocus={() => setIsActive(true)}
                className="w-full h-full px-4 pr-12 text-[14px] border-2 border-[#f50809] rounded outline-none bg-white relative z-10"
              />
              <div className="absolute top-0 right-0 h-full w-[50px] flex items-center justify-center bg-[#dc0708] rounded-r-md z-20">
                <CgSearch className="text-[25px] text-white" />
              </div>
            </div>
          </div>
          <div className="relative group">
            <div className="flex flex-col items-center justify-center text-[#000000] hover:text-[#f50809] cursor-pointer">
              <FaRegUser className="text-[20px]" />
              <span className="text-[12px]">Şəxsi kabinet</span>
            </div>
            <div className="flex flex-col absolute top-12 right-0 bg-[#ffffff] w-[300px] h-auto p-[20px] gap-5 z-[100] shadow-xs rounded-md
                            opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0
                            pointer-events-none group-hover:pointer-events-auto
                            transition-all duration-300 ease-in-out">
              <div className="flex items-center justify-center">
                <FaRegUser className="text-[50px] text-[#f5f5f5]" />
              </div>
              <div className="flex flex-row gap-3">
                <Link to={'/'} className="flex items-center justify-center w-full h-[34px] px-[15px] text-[14px] text-[#ffffff] bg-[#f50809] rounded-md">
                Avtorizasiya
                </Link>
                <Link to={'/'} className="flex items-center justify-center w-full h-[34px] px-[15px] text-[14px] text-[#ffffff] bg-[#0052e6] hover:bg-[#007aff] rounded-md">
                  Qeydiyyat
                </Link>
              </div>
            </div>
          </div>
          <div className="relative group">
            <Link
              to="/Favorites"
              className="flex flex-col items-center justify-center text-[#000000] hover:text-[#f50809] cursor-pointer"
            >
              <FaRegHeart className="text-[20px]" />
              <span className="text-[12px]">Sevimlilər</span>
            </Link>

            {likedProducts.length > 0 && (
              <div className="absolute -top-1.5 right-2 w-4 h-4 text-[12px] text-[#ffffff] text-center bg-[#f50809] rounded-full">
                {likedProducts.length}
              </div>
            )}

            <div
              className={`flex flex-col absolute top-12 right-0 bg-[#ffffff] w-[400px] h-auto gap-5 pr-1 z-[100] shadow-xl rounded-md
                opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0
                pointer-events-none group-hover:pointer-events-auto
                transition-all duration-300 ease-in-out`}
            >
              {likedProducts.length === 0 ? (
                <div className="flex items-center justify-center pt-4">
                  <FaRegHeart className="text-[50px] text-[#f5f5f5]" />
                </div>
              ) : (
                <span className="flex items-center justify-start gap-2 text-[14px] font-medium text-[#000000] px-6 pt-6">
                  Sevimlilərinizdə
                  <span className="font-semibold">{likedProducts.length} məhsul</span>
                </span>
              )}

              <div
                ref={scrollRef}
                className={`flex flex-col justify-start gap-4 px-6 ${
                  likedProducts.length > 0
                    ? `max-h-[400px] overflow-y-auto custom-scrollbar ${
                        isScrollable ? "border-y border-[#eeeeee]" : ""
                      }`
                    : ""
                }`}
              >
                {likedProducts.length === 0 ? (
                  <p className="text-[14px] text-[#9d9d9d] text-center pb-4">
                    Sevimliləriniz hazırda boşdur
                  </p>
                ) : (
                  likedProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-3 w-full">
                      <img
                        src={product.first_image?.medium_url}
                        alt={product.title}
                        className="w-10 h-16 object-cover"
                      />
                      <div className="flex flex-col flex-1 self-center">
                        <span className="text-[12px] text-[#000000] font-normal">
                          {product.title}
                        </span>
                        <span className="text-[14px] text-[#000000] font-semibold">
                          {product.variants?.[0]?.price} AZN
                        </span>
                      </div>
                      <button
                        onClick={() => onRemove(product.id)}
                        className="text-[#777777] hover:text-[#dc0708]"
                      >
                        <FiTrash2 size={22} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {likedProducts.length > 0 && (
                <div className="flex flex-col gap-4 px-6 pb-6">
                  <div className="bg-[#f7f8fa] px-6 py-2 rounded-md">
                    <p className="text-[12px] text-[#000000] hover:text-[#dc0708] underline cursor-pointer">
                      Sevdiyiniz məhsulları saxlamaq üçün şəxsi hesabınıza daxil olun
                    </p>
                  </div>
                  <Link
                    to="/Favorites"
                    className="flex items-center justify-center bg-[#f50809] text-white text-[14px] py-2 rounded-md hover:bg-[#dc2626] 
                          transition cursor-pointer"
                  >
                    <button>Sevimlilərə keçin</button>
                  </Link>
                </div>
              )}
            </div>
          </div>



          <div className="relative group">
            <Link to="/Cart" className="flex flex-col items-center justify-center text-[#000000] hover:text-[#f50809] cursor-pointer">
              <BsCart3 className="text-[20px]" />
              <span className="text-[12px]">Səbət</span>
            </Link>

            {totalQuantity > 0 && (
              <div className="absolute -top-1.5 right-0 w-4 h-4 text-[12px] text-[#ffffff] text-center bg-[#f50809] rounded-full">
                {totalQuantity}
              </div>
            )}

            <div
              className="flex flex-col absolute top-12 right-0 bg-[#ffffff] w-[400px] h-auto p-[20px] gap-5 z-[100] shadow-xs rounded-md
            opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0
            pointer-events-none group-hover:pointer-events-auto
            transition-all duration-300 ease-in-out"
            >
              <div className="flex items-center justify-center">
                {cartProducts.length === 0 ? (
                  <BsCart3 className="text-[50px] text-[#f5f5f5]" />
                ) : (
                  <span className="text-[16px] font-medium text-[#f50809]">
                    Səbətinizdə {cartProducts.length} məhsul var
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto">
                {cartProducts.length === 0 ? (
                  <p className="text-[14px] text-[#9d9d9d] text-center">Səbətiniz hələ ki boşdur</p>
                ) : (
                  cartProducts.map((product) => (
                    <div key={product.id} className="flex items-start gap-3 border-b pb-4">
                      <img
                        src={product.first_image?.medium_url}
                        alt={product.title}
                        className="w-10 h-16 object-cover"
                      />
                      {/* <div className="flex flex-col justify-center flex-1">
                        <span className="text-[12px] font-medium text-[#000000]">{product.title}</span>
                        <span className="text-[14px] text-[#000000] font-semibold">
                          {quantity} × {unitPrice.toFixed(2)} ₼
                        </span>
                      </div> */}

                      


                      {/* <div>
                        {cartItems.map((product) => {
                          const quantity = cartQuantities[product.id] || 1;
                          const unitPrice = product.price || 0;

                          return (
                            <div key={product.id} className="flex items-center gap-3 border-b py-2">
                              <div className="flex flex-col justify-center flex-1">
                                <span className="text-[12px] font-medium text-[#000000]">
                                  {product.title || "Məhsul adı"}
                                </span>
                                <span className="text-[14px] text-[#000000] font-semibold">
                                  {quantity} × {unitPrice.toFixed(2)} ₼
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div> */}


                      <div>
      {cartItems.length === 0 ? (
        <p>Səbətiniz boşdur.</p>
      ) : (
        cartItems.map((product) => {
          const quantity = product.quantity || 1;
          const unitPrice = product.price || 0;
          const totalPrice = quantity * unitPrice;

          return (
            <div
              key={product.id}
              className="flex items-center gap-3 border-b py-2"
            >
              <div className="flex flex-col justify-center flex-1">
                <span className="text-[12px] font-medium text-[#000000]">
                  {product.title || "Məhsul adı"}
                </span>
                <span className="text-[14px] text-[#000000] font-semibold">
                  {quantity} × {unitPrice.toFixed(2)} ₼ = {totalPrice.toFixed(2)} ₼
                </span>
              </div>
            </div>
          );
        })
      )}
    </div>
        

                      <button
                        onClick={() => {
                          const filtered = cartProducts.filter((p) => p.id !== product.id);
                          localStorage.setItem("cartProducts", JSON.stringify(filtered));
                          setCartProducts(filtered);
                          window.dispatchEvent(new Event("cartUpdated"));
                        }}
                        className="text-[#f50809] hover:text-[#dc2626]"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {cartProducts.length > 0 && (
                <>
                  <p className="text-[13px] text-[#777777] text-center">
                    Promokod və ya endirim kuponu ( Hər sifarişdə yalnız bir promokod istifadə etmək mümkündür )
                  </p>
                  <Link to="/Cart" className="flex items-center justify-center bg-[#f50809] text-white text-[14px] py-2 rounded-md hover:bg-[#dc2626] transition">
                    <button>
                      Səbəti aç
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>



      <div className="lg:hidden fixed w-full bg-[#ffffff] h-[50px] top-0 z-[60] shadow flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            className="text-2xl text-black focus:outline-none"
          >
            {isMenuOpen ? <RiCloseFill /> : <RiMenuLine />}
          </button>
          <Link to="/">
            <img src={alinino_logo} alt="logo" className="w-6 h-auto" />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleOpenSearch} className="text-[20px] text-[#000000]">
            <CgSearch />
          </button>
          <button onClick={handleOpenContact} className="text-[20px] text-[#000000]">
            <BiCommentDetail />
          </button>
          <button onClick={handleOpenUser} className="text-[20px] text-[#000000]">
            <FaRegUser />
          </button>
          <button onClick={handleOpenFavorite} className="text-[20px] text-[#000000]">
            <FaRegHeart />
          </button>
          <button onClick={handleOpenCart} className="text-[20px] text-[#000000]">
            <BsCart3 />
          </button>
        </div>
      </div>
      <div className={`fixed top-0 left-0 w-3/4 max-w-xs h-full bg-[#ffffff] shadow-lg transform transition-transform duration-300 ease-in-out z-[70] 
      ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {currentLevel === 0 && (
          <div className="flex items-center justify-between w-full h-[45px] px-4 py-3 bg-[#f9fafb]">
            <div className="relative group inline-block">
              <button className="flex items-center gap-2 py-1 px-3 bg-[#eeeeee] rounded-md cursor-pointer">
                <img src={azFlag} alt="language" className="w-5 h-3.5 rounded-sm" />
                <span className="text-sm font-medium text-gray-700">AZ</span>
              </button>
              <div
                className="absolute left-0 mt-1 w-[140px] bg-[#ffffff] rounded-md shadow-lg z-10
                  opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0
                  pointer-events-none group-hover:pointer-events-auto
                  transition-all duration-300 ease-in-out"
              >
                <ul className="py-1">
                  {languages.map((lang) => (
                    <li
                      key={lang.code}
                      className={
                        `flex items-center gap-2 px-4 py-2 text-sm cursor-pointer ` +
                        ((lang.code.toLowerCase() === 'az')
                          ? 'text-[#089cff] font-semibold'
                          : 'text-gray-700 hover:text-[#089cff]')
                      }
                    >
                      <img src={lang.flag} alt={lang.label} className="w-7 h-5 rounded-sm" />
                      <span>{lang.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              onClick={handleCloseMenu}
              aria-label="Close menu"
              className="text-2xl text-black"
            >
              <RiCloseFill />
            </button>
          </div>
        )}
        <div className="relative w-full overflow-hidden"
             style={{ height: currentLevel === 0 ? 'calc(100% - 45px - 55px)' : 'calc(100% - 50px)' }}>
          <div
            className={`absolute top-0 left-0 w-full h-full overflow-y-auto p-2 bg-[#ffffff]
                        transform transition-transform duration-300 ease-in-out
                        ${currentLevel === 0 ? "translate-x-0" : "-translate-x-full"}`}
          >
            <ul className="py-2 px-4 space-y-1">
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((item, index) => {
                  const hasSubcategories = subcategories[item.category]?.length > 0;
                  return (
                    <li
                      key={item.id}
                      className="flex justify-between items-center text-[14px] text-[#000000] hover:text-[#f50809] py-1 rounded cursor-pointer transition-colors duration-200"
                      onClick={() => handleCategoryClick(index)}
                      onMouseEnter={() => { setActiveIndex(index); setIsHovered(true); setActiveSubcategory(null); }}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <span>{item.category}</span>
                      {hasSubcategories && <FaChevronRight />}
                    </li>
                  );
                })
              ) : (
                <li className="text-gray-500 p-4">Kateqoriya yoxdur</li>
              )}
            </ul>
          </div>
          {selectedMainCategoryIndex !== null && categories[selectedMainCategoryIndex] && (
            <div
              className={`absolute top-0 left-0 w-full h-full overflow-y-auto bg-[#ffffff] shadow-lg
                          transform transition-transform duration-300 ease-in-out
                          ${currentLevel === 1 ? "translate-x-0" : currentLevel === 2 ? "-translate-x-full" : "translate-x-full"}`}
            >
              <div className="flex flex-row items-center justify-between w-full h-[50px] p-3 text-[18px] text-[#000000] bg-[#f7f8fa]">
                <div className="flex items-center gap-2">
                  <FaChevronLeft className="cursor-pointer text-lg" onClick={handleGoBack} />
                  <span className="font-semibold">{getHeaderTitle()}</span>
                </div>
                <RiCloseFill className="cursor-pointer text-2xl" onClick={handleCloseMenu} />
              </div>
              <ul className="py-2 px-4 space-y-1">
                {subcategories[categories[selectedMainCategoryIndex].category]?.length > 0 ? (
                  subcategories[categories[selectedMainCategoryIndex].category].map(
                    (subcategory) => {
                      const hasSubSub =
                        subSubcategories[categories[selectedMainCategoryIndex].category]?.[
                          subcategory.name
                        ]?.length > 0;
                      return (
                        <li
                          key={subcategory.id}
                          className="flex justify-between items-center text-[14px] text-[#000000] hover:text-[#f50809] font-normal py-1 rounded cursor-pointer transition-colors duration-200"
                          onClick={() => handleSubCategoryClick(subcategory.name)}
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                        >
                          <span>{subcategory.name}</span>
                          {hasSubSub && <FaChevronRight />}
                        </li>
                      );
                    }
                  )
                ) : (
                  <li className="text-gray-500 p-4">Alt kateqoriya yoxdur</li>
                )}
              </ul>
            </div>
          )}
          {selectedMainCategoryIndex !== null && selectedSubCategoryName && subSubcategories[categories[selectedMainCategoryIndex].category]?.[selectedSubCategoryName]?.length > 0 && (
            <div
              className={`absolute top-0 left-0 w-full h-full overflow-y-auto bg-[#ffffff] shadow-lg
                          transform transition-transform duration-300 ease-in-out
                          ${currentLevel === 2 ? "translate-x-0" : "translate-x-full"}`}
            >
              <div className="flex flex-row items-center justify-between w-full h-[50px] p-3 text-[18px] text-[#000000] bg-[#f7f8fa]">
                <div className="flex items-center gap-2">
                  <FaChevronLeft className="cursor-pointer text-lg" onClick={handleGoBack} />
                  <span className="font-semibold">{getHeaderTitle()}</span>
                </div>
                <RiCloseFill className="cursor-pointer text-2xl" onClick={handleCloseMenu} />
              </div>
              <ul className="py-2 px-4 space-y-1">
                {subSubcategories[categories[selectedMainCategoryIndex].category][
                  selectedSubCategoryName
                ].map((subsub) => (
                  <li
                    key={subsub.id}
                    className="text-[14px] text-[#000000] hover:text-[#f50809] font-normal py-1 rounded cursor-pointer transition-colors duration-200"
                  >
                    {subsub.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {currentLevel === 0 && (
          <div className="absolute bottom-0 w-full p-4 h-[55px] bg-[#f7f8fa]">
            <Link to={'/'} onClick={handleCloseMenu}><p className="text-[14px] text-black hover:text-[#f50809] font-normal">Tez-tez verilən suallar</p></Link>
          </div>
        )}
      </div>
      <div className={`fixed top-0 left-0 w-full h-full bg-[#ffffff] shadow-lg transform transition-all duration-300 ease-in-out z-[70]
          ${isSearchOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}>
        <div className="flex items-center justify-between w-full h-[50px] p-4 bg-[#f9fafb]">
          <h2 className="text-[18px] font-semibold text-[#000000]">Axtarış</h2>
          <button onClick={handleCloseSearch} className="text-2xl text-black" aria-label="Axtarış panelini bağla">
            <RiCloseFill />
          </button>
        </div>
        <div className="p-4">
          <div className="relative w-full z-25">
            <div ref={inputWrapperRef} className={`relative h-[45px] rounded `}>
              <input 
                type="search" 
                placeholder="Kataloq üzrə axtarış" 
                className="w-full h-full px-4 pr-12 text-[14px] border-2 border-[#f50809] rounded-md outline-none bg-white relative z-10"
              />
              <div className="absolute top-0 right-0 h-full w-[50px] flex items-center justify-center bg-[#dc0708] rounded-r-md z-20">
                <CgSearch className="text-[25px] text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`fixed top-0 left-0 w-3/4 max-w-xs  h-full bg-[#ffffff] shadow-lg transform transition-transform duration-300 ease-in-out z-[70]
        ${isContactOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between w-full h-[50px] p-4 bg-[#f9fafb]">
          <h2 className="text-[18px] font-semibold text-[#000000]">Əlaqələr</h2>
          <button onClick={handleCloseContact} className="text-2xl text-black" aria-label="Close contact sidebar">
            <RiCloseFill />
          </button>
        </div>
        <div className="flex flex-col items-start gap-2 p-5">
            
            <Link to={'/'} className="flex flex-col items-start">
              <p className="text-[16px] text-[#000000] font-semibold">(+99451) 312 24 40</p>
              <p className="text-[12px] text-gray-400 font-medium">Telefonla elə indi sifariş edin!</p>
              <p className="text-[16px] text-[#000000] font-semibold">(+99477) 597 14 65</p>
              <p className="text-[16px] text-[#000000] font-semibold">(+99412) 431 40 67</p>
            </Link>
            <div className="relative group flex flex-col gap-2" onMouseEnter={openMenu}onMouseLeave={closeMenu}>
              <button onClick={handleOpenForm} className="flex items-center justify-center w-full h-[34px] px-[15px] text-[14px] text-[#ffffff] bg-[#0052e6] hover:bg-[#007aff] rounded-md cursor-pointer">
                Zəng sifarişi
              </button>
              <Link to={'/'} className="flex flex-row items-center gap-2">
                <FiMail className="text-[16px] text-[#f50809]" />
                <p className="text-[14px] text-[#000000] hover:text-[#f50809] font-normal">info@alinino.az</p>
              </Link>
              <div className="flex flex-row items-start gap-2">
                <FaRegClock className="text-[16px] text-[#f50809]" />
                <p className="text-[14px] text-[#000000] font-normal">
                  Biz həftənin 7 günü, saat 9:00 - <br />20:00 qədər çatdırılma edirik.
                </p>
              </div>
              <div className="flex flex-row items-center gap-1 cursor-pointer">
                <FaWhatsapp onClick={() => handleOpenSocialModal(setShowWhatsapp)} className="text-[20px] text-[#25d366]" />
                <p className="text-[14px] text-[#000000] hover:text-[#25d366] font-normal">WhatsApp</p>
            </div>
              <div className="flex flex-row flex-wrap gap-2">
                <div className="flex items-center justify-center w-[45px] h-[45px] bg-[#f7f8fa] rounded-md cursor-pointer">
                  <FaFacebookF onClick={() => handleOpenSocialModal(setShowFacebook)} className="text-[20px] text-[#3b5998]" />
                </div>
                <div className="flex items-center justify-center w-[45px] h-[45px] bg-[#f7f8fa] rounded-md cursor-pointer">
                  <FaInstagram onClick={() => handleOpenSocialModal(setShowInstagram)} className="text-[24px] text-[#654C9F]" />
                </div>
                <div className="flex items-center justify-center w-[45px] h-[45px] bg-[#f7f8fa] rounded-md cursor-pointer">
                  <FaYoutube onClick={() => handleOpenSocialModal(setShowYoutube)} className="text-[24px] text-[#f50809]" />
                </div>
                <div className="flex items-center justify-center w-[45px] h-[45px] bg-[#f7f8fa] rounded-md cursor-pointer">
                  <FaXTwitter onClick={() => handleOpenSocialModal(setShowX)} className="text-[20px] text-[#000000]" />
                </div>
                <div className="flex items-center justify-center w-[45px] h-[45px] bg-[#f7f8fa] rounded-md cursor-pointer">
                  <FaTelegram onClick={() => handleOpenSocialModal(setShowTelegram)} className="text-[22px] text-[#2ca3d6]" />
                </div>
                <div className="flex items-center justify-center w-[45px] h-[45px] bg-[#f7f8fa] rounded-md cursor-pointer">
                  <FaPinterest onClick={() => handleOpenSocialModal(setShowPinterest)} className="text-[22px] text-[#f50809]" />
                </div>
              </div>
              {showForm && (
                <div
                  className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-[#0a0a0a98] z-[100]"
                  onClick={handleCloseForm}
                >
                  <div
                    className="bg-white w-[440px] h-auto py-4 px-6 rounded-md relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-row items-center justify-between mb-4">
                      <h2 className="text-[16px] text-black font-bold">Geri zəng edin</h2>
                      <button onClick={handleCloseForm}>
                        <RiCloseFill className="text-[20px] text-black font-bold" />
                      </button>
                    </div>
                    <p className="text-[14px] text-black mb-6">
                      Zəhmət olmasa adınızı və əlaqə telefon nömrənizi qeyd edin.
                      Operatorumuz sizə ən qısa zamanda zəng edəcək.
                    </p>
                    <form
                      onSubmit={handleSubmit}
                      action="#"
                      className="space-y-4"
                      data-alert="Müraciətiniz uğurla göndərildi. Ən qısa zamanda sizinlə əlaqə saxlayacağıq."
                      data-form-name="callback"
                    >
                      <input name="feedback[subject]" type="hidden" defaultValue="Geri zəng edin" />
                      <input name="feedback[content]" type="hidden" defaultValue="Geri zəng edin" />
                      <input name="feedback[from]" type="hidden" defaultValue="info@alinino.az" />

                      <div className="flex flex-col">
                        <label className="mb-1">Adınız</label>
                        <input
                          type="text"
                          name="feedback[name]"
                          className="border border-gray-300 outline-none rounded px-3 py-2"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="mb-1">
                          Əlaqə nömrəsi <span className="text-[#dc0708]">*</span>
                        </label>
                        <input
                          type="tel"
                          name="feedback[phone]"
                          className="border border-gray-300 outline-none rounded px-3 py-2"
                          required
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="mb-1">
                          Sizə zəng etmək üçün hanı variant uyğundur? <span className="text-[#dc0708]">*</span>
                        </label>
                        <select
                          name="feedback[call_method]"
                          className="border border-gray-300 outline-none rounded px-3 py-2"
                          required
                        >
                          <option value="Adi zəng">Adi zəng</option>
                          <option value="WhatsApp">WhatsApp</option>
                        </select>
                      </div>

                      <div className="flex justify-center">
                        <ReCAPTCHA
                          sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                          onChange={handleRecaptchaChange}
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full text-[#ffffff] bg-[#0052e6] hover:bg-[#007aff] font-medium py-2 rounded"
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
              )}
              {showWhatsapp && (
                <div
                  className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-[#0a0a0a98] z-[100]"
                  onClick={() => handleCloseSocialModal(setShowWhatsapp)}
                >
                  <div
                    className="bg-white w-[360px] h-auto p-5 rounded-md relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-row items-center justify-end">
                      <button onClick={() => handleCloseSocialModal(setShowWhatsapp)}>
                        <RiCloseFill className="text-[24px] text-black font-bold" />
                      </button>
                    </div>
                    <h2 className="text-[18px] text-black font-bold">WhatsApp</h2>
                    <div onSubmit={handleSubmit} className="flex flex-row items-center justify-between gap-2 p-2 mt-2 border border-gray-200 rounded">
                      <img src={whatsapp} alt="whatsapp" className="w-[100px] h-[100px]" />
                      <p className="text-[14px] text-[#000000] font-normal">Digər cihazdan [sosial] bölməsini açmaq üçün bu QR kodunu skan edin</p>
                    </div>
                    <Link to={'https://api.whatsapp.com/send?phone=994513122440'} className="flex flex-row items-center justify-center w-full gap-2 bg-gray-200 mt-5 py-3 rounded">
                      <FaWhatsapp className="text-[20px] text-[#000000]" />
                      <p className="text-[14px] text-[#000000] font-medium">Aç WhatsApp</p>
                    </Link>
                  </div>
                </div>
              )}
              {showFacebook && (
                <div
                  className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-[#0a0a0a98] z-[100]"
                  onClick={() => handleCloseSocialModal(setShowFacebook)}
                >
                  <div
                    className="bg-white w-[360px] h-auto p-5 rounded-md relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-row items-center justify-end">
                      <button onClick={() => handleCloseSocialModal(setShowFacebook)}>
                        <RiCloseFill className="text-[24px] text-black font-bold" />
                      </button>
                    </div>
                    <h2 className="text-[18px] text-black font-bold">Facebook</h2>
                    <div onSubmit={handleSubmit} className="flex flex-row items-center justify-between gap-2 p-2 mt-2 border border-gray-200 rounded">
                      <img src={facebook} alt="facebook" className="w-[100px] h-[100px]" />
                      <p className="text-[14px] text-[#000000] font-normal">Digər cihazdan [sosial] bölməsini açmaq üçün bu QR kodunu skan edin</p>
                    </div>
                    <Link to={'https://www.facebook.com/aliandnino.azerbaijan'} className="flex flex-row items-center justify-center w-full gap-2 bg-gray-200 mt-5 py-3 rounded">
                      <FaFacebookF className="text-[20px] text-[#000000]" />
                      <p className="text-[14px] text-[#000000] font-medium">Aç Facebook</p>
                    </Link>
                  </div>
                </div>
              )}
              {showInstagram && (
                <div
                  className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-[#0a0a0a98] z-[100]"
                  onClick={() => handleCloseSocialModal(setShowInstagram)}
                >
                  <div
                    className="bg-white w-[360px] h-auto p-5 rounded-md relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-row items-center justify-end">
                      <button onClick={() => handleCloseSocialModal(setShowInstagram)}>
                        <RiCloseFill className="text-[24px] text-black font-bold" />
                      </button>
                    </div>
                    <h2 className="text-[18px] text-black font-bold">Instagram</h2>
                    <div onSubmit={handleSubmit} className="flex flex-row items-center justify-between gap-2 p-2 mt-2 border border-gray-200 rounded">
                      <img src={instagram} alt="instagram" className="w-[100px] h-[100px]" />
                      <p className="text-[14px] text-[#000000] font-normal">Digər cihazdan [sosial] bölməsini açmaq üçün bu QR kodunu skan edin</p>
                    </div>
                    <Link to={'https://www.instagram.com/ali_and_nino/'} className="flex flex-row items-center justify-center w-full gap-2 bg-gray-200 mt-5 py-3 rounded">
                      <FaInstagram className="text-[20px] text-[#000000]" />
                      <p className="text-[14px] text-[#000000] font-medium">Aç Instagram</p>
                    </Link>
                  </div>
                </div>
              )}
              {showYoutube && (
                <div
                  className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-[#0a0a0a98] z-[100]"
                  onClick={() => handleCloseSocialModal(setShowYoutube)}
                >
                  <div
                    className="bg-white w-[360px] h-auto p-5 rounded-md relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-row items-center justify-end">
                      <button onClick={() => handleCloseSocialModal(setShowYoutube)}>
                        <RiCloseFill className="text-[24px] text-black font-bold" />
                      </button>
                    </div>
                    <h2 className="text-[18px] text-black font-bold">YouTube</h2>
                    <div onSubmit={handleSubmit} className="flex flex-row items-center justify-between gap-2 p-2 mt-2 border border-gray-200 rounded">
                      <img src={youtube} alt="youtube" className="w-[100px] h-[100px]" />
                      <p className="text-[14px] text-[#000000] font-normal">Digər cihazdan [sosial] bölməsini açmaq üçün bu QR kodunu skan edin</p>
                    </div>
                    <Link to={'https://www.instagram.com/ali_and_nino/'} className="flex flex-row items-center justify-center w-full gap-2 bg-gray-200 mt-5 py-3 rounded">
                      <FaYoutube className="text-[20px] text-[#000000]" />
                      <p className="text-[14px] text-[#000000] font-medium">Aç YouTube</p>
                    </Link>
                  </div>
                </div>
              )}
              {showX && (
                <div
                  className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-[#0a0a0a98] z-[100]"
                  onClick={() => handleCloseSocialModal(setShowX)}
                >
                  <div
                    className="bg-white w-[360px] h-auto p-5 rounded-md relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-row items-center justify-end">
                      <button onClick={() => handleCloseSocialModal(setShowX)}>
                        <RiCloseFill className="text-[24px] text-black font-bold" />
                      </button>
                    </div>
                    <h2 className="text-[18px] text-black font-bold">X</h2>
                    <div onSubmit={handleSubmit} className="flex flex-row items-center justify-between gap-2 p-2 mt-2 border border-gray-200 rounded">
                      <img src={x} alt="x" className="w-[100px] h-[100px]" />
                      <p className="text-[14px] text-[#000000] font-normal">Digər cihazdan [sosial] bölməsini açmaq üçün bu QR kodunu skan edin</p>
                    </div>
                    <Link to={'https://x.com/Ali_and_Nino'} className="flex flex-row items-center justify-center w-full gap-2 bg-gray-200 mt-5 py-3 rounded">
                      <FaXTwitter className="text-[20px] text-[#000000]" />
                      <p className="text-[14px] text-[#000000] font-medium">Aç X</p>
                    </Link>
                  </div>
                </div>
              )}
              {showTelegram && (
                <div
                  className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-[#0a0a0a98] z-[100]"
                  onClick={() => handleCloseSocialModal(setShowTelegram)}
                >
                  <div
                    className="bg-white w-[360px] h-auto p-5 rounded-md relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-row items-center justify-end">
                      <button onClick={() => handleCloseSocialModal(setShowTelegram)}>
                        <RiCloseFill className="text-[24px] text-black font-bold" />
                      </button>
                    </div>
                    <h2 className="text-[18px] text-black font-bold">Telegram</h2>
                    <div onSubmit={handleSubmit} className="flex flex-row items-center justify-between gap-2 p-2 mt-2 border border-gray-200 rounded">
                      <img src={telegram} alt="telegram" className="w-[100px] h-[100px]" />
                      <p className="text-[14px] text-[#000000] font-normal">Digər cihazdan [sosial] bölməsini açmaq üçün bu QR kodunu skan edin</p>
                    </div>
                    <Link to={'https://t.me/ali_nino'} className="flex flex-row items-center justify-center w-full gap-2 bg-gray-200 mt-5 py-3 rounded">
                      <FaTelegram className="text-[20px] text-[#000000]" />
                      <p className="text-[14px] text-[#000000] font-medium">Aç Telegram</p>
                    </Link>
                  </div>
                </div>
              )}
              {showPinterest && (
                <div
                  className="w-full h-screen fixed top-0 left-0 flex items-center justify-center bg-[#0a0a0a98] z-[100]"
                  onClick={() => handleCloseSocialModal(setShowPinterest)}
                >
                  <div
                    className="bg-white w-[360px] h-auto p-5 rounded-md relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-row items-center justify-end">
                      <button onClick={() => handleCloseSocialModal(setShowPinterest)}>
                        <RiCloseFill className="text-[24px] text-black font-bold" />
                      </button>
                    </div>
                    <h2 className="text-[18px] text-black font-bold">Pinterest</h2>
                    <div onSubmit={handleSubmit} className="flex flex-row items-center justify-between gap-2 p-2 mt-2 border border-gray-200 rounded">
                      <img src={pinterest} alt="pinterest" className="w-[100px] h-[100px]" />
                      <p className="text-[14px] text-[#000000] font-normal">Digər cihazdan [sosial] bölməsini açmaq üçün bu QR kodunu skan edin</p>
                    </div>
                    <Link to={'https://www.pinterest.com/ali_and_nino/'} className="flex flex-row items-center justify-center w-full gap-2 bg-gray-200 mt-5 py-3 rounded">
                      <FaPinterest className="text-[20px] text-[#000000]" />
                      <p className="text-[14px] text-[#000000] font-medium">Aç Pinterest</p>
                    </Link>
                  </div>
                </div>
              )}
            </div>
        </div>
      </div>
      <div className={`fixed top-0 left-0 w-3/4 max-w-xs h-full bg-[#ffffff] shadow-lg transform transition-transform duration-300 ease-in-out z-[70]
          ${isUserOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between w-full h-[50px] p-4 bg-[#f9fafb]">
          <h2 className="text-[18px] font-semibold text-[#000000]">Şəxsi kabinet</h2>
          <button onClick={handleCloseUser} className="text-2xl text-black" aria-label="Close user sidebar">
            <RiCloseFill />
          </button>
        </div>      
        <div className="p-4 flex flex-col gap-5">
          <div className="flex items-center justify-center">
            <FaRegUser className="text-[50px] text-[#f5f5f5]" />
          </div>
          <div className="flex flex-row gap-3">
            <Link to={'/'} className="flex items-center justify-center w-full h-[34px] px-[15px] text-[14px] text-[#ffffff] bg-[#f50809] rounded-md">
              Avtorizasiya
            </Link>
            <Link to={'/'} className="flex items-center justify-center w-full h-[34px] px-[15px] text-[14px] text-[#ffffff] bg-[#0052e6] hover:bg-[#007aff] rounded-md">
              Qeydiyyat
            </Link>
          </div>
        </div>
      </div>
      <div className={`fixed top-0 left-0 w-3/4 max-w-xs h-full bg-[#ffffff] shadow-lg transform transition-transform duration-300 ease-in-out z-[70]
          ${isFavoriteOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between w-full h-[50px] p-4 bg-[#f9fafb]">
          <h2 className="text-[18px] font-semibold text-[#000000]">Sevimlilər</h2>
          <button onClick={handleCloseFavorite} className="text-2xl text-black" aria-label="Close user sidebar">
            <RiCloseFill />
          </button>
        </div>      
        <div className="p-4 flex flex-col gap-5">
          <div className="flex items-center justify-center">
            <FaRegHeart className="text-[50px] text-[#f5f5f5]" />
          </div>
          <div className="flex flex-row items-center justify-center">
            <p className="text-[14px] text-[#9d9d9d]">Sevimliləriniz hazırda boşdur</p>
          </div>
        </div>
      </div>
      <div className={`fixed top-0 left-0 w-3/4 max-w-xs h-full bg-[#ffffff] shadow-lg transform transition-transform duration-300 ease-in-out z-[70]
          ${isCartOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between w-full h-[50px] p-4 bg-[#f9fafb]">
          <h2 className="text-[18px] font-semibold text-[#000000]">Səbət </h2>
          <button onClick={handleCloseCart} className="text-2xl text-black" aria-label="Close user sidebar">
            <RiCloseFill />
          </button>
        </div>      
        <div className="p-4 flex flex-col gap-5">
          <div className="flex items-center justify-center">
            <BsCart3 className="text-[50px] text-[#f5f5f5]" />
          </div>
          <div className="flex flex-row items-center justify-center">
            <p className="text-[14px] text-[#9d9d9d]">Səbətiniz hələ ki boşdur</p>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-[#0a0a0a98] z-[60]"
          onClick={handleCloseMenu}
        ></div>
      )}
      {isSearchOpen && (
        <div
          className="fixed inset-0 bg-[#0a0a0a98] z-[60]"
          onClick={handleCloseSearch}
          aria-hidden="true"
        ></div>
      )}
      {isContactOpen && (
        <div
          className="fixed inset-0 bg-[#0a0a0a98] z-[60]"
          onClick={handleCloseContact}
          aria-hidden="true"
        ></div>
      )}
      {isUserOpen && (
        <div
          className="fixed inset-0 bg-[#0a0a0a98] z-[60]"
          onClick={handleCloseUser}
          aria-hidden="true"
        ></div>
      )}
      {isFavoriteOpen && (
        <div
          className="fixed inset-0 bg-[#0a0a0a98] z-[60]"
          onClick={handleCloseFavorite}
          aria-hidden="true"
        ></div>
      )}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-[#0a0a0a98] z-[60]"
          onClick={handleCloseCart}
          aria-hidden="true"
        ></div>
      )}
    </>
  )
}

export default Header