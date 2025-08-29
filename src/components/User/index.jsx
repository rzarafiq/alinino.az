import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

function User() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // URL-dən tab parametrini yoxlayıb və uyğun formanı açır
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    
    if (tab === 'registration') {
      setShowRegistration(true);
      setShowRecovery(false);
    } else if (tab === 'recovery') {
      setShowRecovery(true);
      setShowRegistration(false);
    } else if (tab === 'login') {
      setShowRegistration(false);
      setShowRecovery(false);
    }
  }, [location.search]);

  const showRecoveryForm = () => {
    setShowRecovery(true);
    setShowRegistration(false);
    navigate('/user?tab=recovery', { replace: true });
  };
  
  const showLoginForm = () => {
    setShowRecovery(false);
    setShowRegistration(false);
    navigate('/user?tab=login', { replace: true });
  };
  
  const showRegistrationForm = () => {
    setShowRegistration(true);
    setShowRecovery(false);
    navigate('/user?tab=registration', { replace: true });
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
            {showRegistration ? (
              <p className="px-1 font-medium cursor-default">Qeydiyyat</p>
            ) : (
              <p className="px-1 font-medium cursor-default">Alıcı kabinetinə giriş</p>
            )}
          </li>
        </ol>
      </div>

      {/* Alıcı kabinetinə giriş */}
      <div className="flex items-center justify-center w-full max-w-[1428px] mx-auto px-2 md:px-10 lg:px-[64px] my-5">
        <div className="flex flex-col items-center justify-center w-full max-w-[500px] bg-[#ffffff] rounded-md p-6 shadow-[0_0_20px_4px_rgba(0,0,0,0.1)]">
          
          {/* Giriş Formu */}
          {!showRecovery && !showRegistration ? (
            <>
              <h2 className="text-[28px] md:text-[32px] text-[#000000] mb-3 md:mb-5 text-center">
                Alıcı kabinetinə giriş
              </h2>
              <label htmlFor="email" className="flex flex-col w-full mb-3 md:mb-5">
                <p className="flex flex-row gap-1 text-[14px] md:text-[16px] text-[#000000] mb-1">Telefon və yaxud E-mail
                  <span className="text-[#f50809]">*</span>
                </p>
                <input
                  type="email"
                  id="email"
                  className="w-full p-2 border border-[#dddddd] rounded-md outline-none"
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
                    className="w-full p-2 border border-[#dddddd] rounded-md outline-none pr-10"
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
              <button className="w-full py-3 mb-3 md:mb-5 text-[14px] md:text-[16px] text-[#ffffff] bg-[#dc0708] hover:bg-[#f50809] rounded-md cursor-pointer transition-colors duration-300">
                Daxil olun
              </button>
              <div className="flex justify-center gap-5 text-[14px] md:text-[16px] text-[#000000]">
                <button 
                  onClick={showRecoveryForm}
                  className="border-b border-dashed border-[#000000] hover:border-[#f50809] hover:text-[#f50809] cursor-pointer transition-colors duration-300"
                >
                  Şifrəni bərpa edin
                </button>
                <button 
                  onClick={showRegistrationForm}
                  className="border-b border-dashed border-[#000000] hover:border-[#f50809] hover:text-[#f50809] cursor-pointer transition-colors duration-300"
                >
                  Qeydiyyatdan keçin
                </button>
              </div>
            </>
          ) : showRecovery ? (
            <>
              <h2 className="text-[28px] md:text-[32px] text-[#000000] mb-3 md:mb-5 text-center">
                Alıcı kabinetinə giriş
              </h2>
              <label htmlFor="recovery-email" className="flex flex-col w-full mb-3 md:mb-5">
                <p className="flex flex-row gap-1 text-[14px] md:text-[16px] text-[#000000] mb-1">E-mail
                  <span className="text-[#f50809]">*</span>
                </p>
                <input
                  type="email"
                  id="recovery-email"
                  className="w-full p-2 border border-[#dddddd] rounded-md outline-none"
                />
              </label>
              <button className="w-full py-3 mb-3 md:mb-5 text-[14px] md:text-[16px] text-[#ffffff] bg-[#dc0708] hover:bg-[#f50809] rounded-md cursor-pointer transition-colors duration-300">
                Şifrəni bərpa edin
              </button>
              <div className="flex justify-center gap-5 text-[14px] md:text-[16px] text-[#000000]">
                <button 
                  onClick={showLoginForm}
                  className="border-b border-dashed border-[#000000] hover:border-[#f50809] hover:text-[#f50809] cursor-pointer transition-colors duration-300"
                >
                  Şifrəmi xatırladım
                </button>
              </div>
            </>
          ) : showRegistration ? (
            <>
              <h2 className="text-[28px] md:text-[32px] text-[#000000] mb-3 md:mb-5 text-center">
                Qeydiyyat
              </h2>
              <label htmlFor="fullname" className="flex flex-col w-full mb-3 md:mb-5">
                <p className="flex flex-row gap-1 text-[14px] md:text-[16px] text-[#000000] mb-1">Şəxsi əlaqə (Adı, soyadı, atasının adı)
                  <span className="text-[#f50809]">*</span>
                </p>
                <input
                  type="text"
                  id="fullname"
                  className="w-full p-2 border border-[#dddddd] rounded-md outline-none"
                />
              </label>
              <label htmlFor="phone" className="flex flex-col w-full mb-3 md:mb-5">
                <p className="flex flex-row gap-1 text-[14px] md:text-[16px] text-[#000000] mb-1">Əlaqə nömrəsi (sifarişin detallarını dəqiqləşdirmək üçün)
                  <span className="text-[#f50809]">*</span>
                </p>
                <input
                  type="tel"
                  id="phone"
                  className="w-full p-2 border border-[#dddddd] rounded-md outline-none"
                />
                <span className="text-[14px] md:text-[16px] text-[#999999] mt-1">Məsələn: +994 111-11-11</span>
              </label>
              <label htmlFor="recipient-phone" className="flex flex-col w-full mb-3 md:mb-5">
                <p className="flex flex-row gap-1 text-[14px] md:text-[16px] text-[#000000] mb-1">Sifarişi alan şəxsin nömrəsi</p>
                <input
                  type="tel"
                  id="recipient-phone"
                  className="w-full p-2 border border-[#dddddd] rounded-md outline-none"
                />
                <span className="text-[14px] md:text-[16px] text-[#999999] mt-1">Lütfən, sifarişi təhvil alacaq şəxsin nömrəsini qeyd edin</span>
              </label>
              <label htmlFor="reg-email" className="flex flex-col w-full mb-3 md:mb-5">
                <p className="flex flex-row gap-1 text-[14px] md:text-[16px] text-[#000000] mb-1">Elektron ünvan
                  <span className="text-[#f50809]">*</span>
                </p>
                <input
                  type="email"
                  id="reg-email"
                  className="w-full p-2 border border-[#dddddd] rounded-md outline-none"
                />
              </label>
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
                    onClick={() => setShowPassword(!showPassword)}
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
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-2 flex items-center text-[22px] text-[#000000] cursor-pointer"
                  >
                    {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                  </button>
                </div>
              </label>
              <button className="w-full py-3 mb-3 md:mb-5 text-[14px] md:text-[16px] text-[#ffffff] bg-[#dc0708] hover:bg-[#f50809] rounded-md cursor-pointer transition-colors duration-300">
                Qeydiyyatdan keçirin
              </button>
              <div className="flex justify-center gap-5 text-[14px] md:text-[16px] text-[#000000]">
                <button 
                  onClick={showLoginForm}
                  className="border-b border-dashed border-[#000000] hover:border-[#f50809] hover:text-[#f50809] cursor-pointer transition-colors duration-300"
                >
                  Hesabım var
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default User;
