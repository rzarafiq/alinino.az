import { useEffect, useState, useRef, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import { FaRegStar, FaRegCommentDots, FaRegHeart, FaHeart, FaMinus, FaPlus, FaWhatsapp, FaChevronUp, FaChevronDown, FaCheck, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { RiCloseFill } from "react-icons/ri";
import { BsCart3 } from "react-icons/bs";
import { GoArrowLeft, GoArrowRight, GoDotFill } from "react-icons/go";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ReCAPTCHA from "react-google-recaptcha";
import { scrollTop } from "../../utility/scrollTop";

const countrys = [
  { code: "AL", name: "Albaniya" },
  { code: "DE", name: "Almaniya" },
  { code: "US", name: "Amerika Birləşmiş Ştatları" },
  { code: "UM", name: "Amerika Birləşmiş Ştatlarının Kiçik Sakit Okean adaları" },
  { code: "AD", name: "Andorra" },
  { code: "AI", name: "Anguilla" },
  { code: "AO", name: "Anqola" },
  { code: "AR", name: "Argentina" },
  { code: "AW", name: "Aruba" },
  { code: "AU", name: "Avstraliya" },
  { code: "AT", name: "Avstriya" },
  { code: "AZ", name: "Azərbaycan" },
  { code: "BS", name: "Baham adaları" },
  { code: "BD", name: "Banqladeş" },
  { code: "BB", name: "Barbados" },
  { code: "BY", name: "Belarusiya" },
  { code: "BZ", name: "Beliz" },
  { code: "BE", name: "Belçika" },
  { code: "BJ", name: "Benin" },
  { code: "BM", name: "Bermud adaları" },
  { code: "AE", name: "Birləşmiş Ərəb Əmirlikləri" },
  { code: "BO", name: "Boliviya" },
  { code: "BG", name: "Bolqarıstan" },
  { code: "BA", name: "Bosniya və Herseqovina" },
  { code: "BW", name: "Botsvana" },
  { code: "BR", name: "Braziliya" },
  { code: "IO", name: "Britaniya Hind okeanı ərazisi" },
  { code: "BN", name: "Bruney Darussalam" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "BT", name: "Butan" },
  { code: "BV", name: "Buvet adası" },
  { code: "GB", name: "Böyük Britaniya" },
  { code: "BH", name: "Bəhreyn" },
  { code: "JE", name: "Cersi" },
  { code: "DJ", name: "Cibuti" },
  { code: "ZA", name: "Cənubi Afrika" },
  { code: "GS", name: "Cənubi Georgiya və Cənubi Sendviç adaları" },
  { code: "KR", name: "Cənubi Koreya" },
  { code: "DK", name: "Danimarka" },
  { code: "DO", name: "Dominik Respublikası" },
  { code: "DM", name: "Dominika" },
  { code: "ET", name: "Efiopiya" },
  { code: "EC", name: "Ekvador" },
  { code: "GQ", name: "Ekvatorial Qvineya" },
  { code: "SV", name: "El Salvador" },
  { code: "AX", name: "Eland adaları" },
  { code: "ER", name: "Eritreya" },
  { code: "EE", name: "Estoniya" },
  { code: "SZ", name: "Esvatini Krallığı" },
  { code: "FO", name: "Farer adaları" },
  { code: "FJ", name: "Fici" },
  { code: "CI", name: "Fil Dişi Sahili" },
  { code: "PH", name: "Filippin" },
  { code: "FI", name: "Finlandiya" },
  { code: "FK", name: "Folklend adaları (Malvin adaları)" },
  { code: "FR", name: "Fransa" },
  { code: "TF", name: "Fransanın cənub əraziləri" },
  { code: "PF", name: "Fransız Polineziyası" },
  { code: "GF", name: "Fransız Qvianası" },
  { code: "GG", name: "Gernsey" },
  { code: "GI", name: "Gibraltar (Böyük Britaniya)" },
  { code: "GE", name: "Gürcüstan" },
  { code: "HT", name: "Haiti" },
  { code: "HM", name: "Heard adası və McDonald adaları" },
  { code: "IN", name: "Hindistan" },
  { code: "AN", name: "Hollandiya Antilləri" },
  { code: "HN", name: "Honduras" },
  { code: "HK", name: "Honq Konq" },
  { code: "CV", name: "Kabo Verde" },
  { code: "KH", name: "Kamboca" },
  { code: "CM", name: "Kamerun" },
  { code: "CA", name: "Kanada" },
  { code: "KY", name: "Kayman adaları" },
  { code: "KE", name: "Keniya" },
  { code: "CY", name: "Kipr" },
  { code: "KI", name: "Kiribati" },
  { code: "CC", name: "Kokos (Kiling) adaları" },
  { code: "CO", name: "Kolumbiya" },
  { code: "KM", name: "Komor adaları" },
  { code: "CG", name: "Konqo" },
  { code: "CD", name: "Konqo Demokratik Respublikası" },
  { code: "CR", name: "Kosta Rika" },
  { code: "CU", name: "Kuba" },
  { code: "CK", name: "Kuk adaları" },
  { code: "KW", name: "Küveyt" },
  { code: "LA", name: "Laos" },
  { code: "LV", name: "Latviya" },
  { code: "LS", name: "Lesoto" },
  { code: "LR", name: "Liberiya" },
  { code: "LT", name: "Litva" },
  { code: "LB", name: "Livan" },
  { code: "LY", name: "Liviya Ərəb Cəmahiri" },
  { code: "LI", name: "Lixtenşteyn" },
  { code: "LU", name: "Lüksemburq" },
  { code: "HU", name: "Macarıstan" },
  { code: "MG", name: "Madaqaskar" },
  { code: "MK", name: "Makedoniya Respublikası" },
  { code: "MW", name: "Malavi" },
  { code: "MY", name: "Malaziya" },
  { code: "MV", name: "Maldivlər" },
  { code: "ML", name: "Mali" },
  { code: "MT", name: "Malta" },
  { code: "MQ", name: "Martinika" },
  { code: "MH", name: "Marşal adaları" },
  { code: "MU", name: "Mavrikiy" },
  { code: "MR", name: "Mavritaniya" },
  { code: "YT", name: "Mayotte" },
  { code: "MX", name: "Meksika" },
  { code: "IM", name: "Men adası" },
  { code: "FM", name: "Mikroneziya, Federasiya Ştatları" },
  { code: "CX", name: "Milad adası" },
  { code: "EG", name: "Misir" },
  { code: "MD", name: "Moldova Respublikası" },
  { code: "MC", name: "Monako" },
  { code: "MN", name: "Monqolustan" },
  { code: "ME", name: "Monteneqro" },
  { code: "MS", name: "Montserrat" },
  { code: "MZ", name: "Mozambik" },
  { code: "MM", name: "Myanma" },
  { code: "LC", name: "Müqəddəs Lusiya" },
  { code: "SH", name: "Müqəddəs Yelena" },
  { code: "MA", name: "Mərakeş" },
  { code: "CF", name: "Mərkəzi Afrika Respublikası" },
  { code: "NA", name: "Namibiya" },
  { code: "NR", name: "Nauru" },
  { code: "NP", name: "Nepal" },
  { code: "NL", name: "Niderland" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigeriya" },
  { code: "NI", name: "Nikaraqua" },
  { code: "NU", name: "Niue" },
  { code: "NF", name: "Norfolk adası" },
  { code: "NO", name: "Norveç" },
  { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" },
  { code: "PW", name: "Palau" },
  { code: "PA", name: "Panama" },
  { code: "VA", name: "Papal See (Ştat - Vatikan)" },
  { code: "PG", name: "Papua Yeni Qvineya" },
  { code: "PY", name: "Paraqvay" },
  { code: "PE", name: "Peru" },
  { code: "PN", name: "Pitkern" },
  { code: "PL", name: "Polşa" },
  { code: "PT", name: "Portuqaliya" },
  { code: "PR", name: "Puerto Riko" },
  { code: "GA", name: "Qabon" },
  { code: "GM", name: "Qambiya" },
  { code: "GH", name: "Qana" },
  { code: "GY", name: "Qayana" },
  { code: "KZ", name: "Qazaxıstan" },
  { code: "GD", name: "Qrenada" },
  { code: "GL", name: "Qrenlandiya" },
  { code: "GU", name: "Quam" },
  { code: "GP", name: "Qvadelupa" },
  { code: "GT", name: "Qvatemala" },
  { code: "GN", name: "Qvineya" },
  { code: "GW", name: "Qvineya-Bisau" },
  { code: "KG", name: "Qırğızıstan" },
  { code: "EH", name: "Qərbi Sahara" },
  { code: "QA", name: "Qətər" },
  { code: "RE", name: "Reünyon" },
  { code: "RW", name: "Ruanda" },
  { code: "RO", name: "Ruminiya" },
  { code: "RU", name: "Rusiya" },
  { code: "KN", name: "Saint Kitts və Nevis" },
  { code: "PM", name: "Saint Pierre və Miquelon" },
  { code: "WS", name: "Samoa" },
  { code: "SM", name: "San Marino" },
  { code: "ST", name: "Sao Tome və Prinsipi" },
  { code: "SN", name: "Seneqal" },
  { code: "VC", name: "Sent Vinsent və Qrenadinlər" },
  { code: "RS", name: "Serbiya" },
  { code: "SC", name: "Seyşel adaları" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SG", name: "Sinqapur" },
  { code: "SK", name: "Slovakiya" },
  { code: "SI", name: "Sloveniya" },
  { code: "SB", name: "Solomon adaları" },
  { code: "SO", name: "Somali" },
  { code: "SJ", name: "Spitsbergen və Jan Mayen" },
  { code: "SD", name: "Sudan" },
  { code: "SR", name: "Surinam" },
  { code: "SY", name: "Suriya Ərəb Respublikası" },
  { code: "SA", name: "Səudiyyə Ərəbistanı" },
  { code: "TJ", name: "Tacikistan" },
  { code: "TZ", name: "Tanzaniya, Birləşmiş Respublikası" },
  { code: "TH", name: "Tayland" },
  { code: "TW", name: "Tayvan (Çin)" },
  { code: "TK", name: "Tokelau" },
  { code: "TO", name: "Tonqa" },
  { code: "TG", name: "Toqo" },
  { code: "TT", name: "Trinidad və Tobaqo" },
  { code: "TN", name: "Tunis" },
  { code: "TC", name: "Turks və Kaykos adaları" },
  { code: "TV", name: "Tuvalu" },
  { code: "TR", name: "Türkiyə" },
  { code: "TM", name: "Türkmənistan" },
  { code: "UA", name: "Ukraniya" },
  { code: "WF", name: "Uollis və Futuna" },
  { code: "UG", name: "Uqanda" },
  { code: "UY", name: "Uruqvay" },
  { code: "VU", name: "Vanuatu" },
  { code: "VE", name: "Venesuela" },
  { code: "VI", name: "Vircin Adaları, ABŞ" },
  { code: "VG", name: "Virgin Adaları, Britaniya" },
  { code: "VN", name: "Vyetnam" },
  { code: "HR", name: "Xorvatiya" },
  { code: "JM", name: "Yamayka" },
  { code: "JP", name: "Yaponiya" },
  { code: "NC", name: "Yeni Kaledoniya" },
  { code: "NZ", name: "Yeni Zellandiya" },
  { code: "GR", name: "Yunanıstan" },
  { code: "YE", name: "Yəmən" },
  { code: "ZM", name: "Zambiya" },
  { code: "ZW", name: "Zimbabve" },
  { code: "TD", name: "Çad" },
  { code: "CZ", name: "Çexiya" },
  { code: "CL", name: "Çili" },
  { code: "CN", name: "Çin" },
  { code: "UZ", name: "Özbəkistan" },
  { code: "ID", name: "İndoneziya" },
  { code: "JO", name: "İordaniya" },
  { code: "IR", name: "İran İslam Respublikası" },
  { code: "IQ", name: "İraq" },
  { code: "IE", name: "İrlandiya" },
  { code: "IS", name: "İslandiya" },
  { code: "ES", name: "İspaniya" },
  { code: "IL", name: "İsrail" },
  { code: "SE", name: "İsveç" },
  { code: "CH", name: "İsveçrə" },
  { code: "IT", name: "İtaliya" },
  { code: "KP", name: "Şimali Koreya" },
  { code: "MP", name: "Şimali Mariana adaları" },
  { code: "LK", name: "Şri Lanka" },
  { code: "TL", name: "Şərqi Timor" },
  { code: "DZ", name: "Əlcəzair" },
  { code: "MO", name: "Макао" },
  { code: "PS", name: "Палестинская территория, оккупированная" }
];

const citys = [
  { code: "BA", name: "Bakı" },
  { code: "GA", name: "Gəncə" },
  { code: "NX", name: "Naxçıvan" },
  { code: "SM", name: "Sumqayıt" },
  { code: "LN", name: "Lənkəran" },
  { code: "MG", name: "Mingəçevir" },
  { code: "NF", name: "Naftalan" },
  { code: "XK", name: "Xankəndi" },
  { code: "SK", name: "Şəki" },
  { code: "SR", name: "Şirvan" },
  { code: "YV", name: "Yevlax" },
  { code: "AB", name: "Abşeron rayonu (Xırdalan şəhəri)" },
  { code: "AC", name: "Ağcabədi rayonu" },
  { code: "AD", name: "Ağdam rayonu" },
  { code: "AS", name: "Ağdaş rayonu" },
  { code: "AR", name: "Ağdərə rayonu" },
  { code: "AF", name: "Ağstafa rayonu" },
  { code: "AU", name: "Ağsu rayonu" },
  { code: "AT", name: "Astara rayonu" },
  { code: "BB", name: "Babək rayonu" },
  { code: "BK", name: "Balakən rayonu" },
  { code: "BY", name: "Beyləqan rayonu" },
  { code: "BR", name: "Bərdə rayonu" },
  { code: "BS", name: "Biləsuvar rayonu" },
  { code: "CB", name: "Cəbrayıl rayonu" },
  { code: "CL", name: "Cəlilabad rayonu" },
  { code: "CU", name: "Culfa rayonu" },
  { code: "DS", name: "Daşkəsən rayonu" },
  { code: "FZ", name: "Füzuli rayonu" },
  { code: "GB", name: "Gədəbəy rayonu" },
  { code: "GR", name: "Goranboy rayonu" },
  { code: "GY", name: "Göyçay rayonu" },
  { code: "GG", name: "Göygöl rayonu" },
  { code: "HQ", name: "Hacıqabul rayonu" },
  { code: "XC", name: "Xaçmaz rayonu" },
  { code: "XZ", name: "Xızı rayonu" },
  { code: "XO", name: "Xocalı rayonu" },
  { code: "XV", name: "Xocavənd rayonu" },
  { code: "IM", name: "İmişli rayonu" },
  { code: "IS", name: "İsmayıllı rayonu" },
  { code: "KB", name: "Kəlbəcər rayonu" },
  { code: "KG", name: "Kəngərli rayonu (Qıvraq qəsəbəsi)" },
  { code: "KD", name: "Kürdəmir rayonu" },
  { code: "QX", name: "Qax rayonu" },
  { code: "QZ", name: "Qazax rayonu" },
  { code: "QB", name: "Qəbələ rayonu" },
  { code: "QS", name: "Qobustan rayonu" },
  { code: "QA", name: "Quba rayonu" },
  { code: "QL", name: "Qubadlı rayonu" },
  { code: "QU", name: "Qusar rayonu" },
  { code: "LC", name: "Laçın rayonu" },
  { code: "LR", name: "Lerik rayonu" },
  { code: "MS", name: "Masallı rayonu" },
  { code: "NC", name: "Neftçala rayonu" },
  { code: "OG", name: "Oğuz rayonu" },
  { code: "OR", name: "Ordubad rayonu" },
  { code: "ST", name: "Saatlı rayonu" },
  { code: "SB", name: "Sabirabad rayonu" },
  { code: "SL", name: "Salyan rayonu" },
  { code: "SX", name: "Samux rayonu" },
  { code: "SD", name: "Sədərək rayonu (Heydərabad qəsəbəsi)" },
  { code: "SZ", name: "Siyəzən rayonu" },
  { code: "SH", name: "Şabran rayonu" },
  { code: "SBZ", name: "Şahbuz rayonu" },
  { code: "SMX", name: "Şamaxı rayonu" },
  { code: "SMK", name: "Şəmkir rayonu" },
  { code: "SRU", name: "Şərur rayonu" },
  { code: "SUS", name: "Şuşa rayonu" },
  { code: "TR", name: "Tərtər rayonu" },
  { code: "TV", name: "Tovuz rayonu" },
  { code: "UC", name: "Ucar rayonu" },
  { code: "YD", name: "Yardımlı rayonu" },
  { code: "ZQ", name: "Zaqatala rayonu" },
  { code: "ZN", name: "Zəngilan rayonu" },
  { code: "ZR", name: "Zərdab rayonu" },
];

const weekDays = ['BE', 'ÇA', 'Çə', 'CA', 'Cü', 'Şə', 'Bz'];
const monthNames = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'];

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
  const [showOrderForm, setShowOrderForm] = useState(false);
  const location = useLocation();
  const [selectedCountry, setSelectedCountry] = useState("AZ");
  const [selectedCity, setSelectedCity] = useState("BA");
  const [isCityInputDisabled, setIsCityInputDisabled] = useState(false);
  const [checked, setChecked] = useState(false);
  const [selectedOption, setSelectedOption] = useState("option1");
  const [paymentOption, setPaymentOption] = useState("option1"); 
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

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



  // Ölkə dəyişəndə şəhər seçimini sıfırlayır və input statusunu yeniləyir
  useEffect(() => {
    if (selectedCountry === 'AZ') {
      setIsCityInputDisabled(false);
    } else {
      setIsCityInputDisabled(true);
      setSelectedCity('');
    }
  }, [selectedCountry]);

    // Kalendar 
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(tomorrow);
    const [currentMonth, setCurrentMonth] = useState(tomorrow.getMonth());
    const [currentYear, setCurrentYear] = useState(tomorrow.getFullYear());
    const datePickerRef = useRef(null);

    const toggleDatePicker = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [datePickerRef]);

    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const generateDays = (year, month) => {
        const firstDay = getFirstDayOfMonth(year, month);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const days = [];
        const startDay = firstDay === 0 ? 6 : firstDay - 1;

        const prevMonthDays = new Date(year, month, 0).getDate();
        for (let i = startDay - 1; i >= 0; i--) {
            days.push({
                day: prevMonthDays - i,
                month: month - 1,
                isCurrentMonth: false
            });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                day: i,
                month: month,
                isCurrentMonth: true
            });
        }

        return days;
    };

    const goToNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const goToPrevMonth = () => {
        const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        if (newYear > today.getFullYear() || (newYear === today.getFullYear() && newMonth >= today.getMonth())) {
            setCurrentMonth(newMonth);
            setCurrentYear(newYear);
        }
    };

    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;

    const isPrevDisabled = currentMonth === today.getMonth() && currentYear === today.getFullYear();

    const daysOfCurrentMonth = generateDays(currentYear, currentMonth);
    const daysOfNextMonth = generateDays(nextMonthYear, nextMonth);

    const handleDayClick = (day, month) => {
        const clickedDate = new Date(currentYear, month, day);
        if (clickedDate.setHours(0,0,0,0) >= today.setHours(0,0,0,0)) {
            setSelectedDate(clickedDate);
            setIsOpen(false);
        }
    };


  // URL-dən `tab` parametrini yoxlamaq və formun görünməsinə nəzarət etmək
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'order') {
      setShowOrderForm(true);
    } else {
      setShowOrderForm(false);
    }
  }, [location.search]);

  // Sifariş formunu göstərmək və URL-i yeniləmək
  const handleShowOrderForm = () => {
    setShowOrderForm(true);
    window.history.pushState(null, '', '/cart?tab=order');
  };

  // Sifariş formunu gizlətmək və URL-i yeniləmək
  const handleHideOrderForm = () => {
    setShowOrderForm(false);
    window.history.pushState(null, '', '/cart');
  };

  // Seçilmiş xidmətə əsasən çatdırılma qiymətini qaytaran funksiya
  const getDeliveryPrice = () => {
    switch (selectedOption) {
      case 'option1':
        return '5.00 AZN';
      case 'option2':
        return '7.00 AZN';
      case 'option3':
        return '10.00 AZN';
      case 'option4':
        return '4.50 AZN';
      case 'option5':
        return '0.50 - 2.50 AZN';
      default:
        return '0.00 AZN';
    }
  };

  const totalPrice = parseFloat(totalAmount) + parseFloat(getDeliveryPrice());
  
  const toggleContent = () => {
      setIsCartOpen(!isCartOpen);
  };

  const scrollRef = useRef(null);

  const showRecoveryForm = () => {
    setIsLoginOpen(false);
  };

  const showRegistrationForm = () => {
    setIsLoginOpen(false);
  };

  const closeLoginModal = () => {
  setIsLoginOpen(false);
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
            <p className="px-1 font-medium cursor-default">
              {showOrderForm ? "Sifarişin hazırlanması" : "Səbət"}
            </p>
          </li>
        </ol>
      </div>

      {/* Başlıq */}
      <div className="flex flex-row items-center justify-between max-w-[1428px] mx-auto h-full px-2 md:px-10 lg:px-[64px] mt-5">
        <div
          className={`w-[920px] ${
            !showOrderForm && cartProducts.length > 0
              ? "border-b border-[#dddddd] pb-4"
              : ""
          }`}
        >
          <h2 className="text-[28px] md:text-[32px]">
            {showOrderForm ? "Sifarişin hazırlanması" : "Səbət"}
          </h2>
        </div>

        {!showOrderForm && cartProducts.length > 0 && (
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
            <span className="text-[14px] border-b border-dashed hidden sm:inline">
              Təmizlə
            </span>
          </div>
        )}
      </div>

      {/* Səbət və Sifariş Formu */}
      <div className="flex flex-col gap-4 max-w-[1428px] mx-auto h-full px-2 md:px-10 lg:px-[64px] overflow-y-auto">
        
        {/* Səbət siyahısı (yalnız showOrderForm DEYİLSƏ görünür) */}
        {!showOrderForm && cartProducts.length === 0 ? (
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
        ) : !showOrderForm ? (
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
                <button
                  onClick={handleShowOrderForm}
                  className="w-full h-[50px] bg-[#f50809] text-white text-[18px] py-2 mt-3 rounded-md hover:bg-[#dc2626] transition"
                >
                  Sifariş edin
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Sifarişin Hazırlanması Formu (yalnız showOrderForm TRUE-dursa görünür) */}
        {showOrderForm && (
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 my-5">
            {/* Səbət (mobil: yuxarı, desktop: sağ) */}
            <div className="flex flex-col w-full md:w-1/2 order-1 md:order-2">
              {/* Mobil görünüş üçün Yığcam görünüş */}
              <div
                  className={`flex justify-between items-center md:hidden cursor-pointer bg-[#eeeeee] p-4 ${isCartOpen ? 'rounded-t-md' : 'rounded-md'}`}
                  onClick={toggleContent}
              >
                  <div className="flex items-center gap-2">
                      <span className="text-[16px] text-[#000000] font-normal">Sizin sifarişiniz</span>
                      <FaChevronDown className="text-sm" />
                  </div>
                  <span className="text-[16px] text-[#000000] font-semibold">{totalPrice} AZN</span>
              </div>

              {/* Açıq vəziyyətdə görünən məzmun */}
              <div className={`flex-col gap-4 w-full border-b border-r border-l border-[#dddddd] rounded-b-md p-4 ${isCartOpen ? 'flex' : 'hidden'} md:flex md:w-full md:border md:rounded-md`}>
                {cartProducts.map((product) => {
                    const quantity = product.quantity || 1;
                    const unitPrice = product.variants?.[0]?.price || 0;
                    return (
                        <div key={product.id} className="flex items-center gap-3 w-full">
                            <Link to={`/products/${product.permalink}`}>
                                <img
                                    src={product.first_image?.medium_url}
                                    alt={product.title}
                                    className="w-10 h-16 object-cover rounded"
                                />
                            </Link>
                            <div className="flex flex-col flex-1">
                                <Link
                                    to={`/products/${product.permalink}`}
                                    className="text-[14px] md:text-[16px] text-[#000000] hover:text-[#f50809] transition-colors duration-300 font-normal line-clamp-2"
                                >
                                    {product.title}
                                </Link>
                            </div>
                            <span className="text-[14px] md:text-[16px] text-[#000000] font-semibold whitespace-nowrap">
                                {quantity} × {unitPrice} AZN
                            </span>
                        </div>
                    );
                })}

                {cartProducts.length > 0 && (
                    <>
                        <div className="flex flex-col gap-3 bg-[#ffffff] border-y border-[#dddddd] py-4 mt-3">
                            <p className="text-[14px] md:text-[16px] text-[#000000] font-normal">
                                Promokod və ya endirim kuponu (Hər sifarişdə yalnız bir promokod istifadə etmək mümkündür)
                            </p>
                            <div className="flex flex-row items-center gap-2 w-full">
                              <div className="relative flex-1">
                                  <input
                                      type="text"
                                      placeholder="Kuponun kodunu qeyd edin"
                                      className="border border-[#dddddd] px-4 py-2.5 rounded-md w-full outline-none text-[14px]"
                                  />
                              </div>
                              <p className="text-[12px] md:text-[14px] text-[#000000] hover:text-[#f50809] font-normal border-b border-dashed border-[#000000] hover:border-[#f50809] cursor-pointer flex-shrink-0">
                                  Qəbul etmək
                              </p>
                            </div>
                            <div className="flex flex-col mt-2">
                                <div className="flex justify-between text-[14px] md:text-[16px] text-[#000000]">
                                    <span>Məhsullar üzrə məbləğ</span>
                                    <span className="font-medium">{totalAmount} AZN</span>
                                </div>
                                <div className="flex justify-between text-[14px] md:text-[16px] text-[#000000] mt-1">
                                    <span>Çatdırılma xərcləri</span>
                                    <span className="font-medium">{getDeliveryPrice()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-[16px] md:text-[20px] text-[#000000] font-normal">NƏTİCƏ:</p>
                            <span className="text-[16px] md:text-[20px] text-[#000000] font-semibold">{totalPrice} AZN</span>
                        </div>
                    </>
                )}
              </div>
            </div>

            {/* Sifariş formu (mobil: aşağı, desktop: sol) */}
            <div className="flex flex-col w-full md:w-1/2 order-2 md:order-1">
              {/* Giriş düyməsi */}
              <div className="flex flex-col gap-1 mb-4">
                <span className="text-[14px] text-[#999999]">Məsələn: +994 111-11-11</span>
                <button onClick={() => setIsLoginOpen(true)} className="w-full lg:w-[410px] py-3 text-[16px] md:text-[18px] text-[#ffffff] bg-[#dc0708] hover:bg-[#1a6bff] rounded-md transition-colors duration-300">
                  Qeydiyyatdan keçmiş alıcılar üçün daxil olun
                </button>
              </div>

              {/* Çatdırılma təfərrüatları */}
              <div className="flex flex-col gap-4 mb-6">
                <h4 className="text-[16px] md:text-[22px] text-[#000000] font-medium">Çatdırılma xidməti təfərrüatları:</h4>
                <label htmlFor="fullname" className="flex flex-col w-full">
                  <p className="text-[14px] md:text-[16px] text-[#000000] mb-1">
                    Şəxsi əlaqə (Adı, soyadı, atasının adı) <span className="text-[#f50809]">*</span>
                  </p>
                  <input
                    type="text"
                    id="fullname"
                    className="w-full p-2 border border-[#dddddd] rounded-md outline-none text-[14px]"
                  />
                </label>
                <label htmlFor="reg-email" className="flex flex-col w-full">
                  <p className="text-[14px] md:text-[16px] text-[#000000] mb-1">
                    Elektron ünvan <span className="text-[#f50809]">*</span>
                  </p>
                  <input
                    type="email"
                    id="reg-email"
                    className="w-full p-2 border border-[#dddddd] rounded-md outline-none text-[14px]"
                  />
                </label>
                <label htmlFor="phone" className="flex flex-col w-full">
                  <p className="text-[14px] md:text-[16px] text-[#000000] mb-1">
                    Əlaqə nömrəsi (sifarişin detallarını dəqiqləşdirmək üçün) <span className="text-[#f50809]">*</span>
                  </p>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full p-2 border border-[#dddddd] rounded-md outline-none text-[14px]"
                  />
                </label>
              </div>

              {/* Çatdırılma */}
              <div className="flex flex-col gap-5 mb-6">
                <h4 className="text-[16px] md:text-[22px] text-[#000000] font-medium">Çatdırılma</h4>
                <label htmlFor="country" className="flex flex-col w-full">
                  <p className="text-[14px] md:text-[16px] text-[#000000] mb-1">
                      Ölkə <span className="text-[#f50809]">*</span>
                  </p>
                  <select
                      id="country"
                      name="shipping_address[country]"
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      ref={scrollRef}
                      className="w-full p-3 border border-[#dddddd] rounded-md outline-none text-[12px] md:text-[16px] overflow-y-auto custom-scrollbar"
                  >
                      {countrys.map((country) => (
                          <option key={country.code} value={country.code}>
                              {country.name}
                          </option>
                      ))}
                  </select>
                </label>           
                <label htmlFor="city" className="flex flex-col w-full">
                  <p className="text-[14px] md:text-[16px] text-[#000000] mb-1">
                    Şəhər <span className="text-[#f50809]">*</span>
                  </p>
                  {selectedCountry === 'AZ' ? (
                    <select
                      id="city"
                      name="shipping_address[city]"
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full p-3 border border-[#dddddd] rounded-md outline-none text-[12px] md:text-[16px] overflow-y-auto custom-scrollbar"
                    >
                      {citys.map((city) => (
                        <option key={city.code} value={city.code}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      id="city"
                      name="shipping_address[city]"
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      placeholder="Şəhəri yazın"
                      className="w-full p-3 border border-[#dddddd] rounded-md outline-none text-[12px] md:text-[16px] overflow-y-auto"
                    />
                  )}
                </label>
                <label htmlFor="address" className="flex flex-col w-full">
                  <span className="text-[14px] md:text-[16px] text-[#000000] mb-1">Ünvan</span>
                  <textarea
                    id="address"
                    name="address"
                    placeholder="Küçə, ev, mərtəbə"
                    className="w-full h-16 p-2 border border-[#dddddd] rounded-md outline-none resize-none text-[14px]"
                  ></textarea>
                </label>
              </div>

              {/* Alıcı */}
              <div className="flex flex-col gap-5 mb-6">
                <h4 className="text-[16px] md:text-[22px] text-[#000000] font-medium">Alıcı</h4>
                <label htmlFor="recipient-phone" className="flex flex-col w-full mb-3">
                  <p className="text-[14px] md:text-[16px] text-[#000000] mb-1">Sifarişi alan şəxsin nömrəsi</p>
                  <input
                    type="tel"
                    id="recipient-phone"
                    className="w-full p-3 border border-[#dddddd] rounded-md outline-none text-[14px]"
                  />
                  <span className="text-[14px] text-[#999999] mt-1">
                    Lütfən, sifarişi təhvil alacaq şəxsin nömrəsini qeyd edin
                  </span>
                </label>
  
                <div className="flex flex-col w-full items-start cursor-pointer select-none">
                  <div className="flex gap-2">
                      <div
                          onClick={() => setChecked(!checked)}
                          className="relative w-4 h-4 md:w-5 md:h-5 border-2 border-[#000000] flex items-center justify-center overflow-hidden flex-shrink-0 mt-1"
                      >
                          <div className="absolute inset-0">
                              <div className={`absolute top-0 left-0 h-full w-0 bg-[#000000] transition-all duration-300 ${checked ? "w-1/2" : ""}`}></div>
                              <div className={`absolute top-0 right-0 h-full w-0 bg-[#000000] transition-all duration-300 ${checked ? "w-1/2" : ""}`}></div>
                              <div className={`absolute top-0 left-0 w-full h-0 bg-[#000000] transition-all duration-300 ${checked ? "h-1/2" : ""}`}></div>
                              <div className={`absolute bottom-0 left-0 w-full h-0 bg-[#000000] transition-all duration-300 ${checked ? "h-1/2" : ""}`}></div>
                          </div>
                          {checked && <FaCheck className="text-white text-[8px] md:text-[10px] z-10" />}
                      </div>

                      <div className="flex flex-col">
                          <p
                              className="text-[14px] md:text-[16px] text-[#000000] mb-1"
                              onClick={() => setChecked(!checked)}
                          >
                              Qeydiyyatdan keçmək istərdiniz?
                          </p>
                          <span
                              className="text-[14px] md:text-[16px] text-[#999999]"
                              onClick={() => setChecked(!checked)}
                          >
                              Siz sifariş tarixçəsini görə biləcək, yeniliklər və endirimlər haqqında asanlıqla məlumat ala biləcəksiniz.
                          </span>
                      </div>
                  </div>

                  {/* Şifrə inputları - yalnız checked olduqda görünür */}
                  {checked && (
                      <div className="flex flex-col md:flex-row gap-4 md:gap-5 mt-3 w-full">
                          <label htmlFor="reg-password" className="flex flex-col w-full mb-3 md:mb-5">
                              <p className="flex flex-row gap-1 text-[14px] md:text-[16px] text-[#000000] mb-1">Şifrə
                                  <span className="text-[#f50809]">*</span>
                              </p>
                              <div className="relative w-full">
                                  <input
                                      type={showPassword ? "text" : "password"}
                                      id="reg-password"
                                      className="w-full p-2 border border-[#dddddd] rounded-md outline-none pr-10"
                                  />
                                  <button
                                      type="button"
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          setShowPassword(!showPassword);
                                      }}
                                      className="absolute inset-y-0 right-2 flex items-center text-[22px] text-[#000000] cursor-pointer"
                                  >
                                      {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                  </button>
                              </div>
                          </label>
                          <label htmlFor="confirm-password" className="flex flex-col w-full mb-3 md:mb-5">
                              <p className="flex flex-row gap-1 text-[14px] md:text-[16px] text-[#000000] mb-1">Şifrəni təkrar edin
                                  <span className="text-[#f50809]">*</span>
                              </p>
                              <div className="relative w-full">
                                  <input
                                      type={showPassword ? "text" : "password"}
                                      id="confirm-password"
                                      className="w-full p-2 border border-[#dddddd] rounded-md outline-none pr-10"
                                  />
                                  <button
                                      type="button"
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          setShowPassword(!showPassword);
                                      }}
                                      className="absolute inset-y-0 right-2 flex items-center text-[22px] text-[#000000] cursor-pointer"
                                  >
                                      {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                  </button>
                              </div>
                              <span className="text-[14px] md:text-[16px] text-[#999999]">
                                  Parolda ən azı 6 latın simvolu olmalıdır
                              </span>
                          </label>
                      </div>
                  )}
                </div>
              </div>

              {/* Çatdırılma seçimləri */}
              <div className="flex flex-col gap-4 mb-6">
                {[
                  { id: 'option1', title: 'Çatdırılma kuryer', desc: 'Bakı şəhəri üzrə 24 saat ərzində çatdırılma.', price: '+ 5 AZN' },
                  { id: 'option2', title: 'Ekspress çatdırılma', desc: '1 saat ərzində çatdırılma (Hava şəraiti ilə əlaqədar sifarişlərdə gecikmələr ola bilər)', desc2: '20:00-dan sonra edilən Bakı üzrə şəhərdaxili sifarişlərin çatdırılması növbəti gün 9:00 - 10:00-dək baş tutacaq.', price: '+ 7 AZN' },
                  { id: 'option3', title: 'Azərbaycanın bölgələrinə ekspress çatdırılma', desc: 'Sifariş edildikdən sonra cəmi 7 saat ərzində çatdırılır.', desc2: 'Naxçıvan MR və Şahdağ ərazilərinə ekspress çatdırılma qiyməti fərqli ola bilər.', desc3: 'Naxçıvan MR ekspress poçtla göndəriləcək.', price: '+ 10 AZN' },
                  { id: 'option4', title: 'Azərpoçt', price: '+ 4.50 AZN' },
                  { id: 'option5', title: '"Özün götür" xidməti', price: '0.50 AZN - 2.50 AZN' },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-start justify-between w-full mb-3 cursor-pointer select-none"
                    onClick={() => setSelectedOption(opt.id)}
                  >
                    <div className="flex gap-2 flex-1 items-start">
                      <div className="relative w-4 h-4 md:w-5 md:h-5 border-2 border-[#000000] rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                          <div className="absolute inset-0">
                              <div className={`absolute top-0 left-0 h-full w-0 bg-[#000000] transition-all duration-300 ${selectedOption === opt.id ? "w-1/2" : ""}`}></div>
                              <div className={`absolute top-0 right-0 h-full w-0 bg-[#000000] transition-all duration-300 ${selectedOption === opt.id ? "w-1/2" : ""}`}></div>
                              <div className={`absolute top-0 left-0 w-full h-0 bg-[#000000] transition-all duration-300 ${selectedOption === opt.id ? "h-1/2" : ""}`}></div>
                              <div className={`absolute bottom-0 left-0 w-full h-0 bg-[#000000] transition-all duration-300 ${selectedOption === opt.id ? "h-1/2" : ""}`}></div>
                          </div>
                          {selectedOption === opt.id && <GoDotFill className="text-white text-[16px] md:text-[20px] z-10" />}
                      </div>
                      <div className="flex flex-col">
                          <p className="text-[14px] md:text-[16px] text-[#000000]">{opt.title}</p>
                          {opt.desc && <span className="text-[12px] md:text-[14px] text-[#999999]">{opt.desc}</span>}
                          {opt.desc2 && <span className="text-[12px] md:text-[14px] text-[#999999]">{opt.desc2}</span>}
                          {opt.desc3 && <span className="text-[12px] md:text-[14px] text-[#999999]">{opt.desc3}</span>}
                      </div>
                    </div>
                    
                    <p className="text-[14px] md:text-[18px] text-[#000000] font-bold whitespace-nowrap">{opt.price}</p>
                  </label>
                ))}
              </div>

              {/* Tarix seçimi */}
              <div className="relative w-full mb-5" ref={datePickerRef}>
                <label htmlFor="address" className="flex flex-col w-full">
                  <p className="flex flex-row gap-1 text-[14px] md:text-[16px] text-[#000000] mb-1">
                    Çatdırılma tarixi
                    <span className="text-[#f50809]">*</span>
                  </p>
                </label>
                <div
                    className="relative p-3 border border-[#dddddd] rounded-md cursor-pointer flex items-center justify-between transition-colors duration-200"
                    onClick={toggleDatePicker}
                >
                    <div className="flex items-center space-x-2">
                        <span className="text-[#000000]">{formatDate(selectedDate)}</span>
                    </div>
                </div>
                {isOpen && (
                  <div className="absolute z-40 mt-0.5 bg-[#ffffff] rounded-md shadow-lg border border-[#dddddd] w-full md:w-[480px]">
                      <div className="flex flex-col sm:flex-row gap-2 p-4">
                          {/* Sol ay və sol ox */}
                          <div className="w-full sm:w-1/2 flex flex-col gap-2 px-15 sm:px-2">
                              <div className="flex justify-start items-center relative">
                                <button onClick={goToPrevMonth} className="p-2 text-[#000000] absolute left-0 cursor-pointer">
                                  <FaArrowLeftLong />
                                </button>
                                <h3 className="flex-1 text-center text-base text-[#000000]">
                                    {monthNames[currentMonth]} {currentYear}
                                </h3>
                              </div>
                              {/* Cari ayın günləri */}
                              <div>
                                  <div className="grid grid-cols-7 text-center text-xs font-semibold text-[#000000] mb-2">
                                      {weekDays.map((day, index) => <span key={index}>{day}</span>)}
                                  </div>
                                  <div className="grid grid-cols-7 text-center">
                                      {daysOfCurrentMonth.map((dateInfo, index) => (
                                          <div
                                              key={index}
                                              onClick={() => dateInfo.isCurrentMonth && handleDayClick(dateInfo.day, dateInfo.month)}
                                              className={`p-1 cursor-pointer text-sm transition-colors duration-200 ${
                                                  !dateInfo.isCurrentMonth ? 'text-[#a1a1a1] cursor-not-allowed' :
                                                  selectedDate.getDate() === dateInfo.day &&
                                                  selectedDate.getMonth() === dateInfo.month &&
                                                  selectedDate.getFullYear() === currentYear
                                                      ? 'bg-[#dc0708] text-[#ffffff] rounded-md'
                                                      : 'text-[#000000]'
                                              }`}
                                          >
                                              {dateInfo.day}
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          </div>
                          
                          {/* Sağ ay və sağ ox */}
                          <div className="w-full sm:w-1/2 flex flex-col gap-2 px-15 sm:px-2">
                              <div className="flex justify-end items-center relative">
                                <h3 className="flex-1 text-center text-base text-[#000000]">
                                  {monthNames[nextMonth]} {nextMonthYear}
                                </h3>
                                <button onClick={goToNextMonth} className="p-2 text-[#000000] absolute right-0 cursor-pointer">
                                    <FaArrowRightLong />
                                </button>
                              </div>
                              {/* Növbəti ayın günləri */}
                              <div>
                                  <div className="grid grid-cols-7 text-center text-xs font-semibold text-[#000000] mb-2">
                                      {weekDays.map((day, index) => <span key={index}>{day}</span>)}
                                  </div>
                                  <div className="grid grid-cols-7 text-center">
                                      {daysOfNextMonth.map((dateInfo, index) => (
                                          <div
                                              key={index}
                                              onClick={() => dateInfo.isCurrentMonth && handleDayClick(dateInfo.day, dateInfo.month)}
                                              className={`p-1 cursor-pointer text-sm transition-colors duration-200 ${
                                                  !dateInfo.isCurrentMonth ? 'text-[#a1a1a1] cursor-not-allowed' :
                                                  selectedDate.getDate() === dateInfo.day &&
                                                  selectedDate.getMonth() === dateInfo.month &&
                                                  selectedDate.getFullYear() === nextMonthYear
                                                      ? 'bg-[#dc0708] text-[#ffffff] rounded-md'
                                                      : 'text-[#000000]'
                                              }`}
                                          >
                                              {dateInfo.day}
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                )}
              </div>

              {/* Çatdırılma vaxtı */}
              <label htmlFor="delivery" className="flex flex-col w-full mb-6">
                <span className="text-[14px] md:text-[16px] text-[#000000] mb-1">Çatdırılma vaxtını seç</span>
                <select
                  id="delivery"
                  name="delivery"
                  defaultValue=""
                  className="w-full p-3 border border-[#dddddd] rounded-md outline-none text-[14px]"
                >
                  <option value="" disabled hidden>Uyğun zamanı seçin</option>
                  <option value="10:00-17:00">10:00-17:00</option>
                  <option value="17:00-20:00">17:00-20:00</option>
                </select>
              </label>

              {/* Ödəmə üsulu */}
              <div className="flex flex-col mb-6">
                <p className="text-[16px] md:text-[22px] text-[#000000] mb-4">
                  Ödəmə üsulu <span className="text-[#f50809]">*</span>
                </p>
                {[
                  { id: 'option1', title: 'Nağd pulla' },
                  { id: 'option2', title: 'Million', subtitle: 'E-MANAT, M-PAY, EXPRESS-PAY' },
                  { id: 'option3', title: 'Rusiya kartlar' },
                  { id: 'option4', title: 'VISA | MasterCard' },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-start justify-between w-full mb-3 cursor-pointer select-none"
                    onClick={() => setPaymentOption(opt.id)}
                  >
                    <div className="flex gap-2 flex-1 items-start">
                      <div className="relative w-4 h-4 md:w-5 md:h-5 border-2 border-[#000000] rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                          <div className="absolute inset-0">
                              <div className={`absolute top-0 left-0 h-full w-0 bg-[#000000] transition-all duration-300 ${paymentOption === opt.id ? "w-1/2" : ""}`}></div>
                              <div className={`absolute top-0 right-0 h-full w-0 bg-[#000000] transition-all duration-300 ${paymentOption === opt.id ? "w-1/2" : ""}`}></div>
                              <div className={`absolute top-0 left-0 w-full h-0 bg-[#000000] transition-all duration-300 ${paymentOption === opt.id ? "h-1/2" : ""}`}></div>
                              <div className={`absolute bottom-0 left-0 w-full h-0 bg-[#000000] transition-all duration-300 ${paymentOption === opt.id ? "h-1/2" : ""}`}></div>
                          </div>
                          {paymentOption === opt.id && <GoDotFill className="text-white text-[16px] md:text-[20px] z-10" />}
                      </div>
                      <div className="flex flex-col">
                          <p className="text-[14px] md:text-[16px] text-[#000000]">{opt.title}</p>
                          {opt.subtitle && <span className="text-[12px] text-[#999999]">{opt.subtitle}</span>}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Qeydlər */}
              <label htmlFor="notes" className="flex flex-col w-full mb-6">
                <span className="text-[14px] md:text-[16px] text-[#000000] mb-1">Sifarişə aid qeydlər</span>
                <textarea
                  id="notes"
                  name="notes"
                  className="w-full h-16 p-2 border border-[#dddddd] rounded-md outline-none resize-none text-[14px]"
                ></textarea>
              </label>

              {/* Sifarişi təsdiq et düyməsi */}
              <button className="w-full py-3 text-[14px] md:text-[16px] text-white bg-[#dc0708] hover:bg-[#f50809] rounded-md transition-colors duration-300">
                Sifarişi təsdiq edin
              </button>
            </div>
          </div>
        )}

        {/* Sabitlənmiş bar */}
        {cartProducts.length > 0 && !showOrderForm && (
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
            <button
              onClick={handleShowOrderForm}
              className="bg-[#f50809] text-white text-[16px] px-6 py-2 rounded-md hover:bg-[#dc2626]"
            >
              Sifariş edin
            </button>
          </div>
        )}
      </div>

      {/* Tövsiyə edirik */}
      {!showOrderForm && recommendProducts.length > 0 && (
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

      {/* Giriş Modalı */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-[#0a0a0a98] flex items-center justify-center p-2 z-50" onClick={closeLoginModal}>
          <div className="w-[400px] h-auto p-5 bg-[#ffffff] rounded-md relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeLoginModal}
              className="absolute top-3 right-3 text-[#000000] z-10 cursor-pointer"
            >
              <RiCloseFill className="text-[26px]" />
            </button>
            <div className="pt-8">
              <label htmlFor="email" className="flex flex-col w-full mb-3 md:mb-5">
                <p className="flex flex-row gap-1 text-[14px] md:text-[16px] text-[#000000] mb-1">E-mail
                  <span className="text-[#f50809]">*</span>
                </p>
                <input
                  type="email"
                  id="email"
                  placeholder="Telefon və yaxud E-mail"
                  className="w-full py-2 px-4 border border-[#dddddd] rounded-md outline-none"
                />
              </label>
              <label htmlFor="password" className="flex flex-col w-full mb-3 md:mb-5">
                <p className="flex flex-row gap-1 text-[14px] md:text-[16px] text-[#000000] mb-1">Şifrə
                  <span className="text-[#f50809]">*</span>
                </p>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Şifrə"
                    className="w-full py-2 px-4 border border-[#dddddd] rounded-md outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-2 flex items-center text-[22px] text-[#000000] cursor-pointer"
                  >
                    {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                  </button>
                </div>
              </label>
              
              <div className="flex flex-row gap-5 items-center text-[14px] md:text-[16px] text-[#000000]">
                <button className="p-6 py-3 text-[14px] md:text-[16px] text-[#ffffff] bg-[#dc0708] hover:bg-[#f50809] rounded-md cursor-pointer transition-colors duration-300">
                  Daxil olun
                </button>
                <Link to={'/user?tab=recovery'}
                  onClick={showRecoveryForm}
                  className="border-b border-dashed border-[#000000] hover:border-[#f50809] hover:text-[#f50809] cursor-pointer transition-colors duration-300 text-center whitespace-nowrap"
                >
                  Şifrəni bərpa edin
                </Link>
              </div>
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