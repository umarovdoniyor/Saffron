import RelatedProducts from "../product/RelatedProducts";
import ShopSingleTab from "./ShopSingleTab";
import { Link } from "react-router-dom";
import RatingsStar from "../utilities/RatingsStar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { addToCart } from "../../store/slices/cartSlice";
import { toast } from "react-toastify";

interface DataType {
  id?: number | string;
  thumb?: string;
  image?: string;
  productImages?: string[];
  badge?: string;
  tags?: string[];
  collection?: string; // productCollection: DISH, DRINK, DESSERT, SALAD, SANDWICH
  name?: string;
  title?: string;
  price?: number;
  oldPrice?: number;
  rating?: number;
  reviews?: number;
  description?: string;
  text?: string;
  inStock?: boolean;
  stockCount?: number;
}

const ShopSingleContent = ({ productInfo }: { productInfo: DataType }) => {
  const {
    name,
    title,
    reviews = 0,
    rating = 5,
    oldPrice,
    price,
    tags = [],
    description,
    text,
    thumb,
    image,
    inStock = true,
    stockCount = 0,
  } = productInfo;

  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const handleAddToCart = () => {
    const alreadyInCart = cartItems.some((item) => item.id === productInfo.id);

    if (alreadyInCart) {
      toast.warning("Product already in cart");
    } else {
      dispatch(
        addToCart({
          id: productInfo.id!,
          title: productInfo.title || productInfo.name!,
          price:
            typeof productInfo.price === "number"
              ? productInfo.price
              : parseFloat(String(productInfo.price || "0").replace("$", "")),
          thumb: productInfo.thumb || productInfo.image || "",
          quantity: 1,
        }),
      );
      toast.success("Product added successfully");
    }
  };

  return (
    <>
      <div className="validtheme-shop-single-area default-padding">
        <div className="container">
          <div className="product-details">
            <div className="row">
              <div className="col-lg-6">
                <div className="product-thumb">
                  <div className="product-image-wrapper">
                    <img
                      src={thumb || image || "/assets/img/shop/1.jpg"}
                      alt={title || name || "Product"}
                      style={{
                        width: "100%",
                        height: "auto",
                        borderRadius: "8px",
                      }}
                    />
                    {productInfo.badge && (
                      <span className="onsale theme">{productInfo.badge}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="single-product-contents">
                  <div className="summary-top-box">
                    <div className="product-tags">
                      {tags &&
                        tags.length > 0 &&
                        tags.map((data, index) => (
                          <Link key={index} to="#">
                            {data}
                            {index < tags.length - 1 && ","}
                          </Link>
                        ))}
                    </div>
                    <div className="review-count">
                      <RatingsStar ratings={rating} />
                      <span>
                        ({reviews} Review{reviews !== 1 ? "s" : ""})
                      </span>
                    </div>
                  </div>
                  <h2 className="product-title">
                    {title || name || "Product"}
                  </h2>
                  <div className="price">
                    {oldPrice && (
                      <span className="me-2">
                        <del>${oldPrice.toFixed(2)}</del>
                      </span>
                    )}
                    <span>${price ? price.toFixed(2) : "0.00"}</span>
                  </div>
                  <div
                    className={`product-stock ${inStock ? "validthemes-in-stock" : "validthemes-out-of-stock"}`}
                  >
                    <span>
                      {inStock
                        ? `In Stock (${stockCount} available)`
                        : "Out of Stock"}
                    </span>
                  </div>
                  <p>
                    {description ||
                      text ||
                      "Delicious food item from our menu."}
                  </p>
                  <div className="product-purchase-list">
                    <input
                      type="number"
                      id="quantity"
                      step={1}
                      name="quantity"
                      min={0}
                      placeholder="0"
                    />
                    <Link
                      to="#"
                      className="btn secondary btn-theme btn-sm animation"
                      onClick={handleAddToCart}
                    >
                      <i className="fas fa-shopping-cart" />
                      Add to cart
                    </Link>
                    <div className="shop-action">
                      <ul>
                        <li className="wishlist">
                          <Link to="#">
                            <span>Add to wishlist</span>
                          </Link>
                        </li>
                        <li className="compare">
                          <Link to="#">
                            <span>Compare</span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="product-estimate-delivary">
                    <i className="fas fa-box-open" />
                    <strong> 2-day Delivery</strong>
                    <span>Speedy and reliable parcel delivery!</span>
                  </div>
                  <div className="product-meta">
                    <span className="sku">
                      <strong>SKU:</strong> {productInfo.id || "N/A"}
                    </span>
                    <span className="posted-in">
                      <strong>Category:</strong>
                      {(productInfo as any).collection ? (
                        <Link to="#">
                          {(productInfo as any).collection.charAt(0) +
                            (productInfo as any).collection
                              .slice(1)
                              .toLowerCase()}
                        </Link>
                      ) : (
                        <Link to="#">Uncategorized</Link>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ShopSingleTab productInfo={productInfo} />
          <RelatedProducts currentProduct={productInfo as any} />
        </div>
      </div>
    </>
  );
};

export default ShopSingleContent;
