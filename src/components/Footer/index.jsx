import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaPinterest, FaRegClock, FaTelegram, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import { RiCloseFill } from 'react-icons/ri';
import { FaXTwitter } from 'react-icons/fa6';
import ReCAPTCHA from "react-google-recaptcha";
import alinino_logo from '../../assets/img/alinino_logo.png';
import whatsapp from "../../assets/img/whatsapp.png";
import facebook from "../../assets/img/facebook.png";
import instagram from "../../assets/img/instagram.png";
import youtube from "../../assets/img/youtube.png";
import x from "../../assets/img/x.png";
import telegram from "../../assets/img/telegram.png";
import pinterest from "../../assets/img/pinterest.png";
import playstore from "../../assets/img/playstore.png";
import appstore from "../../assets/img/appstore.png";
import million from "../../assets/img/million.png";
import visa from "../../assets/img/visa.png";
import mastercard from "../../assets/img/mastercard.png";
import mir from "../../assets/img/mir.png";

function Footer() {
  // State-lər
  const [showForm, setShowForm] = useState(false);
  const [showWhatsapp, setShowWhatsapp] = useState(false);
  const [showFacebook, setShowFacebook] = useState(false);
  const [showInstagram, setShowInstagram] = useState(false);
  const [showYoutube, setShowYoutube] = useState(false);
  const [showX, setShowX] = useState(false);
  const [showTelegram, setShowTelegram] = useState(false);
  const [showPinterest, setShowPinterest] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const currentYear = new Date().getFullYear();

  const handleOpenForm = () => {
    setShowForm(true);
  };

  const handleOpenSocialModal = (setter) => {
    setter(true);
  };

  const handleCloseSocialModal = (setter) => {
    setter(false);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaToken(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!recaptchaToken) {
      alert("Zəhmət olmasa, reCAPTCHA-nı doldurun.");
      return;
    }

    // Form məlumatlarını əldə edin
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log("Form məlumatları:", data);

    // Məsələn backend-ə göndərmək olar
    alert("Müraciətiniz uğurla göndərildi. Ən qısa zamanda sizinlə əlaqə saxlayacağıq.");
    
    // Formu təmizləyin
    e.target.reset();
    setRecaptchaToken(null);
    handleCloseForm();
  };

  return (
    <>
      {/* Üst hissə */}
      <div className='w-full bg-[#f7f8fa]'>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-[1428px] mx-auto px-6 lg:px-[64px] py-[50px] gap-5 sm:gap-10 lg:gap-12">
          {/* Sol sütun */}
          <div className="flex flex-col">
            <img src={alinino_logo} alt="alinino_logo" className="w-[110px] h-[110px]" />
            <div className="flex flex-col items-start gap-2 py-4 lg:p-5">
              <Link to={'/'} className="flex flex-col items-start">
                <p className="text-[18px] lg:text-[20px] text-[#000000] font-semibold hover:text-[#f50809]">(+99451) 312 24 40</p>
                <p className="text-[12px] lg:text-[14px] text-gray-400 font-medium">Telefonla elə indi sifariş edin!</p>
                <p className="text-[18px] lg:text-[20px] text-[#000000] font-semibold hover:text-[#f50809]">(+99477) 597 14 65</p>
                <p className="text-[18px] lg:text-[20px] text-[#000000] font-semibold hover:text-[#f50809]">(+99412) 431 40 67</p>
              </Link>
              <div className="flex flex-col gap-2">
                <button onClick={handleOpenForm} className="flex items-center justify-center w-[112px] h-[34px] lg:w-[124px] lg:h-[38px] px-[15px] text-[14px] lg:text-[16px] text-[#ffffff] bg-[#0052e6] hover:bg-[#007aff] rounded-md cursor-pointer">
                  Zəng sifarişi
                </button>
                <Link to={'/'} className="flex flex-row items-center gap-2 mt-4">
                  <FiMail className="text-[18px] text-[#f50809]" />
                  <p className="text-[14px] lg:text-[16px] text-[#000000] hover:text-[#f50809] font-normal">info@alinino.az</p>
                </Link>
                <div className="flex flex-row items-start gap-2">
                  <FaRegClock className="text-[22px] text-[#f50809]" />
                  <p className="text-[14px] lg:text-[16px] text-[#000000] font-normal">
                    Biz həftənin 7 günü, saat 9:00 - 20:00 qədər çatdırılma edirik.
                  </p>
                </div>
                <div className="flex flex-row items-center gap-1 mt-4 cursor-pointer">
                  <FaWhatsapp onClick={() => handleOpenSocialModal(setShowWhatsapp)} className="text-[20px] lg:text-[22px] text-[#25d366]" />
                  <p className="text-[14px] lg:text-[16px] text-[#000000] hover:text-[#25d366] font-normal">WhatsApp</p>
                </div>
              </div>

              {/* WhatsApp Modal */}
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
                    <div className="flex flex-row items-center justify-between gap-2 p-2 mt-2 border border-gray-200 rounded">
                      <img src={whatsapp} alt="whatsapp" className="w-[100px] h-[100px]" />
                      <p className="text-[14px] text-[#000000] font-normal">Digər cihazdan [sosial] bölməsini açmaq üçün bu QR kodunu skan edin</p>
                    </div>
                    <Link to={'https://api.whatsapp.com/send?phone=994513122440'} target="_blank" rel="noopener noreferrer" className="flex flex-row items-center justify-center w-full gap-2 bg-gray-200 mt-5 py-3 rounded">
                      <FaWhatsapp className="text-[20px] text-[#000000]" />
                      <p className="text-[14px] text-[#000000] font-medium">Aç WhatsApp</p>
                    </Link>
                  </div>
                </div>
              )}

              {/* Callback Form Modal */}
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
                    <form onSubmit={handleSubmit} className="space-y-4">
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
            </div>
          </div>

          {/* Orta sütun */}
          <div className="flex flex-col">
            <h2 className='text-[14px] lg:text-[16px] text-[#000000] font-semibold leading-[30px]'>Haqqımızda</h2>
            <ul className='text-[14px] lg:text-[16px] text-[#888888] font-medium leading-[30px]'>
              <li className='hover:text-[#f50809] transform duration-300'>
                <span className='cursor-pointer'>Əlaqə və ünvanlar</span>
              </li>
              <li className='hover:text-[#f50809] transform duration-300'>
                <span className='cursor-pointer'>Xəbərlər</span>
              </li>
              <li className='hover:text-[#f50809] transform duration-300'>
                <span className='cursor-pointer'>Bloq</span>
              </li>
              <li className='hover:text-[#f50809] transform duration-300'>
                <span className='cursor-pointer'>Bizdən kitab tövsiyəsi</span>
              </li>
              <li className='hover:text-[#f50809] transform duration-300'>
                <span className='cursor-pointer'>"Əli və Nino" nəşriyyatı</span>
              </li>
              <li className='hover:text-[#f50809] transform duration-300'>
                <span className='cursor-pointer'>Gizlilik siyasəti</span>
              </li>
              <li className='hover:text-[#f50809] transform duration-300'>
                <span className='cursor-pointer'>Sifarişimi qaytarmaq (dəyişmək) istəyirəm</span>
              </li>
              <li className='hover:text-[#f50809] transform duration-300'>
                <span className='cursor-pointer'>Pulsuz dənəmə nədir?</span>
              </li>
              <li className='hover:text-[#f50809] transform duration-300'>
                <span className='cursor-pointer'>Geyimlərin rahat qaytarılması</span>
              </li>
              <li className='hover:text-[#f50809] transform duration-300'>
                <span className='cursor-pointer'>Pulsuz çatdırılma fürsəti</span>
              </li>
              <li className='hover:text-[#f50809] transform duration-300'>
                <span className='cursor-pointer'>Sifarişi necə etmək?</span>
              </li>
              <li className='hover:text-[#f50809] transform duration-300'>
                <span className='cursor-pointer'>Promokodu necə istifadə etməli?</span>
              </li>
              <li className='hover:text-[#f50809] transform duration-300'>
                <span className='cursor-pointer'>Bölgələrdən sifariş etmək qaydası</span>
              </li>
              <li className='hover:text-[#f50809] transform duration-300'>
                <span className='cursor-pointer'>"Özün götür" xidməti nədir?</span>
              </li>
            </ul>
          </div>

          {/* Sağ sütun */}
          <div className="flex flex-col sm:col-span-1 lg:col-span-1">
            <div className='flex flex-col'>
              <h2 className='text-[14px] lg:text-[16px] text-[#000000] font-semibold leading-[30px]'>Mağaza haqqında</h2>
              <p className='text-[14px] lg:text-[16px] text-[#888888] font-medium leading-[30px]'>
                Alinino.az saytı
              </p>
              <p className='text-[14px] lg:text-[16px] text-[#888888] font-medium leading-[20px]'>
                Alinino.az saytı 15 ildən çoxdur ki, Azərbaycanda operativ satış və çatdırılma xidməti göstərən onlayn satış mağazasıdır.
              </p>
              <p className='text-[14px] lg:text-[16px] text-[#888888] font-medium leading-[20px]'>
                Azərbaycanın bütün rayon və şəhərlərinə, Bakıda və dünyanın bütün ölkələrindəki bütün ünvanlara çatdırılmanı həyata keçirir.
              </p>
              <p className='text-[14px] lg:text-[16px] text-[#888888] font-medium leading-[20px]'>
                Whatsap: (+99451) 312 24 40
              </p>
              <p className='text-[14px] lg:text-[16px] text-[#888888] font-medium leading-[20px]'>
                Tel: (+99412) 431 40 67
              </p>
              <p className='text-[14px] lg:text-[16px] text-[#888888] font-medium leading-[20px]'>
                "Əli və Nino" Kitab Mağazaları Şəbəkəsi <br/>
                Azərbaycanda 2005-ci ildən fəaliyyət göstərən ən böyük <br/>
                kitab və oyuncaqlar şəbəkəsidir. <br/>
                Markanın sahibi və icraçı direktoru xanım Nigar Köçərlidir
              </p>
              <p className='text-[14px] lg:text-[16px] text-[#888888] font-medium leading-[20px]'>
                E-mail:
                <span className='hover:text-[#f50809] underline cursor-pointer transform duration-300'> info@alinino.az</span>
              </p>
            </div>
            <div className='flex flex-col mt-5'>
              <h2 className='text-[14px] lg:text-[16px] text-[#000000] font-semibold leading-[30px]'>Sosial şəbəkələrdə biz</h2>
              <div className="flex flex-row justify-between gap-2 mt-1 sm:flex-wrap sm:justify-start">
                <div className="flex items-center justify-center w-[35px] h-[35px] lg:w-[50px] lg:h-[50px] bg-[#f1f1f1] rounded-md cursor-pointer">
                  <FaFacebookF onClick={() => handleOpenSocialModal(setShowFacebook)} className="text-[22px] text-[#3b5998]" />
                </div>
                <div className="flex items-center justify-center w-[35px] h-[35px] lg:w-[50px] lg:h-[50px] bg-[#f1f1f1] rounded-md cursor-pointer">
                  <FaInstagram onClick={() => handleOpenSocialModal(setShowInstagram)} className="text-[26px] text-[#654C9F]" />
                </div>
                <div className="flex items-center justify-center w-[35px] h-[35px] lg:w-[50px] lg:h-[50px] bg-[#f1f1f1] rounded-md cursor-pointer">
                  <FaYoutube onClick={() => handleOpenSocialModal(setShowYoutube)} className="text-[26px] text-[#f50809]" />
                </div>
                <div className="flex items-center justify-center w-[35px] h-[35px] lg:w-[50px] lg:h-[50px] bg-[#f1f1f1] rounded-md cursor-pointer">
                  <FaXTwitter onClick={() => handleOpenSocialModal(setShowX)} className="text-[22px] text-[#000000]" />
                </div>
                <div className="flex items-center justify-center w-[35px] h-[35px] lg:w-[50px] lg:h-[50px] bg-[#f1f1f1] rounded-md cursor-pointer">
                  <FaTelegram onClick={() => handleOpenSocialModal(setShowTelegram)} className="text-[24px] text-[#2ca3d6]" />
                </div>
                <div className="flex items-center justify-center w-[35px] h-[35px] lg:w-[50px] lg:h-[50px] bg-[#f1f1f1] rounded-md cursor-pointer">
                  <FaPinterest onClick={() => handleOpenSocialModal(setShowPinterest)} className="text-[24px] text-[#f50809]" />
                </div>
                
                {/* Facebook Modal */}
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
                      <div className="flex flex-row items-center justify-between gap-2 p-2 mt-2 border border-gray-200 rounded">
                        <img src={facebook} alt="facebook" className="w-[100px] h-[100px]" />
                        <p className="text-[14px] text-[#000000] font-normal">Digər cihazdan [sosial] bölməsini açmaq üçün bu QR kodunu skan edin</p>
                      </div>
                      <Link to={'https://www.facebook.com/aliandnino.azerbaijan'} target="_blank" rel="noopener noreferrer" className="flex flex-row items-center justify-center w-full gap-2 bg-gray-200 mt-5 py-3 rounded">
                        <FaFacebookF className="text-[20px] text-[#000000]" />
                        <p className="text-[14px] text-[#000000] font-medium">Aç Facebook</p>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Instagram Modal */}
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
                      <div className="flex flex-row items-center justify-between gap-2 p-2 mt-2 border border-gray-200 rounded">
                        <img src={instagram} alt="instagram" className="w-[100px] h-[100px]" />
                        <p className="text-[14px] text-[#000000] font-normal">Digər cihazdan [sosial] bölməsini açmaq üçün bu QR kodunu skan edin</p>
                      </div>
                      <Link to={'https://www.instagram.com/ali_and_nino/'} target="_blank" rel="noopener noreferrer" className="flex flex-row items-center justify-center w-full gap-2 bg-gray-200 mt-5 py-3 rounded">
                        <FaInstagram className="text-[20px] text-[#000000]" />
                        <p className="text-[14px] text-[#000000] font-medium">Aç Instagram</p>
                      </Link>
                    </div>
                  </div>
                )}

                {/* YouTube Modal */}
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
                      <div className="flex flex-row items-center justify-between gap-2 p-2 mt-2 border border-gray-200 rounded">
                        <img src={youtube} alt="youtube" className="w-[100px] h-[100px]" />
                        <p className="text-[14px] text-[#000000] font-normal">Digər cihazdan [sosial] bölməsini açmaq üçün bu QR kodunu skan edin</p>
                      </div>
                      <Link to={'https://www.youtube.com/user/AliandNino'} target="_blank" rel="noopener noreferrer" className="flex flex-row items-center justify-center w-full gap-2 bg-gray-200 mt-5 py-3 rounded">
                        <FaYoutube className="text-[20px] text-[#000000]" />
                        <p className="text-[14px] text-[#000000] font-medium">Aç YouTube</p>
                      </Link>
                    </div>
                  </div>
                )}

                {/* X Modal */}
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
                      <div className="flex flex-row items-center justify-between gap-2 p-2 mt-2 border border-gray-200 rounded">
                        <img src={x} alt="x" className="w-[100px] h-[100px]" />
                        <p className="text-[14px] text-[#000000] font-normal">Digər cihazdan [sosial] bölməsini açmaq üçün bu QR kodunu skan edin</p>
                      </div>
                      <Link to={'https://x.com/Ali_and_Nino'} target="_blank" rel="noopener noreferrer" className="flex flex-row items-center justify-center w-full gap-2 bg-gray-200 mt-5 py-3 rounded">
                        <FaXTwitter className="text-[20px] text-[#000000]" />
                        <p className="text-[14px] text-[#000000] font-medium">Aç X</p>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Telegram Modal */}
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
                      <div className="flex flex-row items-center justify-between gap-2 p-2 mt-2 border border-gray-200 rounded">
                        <img src={telegram} alt="telegram" className="w-[100px] h-[100px]" />
                        <p className="text-[14px] text-[#000000] font-normal">Digər cihazdan [sosial] bölməsini açmaq üçün bu QR kodunu skan edin</p>
                      </div>
                      <Link to={'https://t.me/ali_nino'} target="_blank" rel="noopener noreferrer" className="flex flex-row items-center justify-center w-full gap-2 bg-gray-200 mt-5 py-3 rounded">
                        <FaTelegram className="text-[20px] text-[#000000]" />
                        <p className="text-[14px] text-[#000000] font-medium">Aç Telegram</p>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Pinterest Modal */}
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
                      <div className="flex flex-row items-center justify-between gap-2 p-2 mt-2 border border-gray-200 rounded">
                        <img src={pinterest} alt="pinterest" className="w-[100px] h-[100px]" />
                        <p className="text-[14px] text-[#000000] font-normal">Digər cihazdan [sosial] bölməsini açmaq üçün bu QR kodunu skan edin</p>
                      </div>
                      <Link to={'https://www.pinterest.com/ali_and_nino/'} target="_blank" rel="noopener noreferrer" className="flex flex-row items-center justify-center w-full gap-2 bg-gray-200 mt-5 py-3 rounded">
                        <FaPinterest className="text-[20px] text-[#000000]" />
                        <p className="text-[14px] text-[#000000] font-medium">Aç Pinterest</p>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <div className='flex flex-row items-center justify-start gap-2 mt-4'>
                <div className='flex flex-col items-center gap-1'>
                  <span className='text-[14px] lg:text-[16px]'>Android</span>
                  <img src={playstore} alt="playstore" className="w-[140px] h-[140px] lg:w-[160px] lg:h-[160px]" />
                </div>
                <div className='flex flex-col items-center gap-1'>
                  <span className='text-[14px] lg:text-[16px]'>Apple(iOS)</span>
                  <img src={appstore} alt="appstore" className="w-[140px] h-[140px] lg:w-[160px] lg:h-[160px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Alt hissə */}
      <div className='w-full bg-[#f7f8fa] border-t border-[#eeeeee]'>
        <div className="flex flex-col items-center justify-center lg:flex-row lg:justify-between max-w-[1428px] mx-auto lg:px-[64px] py-6 lg:h-[85px] gap-2">
          <p className="text-[12px] lg:text-[14px] text-[#888888] font-medium text-center lg:text-left">
            © 2010-{currentYear} Alinino.az. "Ali&Nino" LLC .
            <span className='hover:text-[#f50809] underline cursor-pointer'>Sayt xəritəsi</span> <br />
            hazırlanmışdır
            <Link to={'https://prosales.studio/?utm_source=myshop-io369&utm_medium=templates&utm_campaign=startstore'} className='hover:text-[#f50809] underline'>
              ProSales
            </Link> platforma üçün
            <Link to={'https://www.insales.ru/?aff=9238d04d6'} className='hover:text-[#f50809] underline'>InSales</Link>
          </p>
          <div className='flex flex-row justify-center lg:justify-end items-center gap-3 mt-4 lg:mt-0'>
            <img src={million} alt="million" className="w-[70px] lg:w-[80px] h-auto" />
            <img src={visa} alt="visa" className="w-[50px] lg:w-[60px] h-auto" />
            <img src={mastercard} alt="mastercard" className="w-[30px] lg:w-[40px] h-auto" />
            <img src={mir} alt="mir" className="w-[60px] lg:w-[70px] h-auto" />
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;