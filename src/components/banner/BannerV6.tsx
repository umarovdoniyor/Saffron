import { Link } from "react-router-dom";
import illustration8 from "/assets/img/illustration/8.png";
import illustration17 from "/assets/img/illustration/17.png";
import banner1 from "/assets/img/banner/banner1.jpg";
import banner2 from "/assets/img/banner/banner2.jpg";
import shape26 from "/assets/img/shape/26.png";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Keyboard,
  Autoplay,
  Pagination,
  Navigation,
  EffectFade,
} from "swiper/modules";

const BannerV6 = () => {
  return (
    <>
      <div
        className="banner-area banner-style-six navigation-circle bg-dark text-light overflow-hidden bg-dark bg-cover"
        style={{ backgroundImage: "url(/assets/img/shape/14.jpg)" }}
      >
        <Swiper
          direction={"horizontal"}
          loop={true}
          speed={3000}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          effect={"fade"}
          fadeEffect={{
            crossFade: true,
          }}
          pagination={{
            el: ".swiper-pagination",
            type: "bullets",
            clickable: true,
          }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          className="banner-fade"
          modules={[Keyboard, Autoplay, Pagination, Navigation, EffectFade]}
        >
          <div className="swiper-wrapper">
            {/* Single Item */}
            <SwiperSlide>
              <div className="container">
                <div className="content">
                  <div className="row align-center">
                    <div className="col-lg-6">
                      <h4>Fresh & Family-Friendly</h4>
                      <h2>Easy Lunch for Everyone</h2>
                      <p>
                        Enjoy freshly prepared lunch meals made for parents,
                        kids, and busy days. Simple flavors, generous portions,
                        and something everyone will love.
                      </p>
                      <div className="button mt-40">
                        <Link
                          className="btn btn-theme btn-md animation"
                          to="/shop"
                        >
                          Order Now
                        </Link>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="thumb">
                        <img src={banner1} alt="Image Not Found" />
                        <img src={shape26} alt="Image Not Found" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>

            {/* Single Item */}
            <SwiperSlide>
              <div className="container">
                <div className="content">
                  <div className="row align-center">
                    <div className="col-lg-6">
                      <h4>Lunch Made Simple</h4>
                      <h2>Daily Family Lunch Specials</h2>
                      <p>
                        Perfect for a quick break or a relaxed family meal.
                        Choose from our lunch sets, kids’ favorites, and fresh
                        daily dishes.
                      </p>
                      <div className="button mt-40">
                        <Link
                          className="btn btn-theme btn-md animation"
                          to="/shop"
                        >
                          Order Now
                        </Link>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="thumb">
                        <img src={banner2} alt="Image Not Found" />
                        <img src={shape26} alt="Image Not Found" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </div>
          <div className="swiper-nav-left">
            <div className="swiper-button-prev" />
            <div className="swiper-button-next" />
          </div>
        </Swiper>
      </div>
    </>
  );
};

export default BannerV6;
