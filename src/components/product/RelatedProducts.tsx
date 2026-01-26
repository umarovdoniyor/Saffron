import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Autoplay } from "swiper/modules";
import SingleShopV1 from "../shop/SingleShopV1";
import { useEffect, useState } from "react";
import { productApi } from "../../services/product.api";
import type { FrontendProduct } from "../../types/api.types";

interface RelatedProductsProps {
  currentProduct?: FrontendProduct; // Pass full product to get collection
}

const RelatedProducts = ({ currentProduct }: RelatedProductsProps) => {
  const [relatedProducts, setRelatedProducts] = useState<FrontendProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);

        // Fetch all products from backend
        const allProducts = await productApi.getProducts({
          page: 1,
          limit: 100,
        });

        // Exclude current product
        const otherProducts = allProducts.filter(
          (p) => String(p.id) !== String(currentProduct?.id),
        );

        let related: FrontendProduct[] = [];

        // Strategy 1: Find products with matching productCollection
        if (currentProduct?.collection) {
          related = otherProducts.filter(
            (p) => p.collection === currentProduct.collection,
          );

          console.log(
            `🔍 Related products query: collection=${currentProduct.collection}, found ${related.length} matches`,
          );
        }

        // Strategy 2: If no collection matches (less than 8 products), add recently added items
        if (related.length < 8) {
          const recentProducts = otherProducts
            .filter((p) => !related.some((r) => r.id === p.id)) // Exclude already selected
            .sort((a, b) => {
              const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return dateB - dateA;
            });

          const needed = Math.min(8 - related.length, recentProducts.length);
          related = [...related, ...recentProducts.slice(0, needed)];

          if (needed > 0) {
            console.log(
              `⚠️ Only found ${related.length - needed} matching products, added ${needed} recent products`,
            );
          }
        }

        // Take only 8 products
        const finalProducts = related.slice(0, 8);
        console.log(`✅ Showing ${finalProducts.length} related products`);

        setRelatedProducts(finalProducts);
      } catch (error) {
        console.error("❌ Error fetching related products:", error);
        setRelatedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentProduct) {
      fetchRelatedProducts();
    }
  }, [currentProduct]);
  return (
    <>
      <div className="related-products carousel-shadow">
        <div className="row">
          <div className="col-md-12">
            <h3>Related Products</h3>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3">Loading related products...</p>
              </div>
            ) : relatedProducts.length > 0 ? (
              <Swiper
                loop={true}
                slidesPerView={1}
                spaceBetween={30}
                autoplay={true}
                breakpoints={{
                  768: {
                    slidesPerView: 2,
                  },
                  992: {
                    slidesPerView: 3,
                  },
                  1400: {
                    slidesPerView: 4,
                  },
                }}
                className="vt-products text-center related-product-carousel"
                modules={[Keyboard, Autoplay]}
              >
                <div className="swiper-wrapper">
                  {relatedProducts.map((product) => (
                    <SwiperSlide key={product.id}>
                      <SingleShopV1 product={product} />
                    </SwiperSlide>
                  ))}
                </div>
              </Swiper>
            ) : (
              <div className="text-center py-5">
                <p>No related products found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RelatedProducts;
