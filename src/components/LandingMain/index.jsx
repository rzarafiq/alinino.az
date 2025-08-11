import Carusel from './Carusel'
import YeniAz from './YeniAz'
import YeniEn from './YeniEn'
import YeniFrDe from './YeniFrDe'
import YeniRu from './YeniRu'
import YeniTr from './YeniTr'

function LandigMain() {
  return (
    <>
     <Carusel />
     <YeniAz />
     <YeniTr />
     <YeniEn />
     <YeniRu />
     <YeniFrDe />
    </>
  )
}

export default LandigMain


// const isAvailable = selectedProduct?.variants?.[0]?.quantity > 0 && selectedProduct?.available;
// const savings = selectedProduct?.variants?.[0]?.old_price && selectedProduct?.variants?.[0]?.price
// ? (parseFloat(selectedProduct.variants[0].old_price) - parseFloat(selectedProduct.variants[0].price)).toFixed(2)
// : null;
// const hasDiscount = selectedProduct?.variants?.[0]?.old_price && selectedProduct.variants?.[0]?.old_price > selectedProduct.variants?.[0]?.price;
// const discountPercent = hasDiscount
// ? Math.round(((parseFloat(selectedProduct.variants[0].old_price) - parseFloat(selectedProduct.variants[0].price)) / parseFloat(selectedProduct.variants[0].old_price)) * 100)
// : 0;
// const hasExpress = selectedProduct?.characteristics?.some((c) => c.permalink === "ekspress");
// const hasComingSoon = selectedProduct?.characteristics?.some((c) => c.title === "TEZLİKLƏ!");
// const hasFreeDelivery = selectedProduct?.characteristics?.some((c) => c.permalink === "PULSUZ ÇATDIRILMA");
// const unitText = selectedProduct?.unit === 'pce' ? 'ədəd' : selectedProduct?.unit;

// <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
//   {/* Endirim %-i stickerı */}
//   {hasDiscount && (
//     <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
//       % {discountPercent} ENDİRİM
//     </div>
//   )}

//   {/* Təzəliklə stickerı */}
//   {hasComingSoon && (
//     <div className="bg-yellow-500 text-gray-800 text-xs font-bold px-2 py-1 rounded-full shadow-md">
//       TEZLİKLƏ!
//     </div>
//   )}

//   {/* Ekspress stickerı */}
//   {hasExpress && (
//     <div className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
//       EKSPRESS
//     </div>
//   )}

//   {/* Pulsuz Çatdırılma stickerı */}
//   {hasFreeDelivery && (
//     <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
//       <MdOutlineLocalShipping className="text-sm" />
//       PULSUZ ÇATDIRILMA
//     </div>
//   )}

//   {/* Satıldı stickerı */}
//   {!isAvailable && (
//     <div className="bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
//       SATILDI
//     </div>
//   )}
// </div>