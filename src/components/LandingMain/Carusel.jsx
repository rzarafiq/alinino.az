import { useRef } from 'react';
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import slide_1 from "../../assets/img/slide_1.jpg";
import slide_2 from "../../assets/img/slide_2.jpg";
import slide_3 from "../../assets/img/slide_3.jpg";
import slide_4 from "../../assets/img/slide_4.jpg";
import slide_5 from "../../assets/img/slide_5.jpg";
import slide_6 from "../../assets/img/slide_6.jpg";
import slide_7 from "../../assets/img/slide_7.jpg";
import slide_8 from "../../assets/img/slide_8.jpg";

const slides = [
  { id: 1, image: slide_1, href: "#", alt: "Slide 1" },
  { id: 2, image: slide_2, href: "#", alt: "Slide 2" },
  { id: 3, image: slide_3, href: "#", alt: "Slide 3" },
  { id: 4, image: slide_4, href: "#", alt: "Slide 4" },
  { id: 5, image: slide_5, href: "#", alt: "Slide 5" },
  { id: 6, image: slide_6, href: "#", alt: "Slide 6" },
  { id: 7, image: slide_7, href: "#", alt: "Slide 7" },
  { id: 8, image: slide_8, href: "#", alt: "Slide 8" }
];

function Carusel() {
  const swiperRef = useRef(null);

  return (
    <section className="section widget-slider py-4 mt-14 lg:mt-0">
      <div className="relative flex justify-center items-center group w-full max-w-[1428px] mx-auto px-10 lg:px-[64px] h-auto rounded-md">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          autoplay={{
            delay: 8000,
            disableOnInteraction: false,
          }}
          pagination={{
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: (index, className) => {
              return `<span class="${className} custom-bullet"></span>`;
            },
          }}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover rounded-md cursor-pointer"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-22 top-1/1.5 z-10 p-2 bg-[#ffffff67] hover:bg-[#ffffff] rounded-full shadow cursor-pointer
            opacity-0 -translate-x-5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
        >
          <GoArrowLeft className="text-3xl text-gray-700 hover:text-black" />
        </button>

        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-22 top-1/1.5 z-10 p-2 bg-[#ffffff67] hover:bg-[#ffffff] rounded-full shadow cursor-pointer
            opacity-0 translate-x-5 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
        >
          <GoArrowRight className="text-3xl text-gray-700 hover:text-black" />
        </button>

        <div className="swiper-pagination -mb-8 flex justify-center gap-1"></div>
      </div>

      <style>
        {`
          .swiper-pagination-bullet {
            background-color: #333333;
            width: 8px;
            height: 8px;
            border-radius: 9999px;
            transition: all 0.3s ease;
          }
          .swiper-pagination-bullet-active {
            background-color: #dc0708;
            width: 25px !important;
          }
        `}
      </style>
    </section>
  );
}

export default Carusel;
