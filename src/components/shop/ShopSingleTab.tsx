import { Link } from "react-router-dom";
import ReviewForm from "../form/ReviewForm";
import RatingsStar from "../utilities/RatingsStar";

interface ProductInfo {
  id?: number | string;
  name?: string;
  title?: string;
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

const ShopSingleTab = ({ productInfo }: { productInfo?: ProductInfo }) => {
  const displayName = productInfo?.name || productInfo?.title || "this product";

  // Default fallback content
  const defaultDescription = {
    text: `Delicious ${displayName} prepared with premium quality ingredients. We source our ingredients from trusted suppliers to ensure the highest quality and freshness. Perfect for any meal or occasion!`,
    features: [
      "Made with fresh, high-quality ingredients",
      "Prepared following strict hygiene standards",
      "Rich in flavor and nutrition",
      "Suitable for various dietary preferences",
      "Best enjoyed fresh",
    ],
  };

  const hasAdditionalInfo =
    productInfo?.weight ||
    productInfo?.dimensions ||
    productInfo?.nutritionalInfo ||
    productInfo?.ingredients;
  return (
    <>
      <div className="single-product-bottom-info">
        <div className="row">
          <div className="col-lg-12">
            {/* Tab Nav */}
            <div className="nav nav-tabs" id="nav-tab" role="tablist">
              <button
                className="nav-link active"
                id="description-tab-control"
                data-bs-toggle="tab"
                data-bs-target="#description-tab"
                type="button"
                role="tab"
                aria-controls="description-tab"
                aria-selected="true"
              >
                Description
              </button>
              <button
                className="nav-link"
                id="information-tab-control"
                data-bs-toggle="tab"
                data-bs-target="#information-tab"
                type="button"
                role="tab"
                aria-controls="information-tab"
                aria-selected="false"
              >
                Additional Information
              </button>
              <button
                className="nav-link"
                id="review-tab-control"
                data-bs-toggle="tab"
                data-bs-target="#review-tab"
                type="button"
                role="tab"
                aria-controls="review-tab"
                aria-selected="false"
              >
                Review
              </button>
            </div>

            {/* Start Tab Content */}
            <div className="tab-content tab-content-info" id="myTabContent">
              <div
                className="tab-pane fade show active"
                id="description-tab"
                role="tabpanel"
                aria-labelledby="description-tab-control"
              >
                <p>
                  {productInfo?.detailedDescription || defaultDescription.text}
                </p>
                <ul>
                  {productInfo?.ingredients &&
                  productInfo.ingredients.length > 0
                    ? productInfo.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))
                    : defaultDescription.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                </ul>
              </div>

              {/* Tab Single - Additional Information */}
              <div
                className="tab-pane fade"
                id="information-tab"
                role="tabpanel"
                aria-labelledby="information-tab-control"
              >
                <div className="table-responsive">
                  {hasAdditionalInfo ? (
                    <table className="table table-bordered">
                      <tbody>
                        {productInfo?.weight && (
                          <tr>
                            <td>Weight</td>
                            <td>{productInfo.weight}</td>
                          </tr>
                        )}
                        {productInfo?.dimensions && (
                          <tr>
                            <td>Dimensions</td>
                            <td>{productInfo.dimensions}</td>
                          </tr>
                        )}
                        {productInfo?.nutritionalInfo &&
                          Object.entries(productInfo.nutritionalInfo).map(
                            ([key, value]) => (
                              <tr key={key}>
                                <td>{key}</td>
                                <td>{value}</td>
                              </tr>
                            ),
                          )}
                        {productInfo?.ingredients &&
                          productInfo.ingredients.length > 0 && (
                            <tr>
                              <td>Ingredients</td>
                              <td>{productInfo.ingredients.join(", ")}</td>
                            </tr>
                          )}
                      </tbody>
                    </table>
                  ) : (
                    <table className="table table-bordered">
                      <tbody>
                        <tr>
                          <td>Serving Size</td>
                          <td>1 Portion</td>
                        </tr>
                        <tr>
                          <td>Preparation</td>
                          <td>Freshly Prepared</td>
                        </tr>
                        <tr>
                          <td>Storage</td>
                          <td>Keep Refrigerated</td>
                        </tr>
                        <tr>
                          <td>Best Consumed</td>
                          <td>Within 24 hours</td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Tab Single - Review */}
              <div
                className="tab-pane fade"
                id="review-tab"
                role="tabpanel"
                aria-labelledby="review-tab-control"
              >
                <h4>
                  {productInfo?.productReviews?.length || 0} review
                  {productInfo?.productReviews?.length !== 1 ? "s" : ""} for "
                  {displayName}"
                </h4>
                <div className="review-items">
                  {productInfo?.productReviews &&
                  productInfo.productReviews.length > 0 ? (
                    productInfo.productReviews.map((review) => (
                      <div className="item" key={review.id}>
                        <div className="thumb">
                          <img
                            src={review.avatar || "/assets/img/team/1.jpg"}
                            alt={review.author}
                          />
                        </div>
                        <div className="info">
                          <div className="rating">
                            <RatingsStar ratings={review.rating} />
                          </div>
                          <div className="review-date">{review.date}</div>
                          <div className="review-authro">
                            <h5>{review.author}</h5>
                          </div>
                          <p>{review.comment}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="item">
                        <div className="thumb">
                          <img src="/assets/img/team/1.jpg" alt="Customer" />
                        </div>
                        <div className="info">
                          <div className="rating">
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star-half-alt" />
                          </div>
                          <div className="review-date">Recently</div>
                          <div className="review-authro">
                            <h5>Happy Customer</h5>
                          </div>
                          <p>Great quality and taste! Highly recommended.</p>
                        </div>
                      </div>
                      <div className="item">
                        <div className="thumb">
                          <img src="/assets/img/team/2.jpg" alt="Customer" />
                        </div>
                        <div className="info">
                          <div className="rating">
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                            <i className="fas fa-star" />
                          </div>
                          <div className="review-date">Recently</div>
                          <div className="review-authro">
                            <h5>Satisfied Customer</h5>
                          </div>
                          <p>Excellent product! Will order again.</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="review-form">
                  <h4>Add a review</h4>
                  <div className="rating-select">
                    <div className="stars">
                      <span>
                        <Link className="star-1" to="#">
                          <i className="fas fa-star" />
                        </Link>
                        <Link className="star-2" to="#">
                          <i className="fas fa-star" />
                        </Link>
                        <Link className="star-3" to="#">
                          <i className="fas fa-star" />
                        </Link>
                        <Link className="star-4" to="#">
                          <i className="fas fa-star" />
                        </Link>
                        <Link className="star-5" to="#">
                          <i className="fas fa-star" />
                        </Link>
                      </span>
                    </div>
                  </div>
                  <ReviewForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopSingleTab;
