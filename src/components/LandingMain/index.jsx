import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'
import { FaChevronRight, FaInstagram, FaChevronUp } from 'react-icons/fa';
import Carusel from './Carusel'
import YeniAz from './YeniAz'
import YeniEn from './YeniEn'
import YeniFrDe from './YeniFrDe'
import YeniRu from './YeniRu'
import YeniTr from './YeniTr'
import suretli_catdirilma from "../../assets/img/suretli_catdirilma.png";
import ekspress_catdirilma from "../../assets/img/ekspress_catdirilma.png";
import rahat_odenis from "../../assets/img/rahat_odenis.png";
import ozun_gotur from "../../assets/img/ozun_gotur.png";
import poctla_catdirilma from "../../assets/img/poctla_catdirilma.png";
import yeni_kitab_satisda from "../../assets/img/yeni_kitab_satisda.jpg";
import yeni_usaq_kitabi from "../../assets/img/yeni_usaq_kitabi.jpg";
import labubu from "../../assets/img/labubu.jpg";
import kitab_yolculugu from "../../assets/img/kitab_yolculugu.jpg";
import klassik_endirim from '../../assets/img/klassik_endirim.jpg';
import yubileye_ozel from '../../assets/img/yubileye_ozel.jpg';
import serfeli_saat from '../../assets/img/serfeli_saat.jpg';
import instax from '../../assets/img/instax.png';
import ravensburger from '../../assets/img/ravensburger.png';
import lego from '../../assets/img/lego.png';
import clementoni from '../../assets/img/clementoni.png';
import paperblanks from '../../assets/img/paperblanks.png';
import hasbro from '../../assets/img/hasbro.png';
import mattel from '../../assets/img/mattel.png';
import funko from '../../assets/img/funko.png';
import endirim from '../../assets/img/endirim.jpg';
import manga from '../../assets/img/manga.jpg';
import oxumaq from '../../assets/img/oxumaq.jpg';
import user_men from '../../assets/img/user_men.png';
import user_women from '../../assets/img/user_women.png';
import kitab_klublari from '../../assets/img/kitab_klublari.jpg';
import usaq_klubu from '../../assets/img/usaq_klubu.jpg';
import rusdilli_klub from '../../assets/img/rusdilli_klub.jpg';
import sen_ejdahasan from '../../assets/img/sen_ejdahasan.jpg';
import hefte_sonu from '../../assets/img/hefte_sonu.jpg';
import crescent_mall from '../../assets/img/crescent_mall.jpg';
import yaradici_tedbir from '../../assets/img/yaradici_tedbir.jpg';
import oxu_dolu_gorusler from '../../assets/img/oxu_dolu_gorusler.jpg';
import lev_tolostoy from '../../assets/img/lev_tolostoy.jpg';
import milli_musiqi from '../../assets/img/milli_musiqi.jpg';
import huseyn_cavid from '../../assets/img/huseyn_cavid.jpg';
import mark_levi from '../../assets/img/mark_levi.jpg';
import fridrix_nitsse from '../../assets/img/fridrix_nitsse.jpg';
import parisde_gun from '../../assets/img/parisde_gun.jpg';
import { scrollTop } from "../../utility/scrollTop";

