import LayoutV5 from "../../components/layouts/LayoutV5";
import ShopSingleContent from "../../components/shop/ShopSingleContent";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { productApi } from "../../services/product.api";

interface ProductInfo {
  id: number | string;
  [key: string]: any;
}

const ShopSinglePage = () => {
  const { id } = useParams();
  const [data, setData] = useState<ProductInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          setError("Product ID is missing");
          return;
        }

        // Fetch from backend API
        const product = await productApi.getProduct(id);

        if (product) {
          setData(product);
        } else {
          setError("Product not found");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load product details");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  return (
    <>
      <LayoutV5
        title={data?.title || data?.name || "Product Details"}
        breadCrumb="shop-single-2"
      >
        {loading && (
          <div className="container text-center" style={{ padding: "100px 0" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading product details...</p>
          </div>
        )}
        {error && (
          <div className="container text-center" style={{ padding: "100px 0" }}>
            <i
              className="fas fa-exclamation-circle"
              style={{
                fontSize: "48px",
                color: "#dc3545",
                marginBottom: "20px",
              }}
            ></i>
            <h4>{error}</h4>
            <p>The product you're looking for could not be found.</p>
          </div>
        )}
        {!loading && !error && data && <ShopSingleContent productInfo={data} />}
      </LayoutV5>
    </>
  );
};

export default ShopSinglePage;
