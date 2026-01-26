import { Link } from "react-router-dom";
import logo3 from "/assets/img/logo-3.png";
import safronLogo from "/assets/img/safronLogo.jpeg";
import SocialShareV1 from "../social/SocialShareV1";
import FooterNewsletter from "./FooterNewsletter";

const FooterV1 = () => {
  return (
    <>
      <footer className="bg-dark footer-style-one text-light">
        <div className="container">
          <div className="row">
            {/* Single Item */}
            <div className="col-lg-3 col-md-6 footer-item mt-50">
              <div className="f-item about">
                <img src={safronLogo} alt="Image Not Found" />
                <p>
                  Discover culinary delights recipes and inspiration in our food
                  haven.
                </p>
                <ul className="opening-list">
                  <li>
                    Mon - Fri{" "}
                    <span className="text-end">8:00 AM - 6:00 PM</span>
                  </li>
                  <li>
                    Saturday <span className="text-end">9:00 AM - 5:00 PM</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Single Item */}
            <div className="col-lg-2 col-md-6 mt-50 footer-item pl-50 pl-md-15 pl-xs-15">
              <div className="f-item link">
                <h4 className="widget-title">Explore</h4>
                <ul>
                  <li>
                    <Link to="/about-us">Company Profile</Link>
                  </li>
                  <li>
                    <Link to="/about-us">About</Link>
                  </li>
                  <li>
                    <Link to="/contact">Help Center</Link>
                  </li>
                  <li>
                    <Link to="/contact">Career</Link>
                  </li>
                  <li>
                    <Link to="/about-us">Features</Link>
                  </li>
                  <li>
                    <Link to="/contact">Contact</Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Single Item */}
            <div className="col-lg-3 col-md-6 footer-item  mt-50">
              <div className="f-item contact">
                <h4 className="widget-title">Contact Info</h4>
                <ul className="contact-widget">
                  <li>
                    <div className="icon">
                      <i className="fas fa-map-marker-alt" />
                    </div>
                    <div className="content">123 Maple Street, Downtown</div>
                  </li>
                  <li>
                    <div className="icon">
                      <i className="fas fa-phone" />
                    </div>
                    <div className="content">
                      <a href="tel:2151234567">+1 (555) 234-6789</a> <br />{" "}
                      <a href="tel:2151234567">+1 (555) 345-9877</a>
                    </div>
                  </li>
                  <li>
                    <div className="icon">
                      <i className="fas fa-envelope" />
                    </div>
                    <div className="content">
                      <a href="mailto:name@email.com">
                        support@saffrontable.com
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Single Item */}
            <div className="col-lg-4 col-md-6 footer-item mt-50">
              <div className="f-item newsletter">
                <h4 className="widget-title">Newsletter</h4>
                <p>
                  Join our subscribers list to get the latest news and special
                  offers.
                </p>
                <FooterNewsletter />
                <div className="footer-socila-items mt-30">
                  <h4>Social Meida: </h4>
                  <ul className="footer-social">
                    <SocialShareV1 />
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="row align-center">
              <div className="col-lg-6">
                <p>
                  &copy; Copyright {new Date().getFullYear()} Saffron Table. All
                  Rights Reserved
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterV1;
