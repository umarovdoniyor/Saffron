import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../../store/slices/cartSlice";
import { toast } from "react-toastify";
import { RootState } from "../../store/store";

interface DataType {
  id?: number | string;
  thumb?: string;
  badge?: string;
  tags?: string[] | undefined;
  name?: string;
  price?: number | string;
  oldPrice?: number | string;
}

const SingleProductList = ({ product }: { product: DataType }) => {
  const { id, thumb, badge, tags, name, price } = product;

  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  // Check if thumb is already a full URL (from backend API)
  const imageUrl =
    thumb && (thumb.startsWith("http://") || thumb.startsWith("https://"))
      ? thumb
      : `/assets/img/shop/${thumb}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("🛒 Add to cart clicked - List view", { id, name, price });

    const alreadyInCart = cartItems.some((item) => item.id === product.id);

    if (alreadyInCart) {
      toast.warning("Product already in cart");
    } else {
      const numericPrice =
        typeof price === "number"
          ? price
          : parseFloat(String(price || "0").replace("$", ""));

      dispatch(
        addToCart({
          id: product.id!,
          title: product.name!,
          price: numericPrice,
          thumb: product.thumb!,
          quantity: 1,
        }),
      );
      toast.success("Product added successfully");
    }
  };

  return (
    <>
      <li className="product">
        <div className="product-contents">
          <div className="row align-center">
            <div className="col-lg-5 col-md-5">
              <div className="product-image" style={{ position: "relative" }}>
                {badge && badge !== "" && (
                  <span
                    className="onsale"
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      zIndex: 10,
                    }}
                  >
                    {badge}
                  </span>
                )}
                <Link to={`/shop-single/${id}`}>
                  <img src={imageUrl} alt="Product" width={450} height={450} />
                </Link>
                <div className="shop-action">
                  <ul>
                    <li className="cart">
                      <Link to="#" onClick={handleAddToCart}>
                        <span>Add to cart</span>
                      </Link>
                    </li>
                    <li className="wishlist">
                      <Link to="#">
                        <span>Add to wishlist</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-7 col-md-7">
              <div className="product-caption">
                <div
                  className="product-tags"
                  style={{
                    minHeight: "24px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tags && tags.length > 0 ? (
                    tags.map((data, index) => (
                      <Link to="#" key={index}>
                        {data}
                      </Link>
                    ))
                  ) : (
                    <span style={{ visibility: "hidden" }}>-</span>
                  )}
                </div>
                <h4
                  className="product-title"
                  style={{
                    minHeight: "48px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  <Link to={`/shop-single/${id}`}>{name}</Link>
                </h4>
                <div className="price">
                  <span>
                    ${typeof price === "number" ? price.toFixed(2) : price}
                  </span>
                </div>
                <Link to="#" className="cart-btn" onClick={handleAddToCart}>
                  <i className="fas fa-shopping-bag" />
                  Add to cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </li>
    </>
  );
};

export default SingleProductList;
