import SingleIsotopeContent from "./SingleIsotopeContent";
import { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchMenuData } from "../../store/slices/menuSlice";
import ReactPaginate from "react-paginate";

interface MenuIsotopeProps {
  hasTitle?: boolean;
  sectionClass?: string;
}

const MenuIsotope: React.FC<MenuIsotopeProps> = ({
  hasTitle,
  sectionClass,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: menuItems,
    categories,
    loading,
  } = useSelector((state: RootState) => state.menu);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const isoRef = useRef<any>(null);
  const [activeFilter, setActiveFilter] = useState<string>("*");
  const [isClient, setIsClient] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch menu data from Redux on component mount
  useEffect(() => {
    if (menuItems.length === 0) {
      dispatch(fetchMenuData());
    }
  }, [dispatch, menuItems.length]);

  // Filter items based on active filter
  const filteredItems = useMemo(() => {
    if (activeFilter === "*") {
      return menuItems;
    }

    // Remove the dot from filter class to match collection name
    const filterCategory = activeFilter.replace(".", "").toUpperCase();
    return menuItems.filter((item) => {
      const collection = (item as any).collection?.toUpperCase() || "OTHER";
      return collection === filterCategory;
    });
  }, [menuItems, activeFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  useEffect(() => {
    const initializeIsotope = async () => {
      const Isotope = (await import("isotope-layout")).default;
      const imagesLoaded = (await import("imagesloaded")).default;

      isoRef.current = new Isotope(gridRef.current!, {
        itemSelector: ".grid-item",
        layoutMode: "masonry",
      });

      const imgLoad = imagesLoaded(gridRef.current!);

      // Store the listener function
      const listener = () => {
        isoRef.current.arrange();
      };

      imgLoad.on("always", listener);

      return () => {
        if (isoRef.current) {
          isoRef.current.destroy();
        }
        imgLoad.off("always", listener);
      };
    };

    if (isClient && paginatedItems.length > 0) {
      initializeIsotope();
    }
  }, [isClient, paginatedItems]);

  const handleFilter = (filterValue: string) => {
    console.log("🔍 Filter clicked:", filterValue);
    setActiveFilter(filterValue);
    setCurrentPage(1); // Reset to page 1 when filter changes
    if (isoRef.current) {
      isoRef.current.arrange({ filter: filterValue });

      // Count visible items after filtering
      setTimeout(() => {
        const visibleItems = isoRef.current?.filteredItems?.length || 0;
        console.log("✅ Visible items after filter:", visibleItems);
        setVisibleCount(visibleItems);
      }, 100);
    }
  };

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
    // Scroll to top of menu section
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Update visible count when menu items change
  useEffect(() => {
    if (isoRef.current && paginatedItems.length > 0) {
      const visibleItems =
        isoRef.current?.filteredItems?.length || paginatedItems.length;
      setVisibleCount(visibleItems);
    }
  }, [paginatedItems]);

  return (
    <>
      <div
        className={`food-menu-area inc-isotop default-padding ${sectionClass}`}
      >
        {hasTitle && (
          <div className="container">
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <div className="site-heading text-center">
                  <h4 className="sub-title">Food Menu</h4>
                  <h2 className="title">Discover Our Menu</h2>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="container">
          <div className="food-menu-area">
            <div className="row">
              <div className="col-md-12 food-menu-content text-center">
                <div className="mix-item-menu">
                  <button
                    className={activeFilter === "*" ? "active" : ""}
                    onClick={() => handleFilter("*")}
                  >
                    All
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={
                        activeFilter === category.filterClass ? "active" : ""
                      }
                      onClick={() => handleFilter(category.filterClass)}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>

                <div className="masonary">
                  <div
                    id="portfolio-grid"
                    className="food-menu-lists colums-3"
                    ref={gridRef}
                  >
                    {paginatedItems.map((food) => {
                      // Use collection field (DISH, SALAD, DESSERT, DRINK, OTHER) for filtering
                      const collection =
                        (food as any).collection?.toUpperCase() || "OTHER";
                      const collectionClass = collection.toLowerCase();

                      return (
                        <div
                          className={`food-menu-style-one pf-item grid-item ${collectionClass}`}
                          data-category={`.${collectionClass}`}
                          key={food.id}
                        >
                          <SingleIsotopeContent food={food} />
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="row">
                      <div className="col-md-12 pagi-area text-center">
                        <nav aria-label="navigation">
                          <ReactPaginate
                            breakLabel="..."
                            nextLabel={<i className="fas fa-angle-right"></i>}
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={totalPages}
                            previousLabel={
                              <i className="fas fa-angle-left"></i>
                            }
                            renderOnZeroPageCount={null}
                            containerClassName="pagination"
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            previousClassName="page-item"
                            previousLinkClassName="page-link"
                            nextClassName="page-item"
                            nextLinkClassName="page-link"
                            breakClassName="page-item"
                            breakLinkClassName="page-link"
                            activeClassName="active"
                            forcePage={currentPage - 1}
                          />
                        </nav>
                      </div>
                    </div>
                  )}

                  {/* No items message */}
                  {!loading && menuItems.length === 0 && (
                    <div className="no-items-message text-center mt-5">
                      <i
                        className="fas fa-utensils"
                        style={{
                          fontSize: "48px",
                          color: "#ccc",
                          marginBottom: "20px",
                        }}
                      ></i>
                      <h4>No menu items available</h4>
                      <p>Please check back later for new items.</p>
                    </div>
                  )}

                  {!loading &&
                    menuItems.length > 0 &&
                    filteredItems.length === 0 &&
                    activeFilter !== "*" && (
                      <div className="no-items-message text-center mt-5">
                        <i
                          className="fas fa-search"
                          style={{
                            fontSize: "48px",
                            color: "#ccc",
                            marginBottom: "20px",
                          }}
                        ></i>
                        <h4>No items in this category</h4>
                        <p>
                          Try selecting a different category or view all items.
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuIsotope;
