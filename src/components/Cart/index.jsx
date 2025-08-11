import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";
import { FaRegHeart, FaHeart, FaMinus, FaPlus } from "react-icons/fa";
import { RiCloseFill } from "react-icons/ri";
import { BsCart3 } from "react-icons/bs";

function Cart() {
  const [cartProducts, setCartProducts] = useState([]);
  const [cartQuantities, setCartQuantities] = useState({});
  const [likedProductIds, setLikedProductIds] = useState({});
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cartProducts")) || [];
    setCartProducts(stored);

    const quantities = {};
    stored.forEach((product) => {
      quantities[product.id] = product.quantity || 1;
    });
    setCartQuantities(quantities);
  }, []);

  useEffect(() => {
    const liked = JSON.parse(localStorage.getItem("likedProducts")) || [];
    const likedMap = {};
    liked.forEach((p) => (likedMap[p.id] = true));
    setLikedProductIds(likedMap);
  }, []);

  const handleLikeToggle = (product) => {
    const updated = { ...likedProductIds };
    let updatedList = JSON.parse(localStorage.getItem("likedProducts")) || [];

    if (updated[product.id]) {
      delete updated[product.id];
      updatedList = updatedList.filter((p) => p.id !== product.id);
    } else {
      updated[product.id] = true;
      updatedList.push(product);
    }

    localStorage.setItem("likedProducts", JSON.stringify(updatedList));
    setLikedProductIds(updated);
    window.dispatchEvent(new Event("likedProductsUpdated"));
  };

  const handleModalQuantityChange = (productId, delta) => {
    setCartQuantities((prev) => {
      const updated = { ...prev };
      updated[productId] = Math.max(1, (updated[productId] || 1) + delta);

      const updatedCart = cartProducts.map((p) =>
        p.id === productId ? { ...p, quantity: updated[productId] } : p
      );

      localStorage.setItem("cartProducts", JSON.stringify(updatedCart));
      setCartProducts(updatedCart);

      return updated;
    });
  };

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

  const handleClear = () => {
    setInputValue("");
  };

  const totalAmount = cartProducts
    .reduce((total, product) => {
      const price = Number(product.variants?.[0]?.price || 0);
      const quantity = cartQuantities[product.id] || 1;
      return total + price * quantity;
    }, 0)
    .toFixed(2);

  return (
    <>
      {/* Breadcrumb */}
      <div className="w-full p-1 bg-gray-100">
        <ol className="flex h-8 max-w-[1428px] mx-auto px-10 lg:px-[64px] space-x-2 text-[12px] text-[#777777]">
          <li className="flex items-center">
            <Link to={"/"} className="hover:text-[#dc0708]">Əsas</Link>
          </li>
          <li className="flex items-center space-x-1">
            <span>/</span>
            <p className="px-1 font-medium cursor-default">Səbət</p>
          </li>
        </ol>
      </div>

      {/* Title & Clear */}
      <div className="flex flex-row items-center justify-between max-w-[1428px] mx-auto h-full px-10 lg:px-[64px] mt-5">
        <div className={`w-[920px] ${cartProducts.length > 0 ? "border-b border-[#dddddd] pb-4" : ""}`}>
          <h2 className="text-[28px]">Səbət</h2>
        </div>

        {cartProducts.length > 0 && (
          <div
            onClick={() => {
              localStorage.removeItem("cartProducts");
              setCartProducts([]);
              setCartQuantities({});
              window.dispatchEvent(new Event("cartUpdated"));
            }}
            className="flex flex-row items-center gap-1 text-[#777777] cursor-pointer"
          >
            <FiTrash2 className="text-[18px]" />
            <span className="text-[14px] border-b border-dashed">Təmizlə</span>
          </div>
        )}
      </div>

      {/* Cart Body */}
      <div className="flex flex-col gap-4 max-w-[1428px] mx-auto h-full px-10 lg:px-[64px] overflow-y-auto">
        {cartProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <BsCart3 className="text-[120px] text-[#f5f5f5]" />
            <p className="text-[14px] text-[#9d9d9d] text-center mt-4">
              Səbətiniz hələ ki boşdur
            </p>
            <div className="flex flex-row items-center gap-5 mt-10">
              <Link to="/" className="text-[16px] text-[#1a6bff] border-2 border-[#1a6bff] px-6.5 py-2 rounded-md">
                Əsas səhifə
              </Link>
              <Link to="/catalog" className="text-[16px] text-white bg-[#1a6bff] px-10.5 py-2.5 rounded-md">
                Kataloq
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Product List */}
            <div className="flex-1">
              {cartProducts.map((product) => {
                const quantity = cartQuantities[product.id] || 1;
                const unitPrice = Number(product.variants?.[0]?.price || 0);

                return (
                  <div
                    key={product.id}
                    className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-[#dddddd] pb-3 mt-3"
                  >
                    <div className="flex flex-row items-center gap-10">
                      <img
                        src={product.first_image?.medium_url || "/no-image.png"}
                        alt={product.title}
                        className="w-[50px] h-[80px] object-cover rounded"
                      />
                      <div>
                        <span className="text-[14px] font-medium text-[#000000]">
                          {product.title}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center gap-4 w-full lg:w-auto">
                      <div className="flex flex-col items-end">
                        <span className="text-[14px] text-[#777777] font-normal">
                          {quantity} × {unitPrice.toFixed(2)} AZN
                        </span>
                        <span className="text-[16px] text-[#000000] font-semibold">
                          {unitPrice.toFixed(2)} AZN
                        </span>
                      </div>

                      <div className="flex items-center gap-3 rounded-md">
                        <button onClick={() => handleModalQuantityChange(product.id, -1)} className="text-[#777777] hover:text-[#000000]">
                          <FaMinus className="text-[14px]" />
                        </button>
                        <div className="flex items-center justify-center text-[14px] text-[#000000] font-medium w-[70px] h-[40px] border border-[#dddddd] rounded">
                          <span>{quantity}</span>
                        </div>
                        <button onClick={() => handleModalQuantityChange(product.id, 1)} className="text-[#777777] hover:text-[#000000]">
                          <FaPlus className="text-[14px]" />
                        </button>
                      </div>

                      <div className="flex items-center justify-center">
                        {likedProductIds[product.id] ? (
                          <FaHeart className="text-[24px] text-[#f50809] cursor-pointer" onClick={() => handleLikeToggle(product)} />
                        ) : (
                          <FaRegHeart className="text-[24px] text-[#777777] hover:text-[#f50809] cursor-pointer" onClick={() => handleLikeToggle(product)} />
                        )}
                      </div>

                      <button onClick={() => handleRemoveFromCart(product.id)} className="text-[#777777] hover:text-[#dc2626]">
                        <FiTrash2 size={22} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Kupon və Sifariş */}
            <div className="w-full lg:w-[365px] bg-[#f7f8fa] rounded p-1">
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

                <button className="w-full h-[50px] bg-[#f50809] text-white text-[18px] py-2 mt-3 rounded-md hover:bg-[#dc2626] transition">
                  Sifariş edin
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart