import { Link } from "react-router-dom";

interface DataType {
  navbarPlacement?: string;
  // eslint-disable-next-line no-unused-vars
  toggleSubMenu?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const MainMenu: React.FC<DataType> = ({ navbarPlacement, toggleSubMenu }) => {
  return (
    <>
      <ul className={`nav navbar-nav ${navbarPlacement}`}>
        <li>
          <Link
            to="/"
            className="dropdown-toggle active"
            data-toggle="dropdown"
          >
            Home
          </Link>
        </li>
        <li className="dropdown">
          <Link
            to="#"
            className="dropdown-toggle"
            data-toggle="dropdown"
            onClick={toggleSubMenu}
          >
            Pages
          </Link>
          <ul className="dropdown-menu">
            <li>
              <Link to="/about-us">About Us</Link>
            </li>
            <li>
              <Link
                to="/chef"
                className="dropdown-toggle"
                data-toggle="dropdown"
              >
                Our Chef
              </Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/user-profile">User profile</Link>
            </li>
          </ul>
        </li>
        <li>
          <Link
            to="/food-menu"
            className="dropdown-toggle"
            data-toggle="dropdown"
          >
            Menu
          </Link>
        </li>
        <li>
          <Link
            to="/blog-with-sidebar"
            className="dropdown-toggle"
            data-toggle="dropdown"
          >
            Blog
          </Link>
        </li>
        <li>
          <Link to="/shop" className="dropdown-toggle" data-toggle="dropdown">
            Shop
          </Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
      </ul>
    </>
  );
};

export default MainMenu;
