import dessertItem from "/assets/img/menu/dessertItem.jpg";
import popularItem1 from "/assets/img/menu/popularItem1.jpg";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { productApi } from "../../services";
import type { FrontendProduct } from "../../types/api.types";

interface Datatype {
  sectionClass?: string;
  isDark?: boolean;
}

interface MenuItem {
  id: string;
  thumbnail: string;
  title: string;
  priceHalf: number;
  priceFull: number;
  description: string;
  extraInfo: string;
}

interface MenuSection {
  id: string;
  image: string;
  heading: string;
  items: MenuItem[];
}

const MenuV2 = ({ sectionClass, isDark }: Datatype) => {
  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);

        // Fetch all products from backend
        const allProducts = await productApi.getProducts({
          page: 1,
          limit: 100,
        });

        // Check if we got valid products array
        if (!allProducts || !Array.isArray(allProducts)) {
          console.error("❌ Invalid products response:", allProducts);
          setMenuSections([]);
          return;
        }

        if (allProducts.length === 0) {
          console.warn("⚠️ No products returned from API");
          setMenuSections([]);
          return;
        }

        // Helper function to transform product to menu item
        const transformToMenuItem = (
          product: FrontendProduct,
        ): MenuItem | null => {
          try {
            // product.thumb is already a full URL from transformProduct
            // Only use fallback image if thumb is empty
            const imageUrl = product.thumb || product.image || dessertItem;

            const fullPrice = product.price || 0;
            const halfPrice = Math.round(fullPrice * 0.6);

            return {
              id: String(product.id),
              thumbnail: imageUrl,
              title: product.title || product.name || "Untitled Item",
              priceHalf: halfPrice,
              priceFull: fullPrice,
              description:
                product.description ||
                product.text ||
                "Delicious item from our menu",
              extraInfo:
                (product.stockCount ?? 0) > 0 ? "Available" : "Out of stock",
            };
          } catch (error) {
            console.error("❌ Error transforming product:", product, error);
            return null;
          }
        };

        // Filter desserts - check for dessert-related categories
        const desserts = allProducts
          .filter((p) =>
            p.category.some((cat) =>
              ["dessert", "brunch", "pancakes", "sweet"].includes(
                cat.toLowerCase(),
              ),
            ),
          )
          .slice(0, 4)
          .map(transformToMenuItem)
          .filter((item): item is MenuItem => item !== null);

        // Get latest 4 products (sorted by createdAt desc)
        // If createdAt doesn't exist or sorting fails, just take first 4
        const popularItems = [...allProducts]
          .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, 4)
          .map(transformToMenuItem)
          .filter((item): item is MenuItem => item !== null);

        // If no desserts found, show main dishes instead
        let dessertSection: MenuSection;
        if (desserts.length === 0) {
          const mainDishes = allProducts
            .filter((p) =>
              p.category.some((cat) =>
                ["meat", "main", "dish"].includes(cat.toLowerCase()),
              ),
            )
            .slice(0, 4)
            .map(transformToMenuItem)
            .filter((item): item is MenuItem => item !== null);

          const fallbackItems = allProducts
            .slice(0, 4)
            .map(transformToMenuItem)
            .filter((item): item is MenuItem => item !== null);

          dessertSection = {
            id: "main",
            image: dessertItem,
            heading: mainDishes.length > 0 ? "Main Dishes" : "Our Specials",
            items: mainDishes.length > 0 ? mainDishes : fallbackItems,
          };
        } else {
          dessertSection = {
            id: "dessert",
            image: dessertItem,
            heading: "Popular Dessert Menu",
            items: desserts,
          };
        }

        // Create two static sections
        const popularFallback = allProducts
          .slice(0, 4)
          .map(transformToMenuItem)
          .filter((item): item is MenuItem => item !== null);

        const sections: MenuSection[] = [
          {
            id: "popular",
            image: popularItem1,
            heading: "Popular Menu",
            items: popularItems.length > 0 ? popularItems : popularFallback,
          },
          dessertSection,
        ];

        setMenuSections(sections);
      } catch (error) {
        console.error("❌ Error fetching menu data:", error);
        console.error("Error details:", error);
        setMenuSections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  return (
    <>
      <div
        className={`food-menu-style-two-area default-padding bg-cover ${sectionClass}`}
        style={{
          backgroundImage: isDark ? "none" : "url(/assets/img/shape/3.jpg)",
        }}
      >
        <div className="container">
          {loading ? (
            <div className="text-center" style={{ padding: "60px 0" }}>
              <p>Loading menu...</p>
            </div>
          ) : menuSections.length === 0 ? (
            <div className="text-center" style={{ padding: "60px 0" }}>
              <h3>No menu items available</h3>
              <p>Please add products from the admin panel.</p>
              <p
                style={{ fontSize: "0.9em", color: "#666", marginTop: "10px" }}
              >
                Check browser console for error details.
              </p>
            </div>
          ) : menuSections.some((section) => section.items.length === 0) ? (
            <div className="text-center" style={{ padding: "60px 0" }}>
              <h3>Products found but couldn't be displayed</h3>
              <p>Check browser console for transformation issues.</p>
            </div>
          ) : (
            menuSections.map((section, index) => (
              <div key={section.id} className="food-menu-style-two">
                <div className="row align-center">
                  <div className="col-lg-5">
                    <div className="food-menu-style-two-thumb">
                      <img
                        src={section.image}
                        alt="Image Not Found"
                        data-aos={index === 0 ? "fade-left" : "fade-right"}
                      />
                    </div>
                  </div>
                  <div className="col-lg-7">
                    <div
                      className="food-menu-style-two-content"
                      data-aos="fade-up"
                    >
                      <h4 className="sub-heading">{section.heading}</h4>
                      <ul className="meal-type">
                        <li>Half</li>
                        <li>Full</li>
                      </ul>
                      <ul className="meal-items">
                        {section.items.map((item) => (
                          <li key={item.id}>
                            <div className="thumbnail">
                              <img src={item.thumbnail} alt="Image Not Found" />
                            </div>
                            <div className="content">
                              <div className="top">
                                <div className="title">
                                  <h4>
                                    <Link to={`/shop-single/${item.id}`}>
                                      {item.title}
                                    </Link>
                                  </h4>
                                </div>
                                <div className="price">
                                  <span>${item.priceHalf.toFixed(2)}</span>
                                  <span>${item.priceFull.toFixed(2)}</span>
                                </div>
                              </div>
                              <div className="bottom">
                                <div className="left">
                                  <p>{item.description}</p>
                                </div>
                                <div className="right">
                                  <p>{item.extraInfo}</p>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default MenuV2;
