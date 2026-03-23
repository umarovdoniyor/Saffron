import { Link } from "react-router-dom";
import handleSmoothScroll from "../utilities/handleSmoothScroll";

interface DataType {
  id?: number | string;
  thumb?: string;
  image?: string; // Backend will send full URL
  title?: string;
  name?: string; // Backend might use 'name' instead of 'title'
  text?: string;
  description?: string; // Backend might use 'description' instead of 'text'
  tags?: string[] | undefined;
  category?: string[]; // Backend sends category array
  price?: number;
  filterClass?: string[];
  delay?: string;
}

const SingleIsotopeContent = ({ food }: { food: DataType }) => {
  const {
    id,
    thumb,
    image,
    title,
    name,
    text,
    description,
    price,
    tags,
    category,
    delay,
  } = food;

  // Handle both backend URLs and local paths
  const getImageSrc = () => {
    const imgSource = image || thumb;
    if (!imgSource) return "/assets/img/placeholder.jpg";

    // If it's a full URL (starts with http:// or https://), use it directly
    if (imgSource.startsWith("http://") || imgSource.startsWith("https://")) {
      return imgSource;
    }

    // Otherwise, treat it as a local path
    return `/assets/img/menu/${imgSource}`;
  };

  const displayTitle = title || name;
  const displayText = text || description;

  // Get productTags from backend or fallback to category
  const productTags = (food as any).productTags as string[] | undefined;
  const displayTags: string[] | undefined =
    productTags || tags || category?.map((cat) => cat.replace(".", ""));

  // Friendly fallback tags for food if no tags are provided
  const fallbackTags = ["Fresh", "Delicious"];

  return (
    <>
      <div className="item" data-aos="fade-up" data-aos-delay={delay}>
        <div className="thumb">
          <Link to={`/shop-single-thumb/${id}`}>
            <img
              src={getImageSrc()}
              alt={displayTitle || "Food Item"}
              width={600}
              height={600}
            />
          </Link>
        </div>
        <div className="info">
          <h4>
            <Link to={`/shop-single-thumb/${id}`}>{displayTitle}</Link>
          </h4>
          <p
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minHeight: "2.8em",
              lineHeight: "1.4em",
            }}
          >
            {displayText}
          </p>
          <div className="food-cats">
            {(displayTags && displayTags.length > 0
              ? displayTags
              : fallbackTags
            ).map((data: string, index: number, array: string[]) => (
              <span key={index}>
                {data}
                {index < array.length - 1 && " / "}
              </span>
            ))}
          </div>
          <div className="item-price">
            <div className="left">
              <span>Price</span>
              <h5>${price?.toFixed(2)}</h5>
            </div>
            <div className="right">
              <Link to="#" onClick={handleSmoothScroll}>
                <i className="fa fa-heart" />
              </Link>
            </div>
          </div>
          <div className="button">
            <Link to={`/shop-single-thumb/${id}`}>Order Now</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleIsotopeContent;