function LandigMain() {

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
      <Carusel />
      <YeniAz />
      <YeniTr />
      <YeniEn />
      <YeniRu />
      <YeniFrDe />
      <section className="w-full max-w-[1428px] mx-auto mt-10 px-4 sm:px-6 md:px-10 lg:px-[64px] h-auto 
        grid grid-cols-2 sm:grid-cols-5 gap-6 lg:gap-10">
        
        <div className="flex flex-col gap-2 w-full h-[130px]">
          <img src={suretli_catdirilma} alt="suretli_catdirilma" className="w-[50px] h-[50px]" />
          <div className="flex flex-col">
            <h2 className="text-[14px] lg:text-[16px] text-[#000000] font-bold leading-[18px]">
              Sürətli çatdırılma
            </h2>
            <p className="text-[12px] lg:text-[14px] text-[#777777] font-normal leading-[18px]">
              Bakı üzrə hər yerə 24 saat ərzində çatdırılma edirik.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full h-[130px]">
          <img src={ekspress_catdirilma} alt="ekspress_catdirilma" className="w-[50px] h-[50px]" />
          <div className="flex flex-col">
            <h2 className="text-[14px] lg:text-[16px] text-[#000000] font-bold leading-[18px]">
              Ekspress çatdırılma
            </h2>
            <p className="text-[12px] lg:text-[14px] text-[#777777] font-normal leading-[18px]">
              Bakı daxilində 1 saata, bölgələrə 7 saata.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full h-[130px]">
          <img src={rahat_odenis} alt="rahat_odenis" className="w-[50px] h-[50px]" />
          <div className="flex flex-col">
            <h2 className="text-[14px] lg:text-[16px] text-[#000000] font-bold leading-[18px]">
              Rahat ödəniş
            </h2>
            <p className="text-[12px] lg:text-[14px] text-[#777777] font-normal leading-[18px]">
              Sifarişi nağd, kart, yaxud ödəmə terminalları ilə ödəyə bilərsiniz.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full h-[130px]">
          <img src={ozun_gotur} alt="ozun_gotur" className="w-[50px] h-[50px]" />
          <div className="flex flex-col">
            <h2 className="text-[14px] lg:text-[16px] text-[#000000] font-bold leading-[18px]">
              "Özün götür" xidməti
            </h2>
            <p className="text-[12px] lg:text-[14px] text-[#777777] font-normal leading-[18px]">
              Sifarişi ən yaxın təhvil məntəqəsindən özün götür, daha az çatdırılma haqqı ödə.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full h-[130px]">
          <img src={poctla_catdirilma} alt="poctla_catdirilma" className="w-[50px] h-[50px]" />
          <div className="flex flex-col">
            <h2 className="text-[14px] lg:text-[16px] text-[#000000] font-bold leading-[18px]">
              Poçtla çatdırılma
            </h2>
            <p className="text-[12px] lg:text-[14px] text-[#777777] font-normal leading-[18px]">
              Azərbaycanın hər bölgəsinə poçtla və ekspress çatdırılma edirik.
            </p>
          </div>
        </div>
      </section>
      <section className="flex flex-col sm:flex-row items-center sm:items-start gap-5 w-full max-w-[1428px] mx-auto mt-10 px-4 sm:px-6 md:px-10 lg:px-[64px] h-auto">
        <Link className="relative overflow-hidden rounded-lg w-full sm:w-1/3">
          <img 
            src={yeni_kitab_satisda} 
            alt="yeni kitab satışda" 
            className="w-full h-auto object-cover transform transition-transform duration-500 hover:scale-105 hover:brightness-75" 
          />
        </Link>

        <Link className="relative overflow-hidden rounded-lg w-full sm:w-1/3">
          <img 
            src={yeni_usaq_kitabi} 
            alt="yeni kitab satışda" 
            className="w-full h-auto object-cover transform transition-transform duration-500 hover:scale-105 hover:brightness-75" 
          />
        </Link>

        <Link className="relative overflow-hidden rounded-lg w-full sm:w-1/3">
          <img 
            src={labubu} 
            alt="labubu" 
            className="w-full h-auto object-cover transform transition-transform duration-500 hover:scale-105 hover:brightness-75" 
          />
        </Link>
      </section>
      <section className="flex flex-col group w-full max-w-[1428px] mx-auto mt-10 px-4 sm:px-6 md:px-10 lg:px-[64px] h-auto">
        {/* Başlıq */}
        <div className="flex flex-row items-center justify-between w-full sm:w-[500px] h-auto">
          <div className="flex items-center gap-2 sm:gap-4 group-hover-trigger">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-[30px] text-[#000000] font-medium transition-colors duration-200">
              Xəbərlər
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

        {/* Şəkil (Xəbər / Aksiya) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
          <Link className="w-full h-auto hover:shadow-2xl transform duration-500 rounded-md overflow-hidden">
            <img src={kitab_yolculugu} alt="kitab_yolculugu" className="w-full h-auto" />
            <div className="flex flex-col justify-between p-6 space-y-8">
              <div className="space-y-2 h-[120px]">
                <h2 className="text-[18px] lg:text-[20px] tracking-wide leading-[24px]">
                  “Əli və Nino”nun 20 illik kitab yolçuluğu 📚✨
                </h2>
                <p className="text-[14px] lg:text-[16px] text-[#777777] leading-[20px]">
                  “Əli və Nino”nun 20 illik kitab yolçuluğu oxucuları ilə birlikdə yazılan unudulmaz bir hekayəyə çevrilib.
                </p>
              </div>
            </div>
          </Link>
          <Link className="w-full h-auto hover:shadow-2xl transform duration-500 rounded-md overflow-hidden">
            <img src={klassik_endirim} alt="klassik_endirim" className="w-full h-auto" />
            <div className="flex flex-col justify-between p-6 space-y-8">
              <div className="space-y-2 h-[120px]">
                <h2 className="text-[18px] lg:text-[20px] tracking-wide leading-[24px]">
                  Səbətdə əlavə 5% endirim!
                </h2>
                <p className="text-[14px] lg:text-[16px] text-[#777777] leading-[20px]">
                  20 illik yubileyimizə özəl bütün dillərdə klassika janrına səbətdə əlavə 5% endirim!
                </p>
              </div>
            </div>
          </Link>
          <Link className="w-full h-auto hover:shadow-2xl transform duration-500 rounded-md overflow-hidden">
            <img src={yubileye_ozel} alt="yubileye_ozel" className="w-full h-auto" />
            <div className="flex flex-col justify-between p-6 space-y-8">
              <div className="space-y-2 h-[120px]">
                <h2 className="text-[18px] lg:text-[20px] tracking-wide leading-[24px]">
                  “Ali və Nino” 20 illik yubileyini böyük endirim və sürprizlərlə qeyd edir!
                </h2>
                <p className="text-[14px] lg:text-[16px] text-[#777777] leading-[20px]">
                  15-24 avqust tarixlərində “Ali və Nino” mağazalar şəbəkəsi 20 illik yubileyini xüsusi kampaniyalar, endirimlər və maraqlı tədbirlərlə qeyd edir. İstər alış...
                </p>
              </div>
            </div>
          </Link>
          <Link className="hidden sm:block lg:hidden w-full h-auto hover:shadow-2xl transform duration-500 rounded-md overflow-hidden">
            <img src={serfeli_saat} alt="serfeli_saat" className="w-full h-auto" />
            <div className="flex flex-col justify-between p-6 space-y-8">
              <div className="space-y-2 h-[120px]">
                <h2 className="text-[18px] lg:text-[20px] tracking-wide leading-[24px]">
                  Sərfəli saat fürsəti!
                </h2>
                <p className="text-[14px] lg:text-[16px] text-[#777777] leading-[20px]">
                  Alinino.az onlayn alış-veriş platforması yenidən bütün alıcıları sevindirəcək sərfəli saat endirim kampaniyasına start verir!
                </p>
              </div>
            </div>
          </Link>
        </div>
      </section>
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-5 max-w-[1428px] mx-auto mt-10 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
        <Link
          to="/"
          className="flex items-center justify-center h-[100px] border border-[#dddddd] p-4 rounded-md transition-transform duration-500 hover:scale-110 hover:shadow-xl"
        >
          <img src={instax} alt="instax" className="w-[80%] h-auto max-w-[80px]" />
        </Link>
        <Link
          to="/"
          className="flex items-center justify-center h-[100px] border border-[#dddddd] p-2 rounded-md transition-transform duration-500 hover:scale-110 hover:shadow-xl"
        >
          <img src={ravensburger} alt="ravensburger" className="w-1/2 h-auto max-w-[75px]" />
        </Link>
        <Link
          to="/"
          className="flex items-center justify-center h-[100px] border border-[#dddddd] p-4 rounded-md transition-transform duration-500 hover:scale-110 hover:shadow-xl"
        >
          <img src={lego} alt="lego" className="w-1/2 h-auto max-w-[75px]" />
        </Link>
        <Link
          to="/"
          className="flex items-center justify-center h-[100px] border border-[#dddddd] p-4 rounded-md transition-transform duration-500 hover:scale-110 hover:shadow-xl"
          >
          <img src={clementoni} alt="clementoni" className="w-[80%] h-auto max-w-[80px]" />
        </Link>
        <Link
          to="/"
          className="flex items-center justify-center h-[100px] border border-[#dddddd] p-4 rounded-md transition-transform duration-500 hover:scale-110 hover:shadow-xl"
        >
          <img src={paperblanks} alt="paperblanks" className="w-[80%] h-auto max-w-[80px]" />
        </Link>
        <Link
          to="/"
          className="flex items-center justify-center h-[100px] border border-[#dddddd] p-4 rounded-md transition-transform duration-500 hover:scale-110 hover:shadow-xl"
        >
          <img src={hasbro} alt="hasbro" className="w-1/2 h-auto max-w-[75px]" />
        </Link>
        <Link
          to="/"
          className="flex items-center justify-center h-[100px] border border-[#dddddd] p-4 rounded-md transition-transform duration-500 hover:scale-110 hover:shadow-xl"
        >
          <img src={mattel} alt="mattel" className="w-1/2 h-auto max-w-[75px]" />
        </Link>
        <Link
          to="/"
          className="flex items-center justify-center h-[100px] border border-[#dddddd] p-4 rounded-md transition-transform duration-500 hover:scale-110 hover:shadow-xl"
        >
          <img src={funko} alt="funko" className="w-1/2 h-auto max-w-[75px]" />
        </Link>
      </section>
      <section className="flex flex-col sm:flex-row items-center sm:items-start gap-5 w-full max-w-[1428px] mx-auto mt-10 px-4 sm:px-6 md:px-10 lg:px-[64px] h-auto">
        <Link className="relative overflow-hidden rounded-lg w-full sm:w-1/3">
          <img 
            src={endirim} 
            alt="endirim" 
            className="w-full h-auto object-cover transform transition-transform duration-500 hover:scale-105 hover:brightness-75" 
          />
        </Link>

        <Link className="relative overflow-hidden rounded-lg w-full sm:w-1/3">
          <img 
            src={manga} 
            alt="manga" 
            className="w-full h-auto object-cover transform transition-transform duration-500 hover:scale-105 hover:brightness-75" 
          />
        </Link>

        <Link className="relative overflow-hidden rounded-lg w-full sm:w-1/3">
          <img 
            src={oxumaq} 
            alt="oxumaq" 
            className="w-full h-auto object-cover transform transition-transform duration-500 hover:scale-105 hover:brightness-75" 
          />
        </Link>
      </section>
      <section className="flex flex-col group w-full max-w-[1428px] mx-auto mt-10 px-4 sm:px-6 md:px-10 lg:px-[64px] h-auto">
        {/* Başlıq */}
        <div className="flex flex-row items-center justify-between w-full h-auto">
          <div className="flex items-center gap-2 sm:gap-4 group-hover-trigger">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-[30px] text-[#000000] font-medium transition-colors duration-200">
              Müştəri rəyləri
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

        {/* Rəylər */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-3">
          <div className="col-span-1 h-auto p-6 shadow-sm hover:shadow-xl transform duration-500 rounded-md overflow-hidden">
            <div className="flex flex-row items-center gap-5">
              <div className="w-[100px] h-[100px] rounded-full overflow-hidden">
                <img src={user_women} alt="user_women" className="w-auto h-[70px]" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-[14px] lg:text-[16px] tracking-wide leading-[18px]">Jalə Məmmədova</h2>
                <p className="text-[12px] lg:text-[14px] text-[#999999] tracking-wide leading-[18px]">Bakı Azərbaycan</p>
              </div>
            </div>
            <p className="text-[14px] lg:text-[16px] text-[#777777] leading-[18px] mt-4">Спасибо большое за книгу!</p>
          </div>
          <div className="col-span-1 h-auto p-6 shadow-sm hover:shadow-xl transform duration-500 rounded-md overflow-hidden">
            <div className="flex flex-row items-center gap-5">
              <div className="w-[100px] h-[100px] rounded-full overflow-hidden">
                <img src={user_men} alt="user_men" className="w-auto h-[70px]" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-[14px] lg:text-[16px] tracking-wide leading-[18px]">Ruslan Məmmədov</h2>
                <p className="text-[12px] lg:text-[14px] text-[#999999] tracking-wide leading-[18px]">Ukrayna</p>
              </div>
            </div>
            <p className="text-[14px] lg:text-[16px] text-[#777777] leading-[18px] mt-4">
              Merhaba. Günüm çox gözəl sürprizlə tamamlandı, əlimə səbirsizliklə gözlədiyim kitablar gəldi. Çox təşəkkür edirəm. "Alinino.az" əladır!
            </p>
          </div>
          <div className="col-span-1 h-auto p-6 shadow-sm hover:shadow-xl transform duration-500 rounded-md overflow-hidden">
            <div className="flex flex-row items-center gap-5">
              <div className="w-[100px] h-[100px] rounded-full overflow-hidden">
                <img src={user_women} alt="user_women" className="w-auto h-[70px]" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-[14px] lg:text-[16px] tracking-wide leading-[18px]">Svetlana Gorozhanina</h2>
                <p className="text-[12px] lg:text-[14px] text-[#999999] tracking-wide leading-[18px]">Bimola, İtaliya</p>
              </div>
            </div>
            <p className="text-[14px] lg:text-[16px] text-[#777777] leading-[18px] mt-4">
              Сегодня пришли книги, спасибо за сувенирчик!
            </p>
          </div>
          <div className="col-span-1 hidden sm:block lg:hidden h-auto p-6 shadow-sm hover:shadow-xl transform duration-500 rounded-md overflow-hidden">
            <div className="flex flex-row items-center gap-5">
              <div className="w-[100px] h-[100px] rounded-full overflow-hidden">
                <img src={user_women} alt="user_women" className="w-auto h-[70px]" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-[14px] lg:text-[16px] tracking-wide leading-[18px]">Aysun Ağalarlı</h2>
                <p className="text-[12px] lg:text-[14px] text-[#999999] tracking-wide leading-[18px]">Abşeron Azərbaycan</p>
              </div>
            </div>
            <p className="text-[14px] lg:text-[16px] text-[#777777] leading-[18px] mt-4">
              Aylardır arzuladığım kitablar artıq əlimdədir. Sifariş verdiyim kitablar tez bir vaxtda çatdırıldı. Təşəkkürlər Alinino.az!
            </p>
          </div>
        </div>
      </section>
      <section className="flex flex-col group w-full max-w-[1428px] mx-auto mt-10 px-4 sm:px-6 md:px-10 lg:px-[64px] h-auto">
        {/* Başlıq */}
        <div className="flex flex-row items-center justify-between w-full sm:w-[500px] h-auto">
          <div className="flex items-center gap-2 sm:gap-4 group-hover-trigger">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-[30px] text-[#000000] font-medium transition-colors duration-200">
              "Əli və Nino" Kitab Klubu
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

        {/* Şəkil (Xəbər / Aksiya) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-3">
          <Link className="col-span-1 h-auto mt-3 hover:shadow-2xl transform duration-500 rounded-md overflow-hidden">
            <img src={kitab_klublari} alt="kitab_klublari" className="w-full h-auto" />
            <div className="flex flex-col justify-between p-6 space-y-8">
              <div className="space-y-2 h-[120px]">
                <h2 className="text-[20px] tracking-wide leading-[24px]">
                  "Əli və Nino" Kitab Klubları Avqustda Nə Oxuyur? 📚
                </h2>
                <p className="text-[16px] text-[#777777] leading-[20px]">
                  Yay fəslinin son ayı olan avqustda "Əli və Nino" Kitab Klubları oxucularını yenidən maraqlı və fərqli kitablarla bir araya gətirir...
                </p>
              </div>
            </div>
          </Link>
          <Link className="col-span-1 h-auto mt-3 hover:shadow-2xl transform duration-500 rounded-md overflow-hidden">
            <img src={usaq_klubu} alt="usaq_klubu" className="w-full h-auto" />
            <div className="flex flex-col justify-between p-6 space-y-8">
              <div className="space-y-2 h-[120px]">
                <h2 className="text-[20px] tracking-wide leading-[24px]">
                  27 İyulda Uşaq Kitab Klubunda "Kiçik Prins" müzakirəsi keçirildi
                </h2>
                <p className="text-[16px] text-[#777777] leading-[20px]">
                  27 İyulda Uşaq Kitab Klubunda "Kiçik Prins" müzakirəsi keçirildi
                </p>
              </div>
            </div>
          </Link>
          <Link className="col-span-1 h-auto mt-3 hover:shadow-2xl transform duration-500 rounded-md overflow-hidden">
            <img src={rusdilli_klub} alt="rusdilli_klub" className="w-full h-auto" />
            <div className="flex flex-col justify-between p-6 space-y-8">
              <div className="space-y-2 h-[120px]">
                <h2 className="text-[20px] tracking-wide leading-[24px]">
                  “Əli və Nino” Rusdilli Kitab Klubunda “Сирцея” kitabı müzakirə olundu!
                </h2>
                <p className="text-[16px] text-[#777777] leading-[20px]">
                  27 iyulda keçirilən rusdilli kitab klubunda Madlen Millerin “Сирцея” romanı ətrafında maraqlı və fəal müzakirələr aparıldı.
                </p>
              </div>
            </div>
          </Link>
          <Link className="col-span-1 hidden sm:block lg:hidden h-auto mt-3 hover:shadow-2xl transform duration-500 rounded-md overflow-hidden">
            <img src={sen_ejdahasan} alt="sen_ejdahasan" className="w-full h-auto" />
            <div className="flex flex-col justify-between p-6 space-y-8">
              <div className="space-y-2 h-[120px]">
                <h2 className="text-[20px] tracking-wide leading-[24px]">
                  “Əli və Nino” Kitab Klubunda “Sən Əjdahasan” kitabı müzakirə olundu!
                </h2>
                <p className="text-[16px] text-[#777777] leading-[20px]">
                  27 iyulda keçirilən görüşdə oxucular motivasiya dolu “Sən Əjdahasan” kitabı ətrafında maraqlı müzakirə apardılar.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </section>
      <section className="flex flex-col group w-full max-w-[1428px] mx-auto mt-10 px-4 sm:px-6 md:px-10 lg:px-[64px] h-auto">
        {/* Başlıq */}
        <div className="flex flex-row items-center justify-between w-full sm:w-[500px] h-auto">
          <div className="flex items-center gap-2 sm:gap-4 group-hover-trigger">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-[30px] text-[#000000] font-medium transition-colors duration-200">
              Tədbirlər. Aktivliklər. Əyləncə
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

        {/* Şəkil (Xəbər / Aksiya) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-3">
          <Link className="col-span-1 h-auto mt-3 hover:shadow-2xl transform duration-500 rounded-md overflow-hidden">
            <img src={oxu_dolu_gorusler} alt="oxu_dolu_gorusler" className="w-full h-auto" />
            <div className="flex flex-col justify-between p-6 space-y-8">
              <div className="space-y-2 h-[120px]">
                <h2 className="text-[20px] tracking-wide leading-[24px]">
                  “Əli və Nino”dan həftəsonu oxu dolu görüşlər!
                </h2>
                <p className="text-[16px] text-[#777777] leading-[20px]">
                  24 avqust tarixində “Əli və Nino” Crescent Mall filialında təşkil olunacaq kitab klubu görüşləri istər uşaqlar, istər böyüklər üçün unudulmaz bir gün vəd edir.
                </p>
              </div>
            </div>
          </Link>
          <Link className="col-span-1 h-auto mt-3 hover:shadow-2xl transform duration-500 rounded-md overflow-hidden">
            <img src={hefte_sonu} alt="hefte_sonu" className="w-full h-auto" />
            <div className="flex flex-col justify-between p-6 space-y-8">
              <div className="space-y-2 h-[120px]">
                <h2 className="text-[20px] tracking-wide leading-[24px]">
                  "Əli və Nino"da uşaqlar üçün rəngli və öyrədici həftəsonu keçirildi!
                </h2>
                <p className="text-[16px] text-[#777777] leading-[20px]">
                  17 avqustda “Əli və Nino” Crescent Mall filialında keçirilən həftəsonu tədbirləri uşaqlar üçün rəngarəng və unudulmaz anlarla yadda qaldı. Əl izi boyama...
                </p>
              </div>
            </div>
          </Link>
          <Link className="col-span-1 h-auto mt-3 hover:shadow-2xl transform duration-500 rounded-md overflow-hidden">
            <img src={crescent_mall} alt="crescent_mall" className="w-full h-auto" />
            <div className="flex flex-col justify-between p-6 space-y-8">
              <div className="space-y-2 h-[120px]">
                <h2 className="text-[20px] tracking-wide leading-[24px]">
                  Həftəsonu “Əli və Nino” Crescent Mall-da uşaqlar üçün yaradıcı tədbirlər
                </h2>
                <p className="text-[16px] text-[#777777] leading-[20px]">
                  17 avqust tarixində “Əli və Nino” Crescent Mall filialında uşaqlar üçün maraqlı və səmimi həftəsonu tədbirləri keçiriləcək
                </p>
              </div>
            </div>
          </Link>
          <Link className="col-span-1 hidden sm:block lg:hidden h-auto mt-3 hover:shadow-2xl transform duration-500 rounded-md overflow-hidden">
            <img src={yaradici_tedbir} alt="yaradici_tedbir" className="w-full h-auto" />
            <div className="flex flex-col justify-between p-6 space-y-8">
              <div className="space-y-2 h-[120px]">
                <h2 className="text-[20px] tracking-wide leading-[24px]">
                  “Əli və Nino”dan Avqustun 10-da Yaradıcı Həftəsonu Tədbirləri!
                </h2>
                <p className="text-[16px] text-[#777777] leading-[20px]">
                  “Əli və Nino”dan Maraqlı Həftəsonu Tədbirləri – 10 Avqustda Sizi Yaradıcı Masterklasslar Gözləyir!
                </p>
              </div>
            </div>
          </Link>
        </div>
      </section>
      <section className="w-full max-w-[1428px] mx-auto mt-10 px-4 sm:px-6 md:px-10 lg:px-[64px] h-auto">
        <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
          <h2 className="text-lg sm:text-xl md:text-[26px] text-[#f50809] font-semibold">
            Bakıda kitabı haradan almaq olar?
          </h2>
          <p className="text-base sm:text-[18px] md:text-[18px] text-[#000000] leading-relaxed sm:leading-6 md:leading-[24px]">
            Alinino.az internet kitab mağazası kitabsevənlər üçün rahat servis xidməti göstərir. Əgər siz kitab almaq istəyirsinizsə, bu işdə bizim saytımız sizə yardımçı ola bilər. Saytda müxtəlif janrlarda kitablar, ensiklopediyalar, klassik əsərlər, belletristika, müasir və elmi bədii əsərlər təklif olunur.
          </p>
          <p className="flex flex-col text-base sm:text-[18px] md:text-[18px] text-[#000000] leading-relaxed sm:leading-6 md:leading-[24px]">
            <span className="block font-medium">
              Kitab mağazası Bakıda hər kəs üçündür.
            </span>
            Demək olar ki, hər biriniz sizə lazım olan kitabı hardan almaq problemi ilə üzləşmisiniz. Əvvəllər, bir kitabı almaq üçün bir neçə kitab mağazasına baş çəkmək məcburiyyətində qalırdınız. İndi isə, hər şey daha asandır. Onlayn mağazadan istədiyiniz kitabı əlverişli qiymətə əldə etmək imkanını yaradırıq.
          </p>
          <p className="text-base sm:text-[18px] md:text-[18px] text-[#000000] leading-relaxed sm:leading-6 md:leading-[24px]">
            Kitab almaq qərarına gəldikdən sonra, siz onu Bakının istənilən yerindən sifariş edə bilərsiniz, kuryer aldığınız malı göstərilən ünvana qısa zamanda çatdıracaq. Sifariş etmək üçün, sizin kitabı seçib “Tıkla al” düyməsinə basmağınız yetərlidir. Bu cür alış-verişin üstünlüyü – evdən vəya iş yerinizdən ayrılmadan, istədiyiniz kitabı tapmaqda vaxt itirmədən əldə etməkdir.
          </p>
          <p className="text-base sm:text-[18px] md:text-[18px] text-[#000000] leading-relaxed sm:leading-6 md:leading-[24px]">
            Əgər siz internet mağazalara güvənmirsinizsə, və ya kitabı mağazadan özünüz seçib, əldə tutub vərəqlədikdən sonra əldə etmək istəyirsinizsə, o zaman bizim mağazalarımızdan birinə gələ bilərsiniz.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 mt-6 sm:mt-8 md:mt-10">
          <h2 className="text-lg sm:text-xl md:text-[26px] text-[#f50809] font-semibold">
            Bakıda kitabı necə sifariş etmək olar?
          </h2>
          <p className="text-base sm:text-[18px] md:text-[18px] text-[#000000] leading-relaxed sm:leading-6 md:leading-[24px]">
            Yeni texnologiyaların inkişafı ilə, yaşayış yeri iş və təhsildə böyük rol oynamır. Artıq bir çox insanlar meqapolisin səs-küyündən qaçaraq şəhər kənarı evlərdə yaşamağa üstünlük verirlər. Hətta belə hallarda belə internet mağazadan kitab almaq problem deyil, çünki mağaza bütün Bakı və Azərbaycan ərazisində fəaliyyət göstərir...
          </p>
          <p className="text-base sm:text-[18px] md:text-[18px] text-[#000000] leading-relaxed sm:leading-6 md:leading-[24px]">
            Kitab almaq heç belə asan olmamışdı. İndi siz nəinki vaxt itirmədən kitab əldə edə biləcəksiniz, həm də mağazamız tərəfindən keçirilən müxtəlif aksiyalar və ya endirimlər, 50 % endirimli kitablar və hətta 1 manata olan kitabları da əldə edə biləcəksiniz...
          </p>
          <p className="text-base sm:text-[18px] md:text-[18px] text-[#000000] leading-relaxed sm:leading-6 md:leading-[24px]">
            Mağazamızda kitablarla yanaşı hədiyyələr, elektronik mallar, oyuncaqlar, pazllar, məktəb üçün ləvazimatlar, ətriyyat, A.Salamaxinanın yaylıqları və milli kəlağayıları da əldə edə bilərsiniz.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 mt-6 sm:mt-8 md:mt-10">
          <h2 className="text-lg sm:text-xl md:text-[26px] text-[#f50809] font-semibold">
            Russiya, Amerika və Avropaya kitab sifariş etmək olar?
          </h2>
          <p className="flex flex-col text-base sm:text-[18px] md:text-[18px] text-[#000000] leading-relaxed sm:leading-6 md:leading-[24px]">
            <span className="block font-medium">
              Xarici ölkədə yaşasanız da bizim mağazamızdan internet ilə azərbaycan kitabları və milli suvenirləri ala bilərsiniz.
            </span>
            Sifariş etdiyiniz kitabı, ödəniş edildiyi gündən bir gün sonra istədiyiniz ölkəyə göndərə bilərik. Siz sifarişlərinizi 3-12 gün arası ala bilərsiniz.
          </p>
          <p className="flex flex-col text-base sm:text-[18px] md:text-[18px] text-[#000000] leading-relaxed sm:leading-6 md:leading-[24px]">
            <span className="block font-medium">
              Azərbaycanın rayonlarından necə sifariş edə bilərik?
            </span>
            Əgər siz Azərbaycanda yaşayırsınızda kitab sifariş etmək sizin üçün çox asan olacaq. 15 illik iş təcrübəsində biz işimizin peşəkarı olmuşuq. Sifarişinizi xüsusi ödənişlə Ağstafa, Naxçıvan, Gəncə, Şamaxı, Lənkəran, Zaqatala, Quba, Qəbələ, Gədəbəy, Mingəçevir və digər şəhərlərə çatdırırıq. Siz ödənişi kitabı aldıqdan sonra edirsiniz.
          </p>
          <p className="text-base sm:text-[18px] md:text-[18px] text-[#000000] leading-relaxed sm:leading-6 md:leading-[24px]">
            Alinino.az internet mağazamızdan kitab əldə etmək hər zaman rahat və əlverişlidir.
          </p>
        </div>
      </section>
      <section className="flex flex-col group w-full max-w-[1428px] mx-auto mt-10 px-4 sm:px-6 md:px-10 lg:px-[64px] h-auto">
        {/* Başlıq */}
        <div className="flex items-center justify-center">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-[30px] text-[#000000] hover:text-[#f50809] font-medium transition-colors duration-200">
            @ali_and_nino
          </h2>
        </div>

        {/* Şəkillər */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mt-5">
          <Link to="https://www.instagram.com/ali_and_nino/" className="relative group overflow-hidden w-full h-auto">
            <img
              src={lev_tolostoy}
              alt="lev_tolostoy"
              className="w-full h-auto object-cover transform transition duration-500 group-hover:scale-110 group-hover:brightness-75"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
              <FaInstagram className="text-white text-[70px] transform scale-50 transition duration-300 group-hover:scale-100" />
            </div>
          </Link>
          <Link to="https://www.instagram.com/ali_and_nino/" className="relative group overflow-hidden w-full h-auto">
            <img
              src={milli_musiqi}
              alt="milli_musiqi"
              className="w-full h-auto object-cover transform transition duration-500 group-hover:scale-110 group-hover:brightness-75"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
              <FaInstagram className="text-white text-[70px] transform scale-50 transition duration-300 group-hover:scale-100" />
            </div>
          </Link>
          <Link to="https://www.instagram.com/ali_and_nino/" className="relative group overflow-hidden w-full h-auto">
            <img
              src={huseyn_cavid}
              alt="huseyn_cavid"
              className="w-full h-auto object-cover transform transition duration-500 group-hover:scale-110 group-hover:brightness-75"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
              <FaInstagram className="text-white text-[70px] transform scale-50 transition duration-300 group-hover:scale-100" />
            </div>
          </Link>
          <Link to="https://www.instagram.com/ali_and_nino/" className="relative group overflow-hidden w-full h-auto">
            <img
              src={mark_levi}
              alt="mark_levi"
              className="w-full h-auto object-cover transform transition duration-500 group-hover:scale-110 group-hover:brightness-75"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
              <FaInstagram className="text-white text-[70px] transform scale-50 transition duration-300 group-hover:scale-100" />
            </div>
          </Link>
          <Link to="https://www.instagram.com/ali_and_nino/" className="relative group overflow-hidden w-full h-auto">
            <img
              src={fridrix_nitsse}
              alt="fridrix_nitsse"
              className="w-full h-auto object-cover transform transition duration-500 group-hover:scale-110 group-hover:brightness-75"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
              <FaInstagram className="text-white text-[70px] transform scale-50 transition duration-300 group-hover:scale-100" />
            </div>
          </Link>
          <Link to="https://www.instagram.com/ali_and_nino/" className="relative group overflow-hidden w-full h-auto">
            <img
              src={parisde_gun}
              alt="parisde_gun"
              className="w-full h-auto object-cover transform transition duration-500 group-hover:scale-110 group-hover:brightness-75"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
              <FaInstagram className="text-white text-[70px] transform scale-50 transition duration-300 group-hover:scale-100" />
            </div>
          </Link>
        </div>
      </section>
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
  )
}

export default LandigMain