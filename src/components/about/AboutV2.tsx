import aboutRestaurant3 from "/assets/img/about/aboutRestaurant3.jpg";
import { Link } from "react-router-dom";

const AboutV2 = () => {
  return (
    <>
      <div className="about-style-two-area default-padding">
        <div className="container">
          <div className="row align-center">
            <div className="col-lg-6">
              <div
                className="thumb-style-two"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <img src={aboutRestaurant3} alt="Image Not Found" />
              </div>
            </div>
            <div className="col-lg-5 offset-lg-1">
              <div className="about-style-two-info">
                <h4 className="sub-heading">Welcome At</h4>
                <h2 className="title">Saffron Table</h2>
                <p>
                  Saffron Table is a family-friendly restaurant built around
                  simple, good food and a welcoming atmosphere. We believe meals
                  taste better when shared, so our menu includes family sets,
                  kids’ meals, and options for lunch, dinner, and dessert.
                </p>
                <Link
                  className="btn btn-theme btn-md animation"
                  to="/food-menu"
                >
                  Explore menu
                </Link>
                <ul className="launch-time">
                  <li data-aos="fade-up">
                    <h4>Lunch</h4>
                    <ul>
                      <li>Saturday and Sunday</li>
                      <li>Reservations from 12pm to 1.30pm</li>
                    </ul>
                  </li>
                  <li data-aos="fade-up">
                    <h4>Dinner</h4>
                    <ul>
                      <li>Thursday to Sunday</li>
                      <li>Reservations from 6pm to 8.45pm</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutV2;
