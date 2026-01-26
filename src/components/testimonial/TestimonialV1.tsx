import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Autoplay, Pagination, Navigation } from "swiper/modules";
import food1 from "/assets/img/team/3.jpg";
import team10 from "/assets/img/team/1.jpg";
import food6 from "/assets/img/team/4.jpg";
import team11 from "/assets/img/team/2.jpg";

interface DataType {
  sectionClass?: string;
}

const TestimonialV1 = ({ sectionClass }: DataType) => {
  return (
    <>
      <div
        className={`testimonial-style-one-area default-padding text-center ${sectionClass ? sectionClass : ""}`}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <Swiper
                direction={"horizontal"}
                loop={true}
                autoplay={false}
                pagination={{
                  el: ".swiper-pagination",
                  type: "bullets",
                  clickable: true,
                }}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
                className="testimonial-style-one-carousel"
                modules={[Keyboard, Autoplay, Pagination, Navigation]}
              >
                <div className="swiper-wrapper">
                  {/* Single item */}
                  <SwiperSlide className="swiper-slide">
                    <div className="testimonial-style-one">
                      <div className="item">
                        <div className="content">
                          <div className="tm-review">
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                          </div>
                          <div className="provider">
                            <h4>Best Chicken Fry</h4>
                          </div>
                          <p>
                            {`“Saffron Table is our go-to spot for lunch and casual dinners.
The family sets are perfect for sharing, and everything tastes homemade.
Friendly staff, good food, and a place you actually want to come back to.”
`}
                          </p>
                          <div className="tm-proivder-thumb">
                            <img src={food1} alt="Image Not Found" />
                            <img src={team10} alt="Image Not Found" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>

                  {/* Single item */}
                  <SwiperSlide className="swiper-slide">
                    <div className="testimonial-style-one">
                      <div className="item">
                        <div className="content">
                          <div className="tm-review">
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                          </div>
                          <div className="provider">
                            <h4>This pizza is so good</h4>
                          </div>
                          <p>
                            {`“We come here at least once a week with our kids. The food is always fresh,
the portions are great, and the kids’ menu makes ordering so easy.
It feels comfortable and relaxed — exactly what a family restaurant should be.”
`}
                          </p>
                          <div className="tm-proivder-thumb">
                            <img src={food6} alt="Image Not Found" />
                            <img src={team11} alt="Image Not Found" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                </div>
              </Swiper>

              {/* Navigation */}
              <div className="testimonial-pagination">
                <div className="swiper-pagination" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestimonialV1;
