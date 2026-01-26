import SingleShopV1 from "./SingleShopV1";
import SingleProductList from "./SingleProductList";
import Pagination from "react-paginate";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchProducts, setSortBy } from "../../store/slices/productsSlice";

const ShopPageContent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get page from query parameter
  const pageFromUrl = searchParams.get("page");
  const currentPageNumber = Number(pageFromUrl) || 1;

  // Get products state from Redux
  const { products, totalCount, totalPages, loading, sortBy } = useSelector(
    (state: RootState) => state.products,
  );

  const [itemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(currentPageNumber);

  // Fetch products when page or sortBy changes
  useEffect(() => {
    console.log(`🔄 Fetching products for page: ${currentPageNumber}`);
    dispatch(
      fetchProducts({
        page: currentPageNumber,
        limit: itemsPerPage,
        sortBy: sortBy,
      }),
    );
    setCurrentPage(currentPageNumber);
  }, [dispatch, currentPageNumber, itemsPerPage, sortBy]);

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = e.target.value;
    dispatch(setSortBy(newSortBy));
    // Reset to page 1 when sorting changes
    navigate(`/shop?page=1`);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const handlePageClick = (data: any) => {
    const selectedPage = data.selected + 1;
    console.log(`👆 User clicked page: ${selectedPage}`);
    setCurrentPage(selectedPage);

    // Update the URL dynamically
    navigate(`/shop?page=${selectedPage}`);

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 200);
  };

  console.log(
    `📊 Current state - Page: ${currentPage}, Products: ${products.length}, Total: ${totalCount}, Pages: ${totalPages}`,
  );

  return (
    <>
      <div className="validtheme-shop-area default-padding">
        <div className="container">
          <div className="shop-listing-contentes">
            <div className="row item-flex center">
              <div className="col-lg-7">
                <div className="content">
                  {/* Tab Nav */}
                  <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                      <button
                        className="nav-link active"
                        id="grid-tab-control"
                        data-bs-toggle="tab"
                        data-bs-target="#grid-tab"
                        type="button"
                        role="tab"
                        aria-controls="grid-tab"
                        aria-selected="true"
                      >
                        <i className="fas fa-th-large" />
                      </button>
                      <button
                        className="nav-link"
                        id="list-tab-control"
                        data-bs-toggle="tab"
                        data-bs-target="#list-tab"
                        type="button"
                        role="tab"
                        aria-controls="list-tab"
                        aria-selected="false"
                      >
                        <i className="fas fa-th-list" />
                      </button>
                    </div>
                  </nav>
                </div>
              </div>
              <div className="col-lg-5 text-right">
                <p>
                  Showing {startIndex + 1}–{Math.min(endIndex, totalCount)} of{" "}
                  {totalCount} results
                </p>
                <select
                  name="cars"
                  id="cars"
                  value={sortBy}
                  onChange={handleSortChange}
                >
                  <option value="latest">Latest</option>
                  <option value="popular">Popular</option>
                  <option value="priceLowToHigh">Price: Low to High</option>
                  <option value="priceHighToLow">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div
                className="tab-content tab-content-info text-center"
                id="shop-tabContent"
              >
                {/* Start Product Grid Vies */}
                <div
                  className="tab-pane fade show active"
                  id="grid-tab"
                  role="tabpanel"
                  aria-labelledby="grid-tab-control"
                >
                  {loading ? (
                    <div className="text-center" style={{ padding: "100px 0" }}>
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3">Loading products...</p>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="text-center" style={{ padding: "100px 0" }}>
                      <i
                        className="fas fa-shopping-bag"
                        style={{
                          fontSize: "48px",
                          color: "#ccc",
                          marginBottom: "20px",
                        }}
                      ></i>
                      <h4>No products available</h4>
                      <p>Please check back later for new products.</p>
                    </div>
                  ) : (
                    <ul className="vt-products columns-4">
                      {products.map((product) => (
                        <SingleShopV1 product={product} key={product.id} />
                      ))}
                    </ul>
                  )}
                </div>

                {/* Start Product List Vies */}
                <div
                  className="tab-pane fade"
                  id="list-tab"
                  role="tabpanel"
                  aria-labelledby="list-tab-control"
                >
                  {loading ? (
                    <div className="text-center" style={{ padding: "100px 0" }}>
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <p className="mt-3">Loading products...</p>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="text-center" style={{ padding: "100px 0" }}>
                      <i
                        className="fas fa-shopping-bag"
                        style={{
                          fontSize: "48px",
                          color: "#ccc",
                          marginBottom: "20px",
                        }}
                      ></i>
                      <h4>No products available</h4>
                      <p>Please check back later for new products.</p>
                    </div>
                  ) : (
                    <ul className="vt-products colums-2">
                      {products.map((product) => (
                        <SingleProductList product={product} key={product.id} />
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Pagination */}
              <nav className="woocommerce-pagination mt-60">
                <Pagination
                  forcedPage={currentPage - 1}
                  previousLabel={
                    currentPage === 1 ? (
                      <i className="fas fa-ban"></i>
                    ) : (
                      <i className="fas fa-angle-double-left"></i>
                    )
                  }
                  nextLabel={
                    currentPage === totalPages ? (
                      <i className="fas fa-ban"></i>
                    ) : (
                      <i className="fas fa-angle-double-right"></i>
                    )
                  }
                  breakLabel={"..."}
                  pageCount={totalPages}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination text-center"}
                  activeClassName={"active"}
                  pageClassName={"page-item"}
                  pageLinkClassName={"page-link"}
                  previousLinkClassName={"page-link"}
                  nextLinkClassName={"page-link"}
                />
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopPageContent;
