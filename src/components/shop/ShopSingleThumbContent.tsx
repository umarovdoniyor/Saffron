import ShopSingleTab from "./ShopSingleTab";
import RelatedProducts from "../product/RelatedProducts";
import { Link } from "react-router-dom";
import RatingsStar from "../utilities/RatingsStar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { toast } from "react-toastify";
import { addToCart } from "../../store/slices/cartSlice";

interface DataType {
  id?: number;
  thumb?: string;
  image?: string; // Backend full URL
  badge?: string;
  tags?: string[];
  category?: string[]; // Backend might use category array
  name?: string;
  title?: string; // Backend might use title
  price?: string | number;
  oldPrice?: string | number;
  ratings?: number;
  reviews?: number;
  description?: string;
  sku?: string;
  stock?: string | boolean; // "In Stock" or true/false
  deliveryDays?: number;
  // Tab content
  detailedDescription?: string;
  ingredients?: string[];
  weight?: string;
  dimensions?: string;
  nutritionalInfo?: { [key: string]: string };
  productReviews?: Array<{
    id: number;
    author: string;
    avatar?: string;
    rating: number;
    date: string;
    comment: string;
  }>;
}

const ShopSingleThumbContent = ({ productInfo }: { productInfo: DataType }) => {
  const {
    thumb,
    image,
    name,
    title,
    reviews = 0,
    ratings = 0,
    oldPrice,
    price,
    tags,
    category,
    description,
    sku,
    stock,
    deliveryDays = 2,
  } = productInfo;

  // Handle image URL (backend or local)
  const getImageSrc = () => {
    const imgSource = image || thumb;
    if (!imgSource) return "/assets/img/placeholder.jpg";

    if (
      typeof imgSource === "string" &&
      (imgSource.startsWith("http://") || imgSource.startsWith("https://"))
    ) {
      return imgSource;
    }

    return `/assets/img/shop/${imgSource}`;
  };

  // Calculate discount percentage
  const getDiscountPercentage = () => {
    if (!oldPrice || !price) return null;
    const oldPriceNum =
      typeof oldPrice === "string"
        ? parseFloat(oldPrice.replace("$", ""))
        : oldPrice;
    const priceNum =
      typeof price === "string" ? parseFloat(price.replace("$", "")) : price;
    if (oldPriceNum && priceNum && oldPriceNum > priceNum) {
      const discount = Math.round(
        ((oldPriceNum - priceNum) / oldPriceNum) * 100,
      );
      return discount;
    }
    return null;
  };

  // Format price
  const formatPrice = (priceValue: string | number | undefined) => {
    if (!priceValue) return "0.00";
    if (typeof priceValue === "number") return priceValue.toFixed(2);
    return priceValue.replace("$", "");
  };

  const displayName = name || title;
  const displayTags = tags || category?.map((cat) => cat.replace(".", ""));
  const discountPercent = getDiscountPercentage();
  const stockStatus =
    typeof stock === "boolean"
      ? stock
        ? "In Stock"
        : "Out of Stock"
      : stock || "In Stock";

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
          title: displayName!,
          price:
            typeof price === "number" ? price : parseFloat(formatPrice(price)),
          thumb: getImageSrc(),
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
                  <div className="item-box">
                    <div className="product-item">
                      <img
                        src={getImageSrc()}
                        alt={displayName || "Product"}
                        width={450}
                        height={450}
                      />
                      {discountPercent && (
                        <span className="onsale theme">
                          -{discountPercent}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="single-product-contents">
                  <div className="summary-top-box">
                    <div className="product-tags">
                      {displayTags &&
                        displayTags.map((data, index) => (
                          <Link key={index} to="#">
                            {data}
                            {index < displayTags.length - 1 && ","}
                          </Link>
                        ))}
                    </div>
                    <div className="review-count">
                      <RatingsStar ratings={ratings} />
                      <span>
                        ({reviews} Review{reviews !== 1 ? "s" : ""})
                      </span>
                    </div>
                  </div>
                  <h2 className="product-title">{displayName}</h2>
                  <div className="price">
                    {oldPrice && (
                      <span className="me-2">
                        <del>${formatPrice(oldPrice)}</del>
                      </span>
                    )}
                    <span>${formatPrice(price)}</span>
                  </div>
                  <div
                    className={`product-stock ${stockStatus === "In Stock" ? "validthemes-in-stock" : "validthemes-out-stock"}`}
                  >
                    <span>{stockStatus}</span>
                  </div>
                  {description && <p>{description}</p>}
                  {!description && (
                    <p>
                      Delicious food prepared with fresh ingredients and
                      authentic flavors. Perfect for any occasion!
                    </p>
                  )}
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
                    <strong> {deliveryDays}-day Delivery</strong>
                    <span>Speedy and reliable parcel delivery!</span>
                  </div>
                  <div className="product-meta">
                    {sku && (
                      <span className="sku">
                        <strong>SKU:</strong> {sku}
                      </span>
                    )}
                    {displayTags && displayTags.length > 0 && (
                      <span className="posted-in">
                        <strong>Category:</strong>
                        {displayTags.map((tag, index) => (
                          <span key={index}>
                            <Link to="#">{tag}</Link>
                            {index < displayTags.length - 1 && ", "}
                          </span>
                        ))}
                      </span>
                    )}
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

export default ShopSingleThumbContent;
