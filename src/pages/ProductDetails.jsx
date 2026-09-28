import {
  ArrowLeft,
  ExternalLink,
  Package,
  Star,
  Store,
  TrendingDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  getPriceHistory,
  getProduct,
} from "../services/api";

function formatPrice(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  return `₦${Number(value).toLocaleString()}`;
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setError("");

      try {
        const data = await getProduct(productId);

        setProduct(data.product || data);
      } catch (requestError) {
        console.error(
          "Product details loading failed:",
          requestError
        );

        setError(
          "Unable to load this product."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  useEffect(() => {
    async function loadHistory() {
      setHistoryLoading(true);

      try {
        const data = await getPriceHistory(productId);

        setHistory(data.history || []);
      } catch (requestError) {
        console.error(
          "Price history loading failed:",
          requestError
        );

        setHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    }

    loadHistory();
  }, [productId]);

  const chartData = history
    .map((item) => ({
      date: formatDate(
        item.checked_at || item.date
      ),
      price: Number(item.price),
    }))
    .reverse();

  if (loading) {
    return (
      <div className="page">
        <div className="loading-state">
          Loading product details...
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page">
        <div className="details-error-card">
          <Package size={28} />

          <h2>Product not found</h2>

          <p>
            We couldn't load the requested product.
          </p>

          <button
            className="primary-button"
            onClick={() => navigate("/products")}
          >
            <ArrowLeft size={17} />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <button
        className="back-button"
        onClick={() => navigate("/products")}
      >
        <ArrowLeft size={17} />
        Back to Products
      </button>

      <div className="page-heading product-details-heading">
        <div>
          <h1>Product Details</h1>
          <p>
            View pricing information and price history.
          </p>
        </div>
      </div>

      <section className="product-details-card">
        <div className="product-details-image">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.product_name}
            />
          ) : (
            <div className="product-image-placeholder">
              <Package size={42} />
            </div>
          )}
        </div>

        <div className="product-details-main">
          <div className="product-store-badge">
            <Store size={14} />
            {product.store_name || "Store"}
          </div>

          <h2>{product.product_name}</h2>

          <div className="product-details-rating">
            <Star
              size={17}
              fill="currentColor"
            />
            <strong>
              {product.rating ?? "—"}
            </strong>

            {product.review_count !== null &&
              product.review_count !== undefined && (
                <span>
                  ({product.review_count} reviews)
                </span>
              )}
          </div>

          <div className="product-price-block">
            <strong>
              {formatPrice(product.current_price)}
            </strong>

            {product.old_price !== null &&
              product.old_price !== undefined && (
                <span>
                  {formatPrice(product.old_price)}
                </span>
              )}

            {product.discount_percent !== null &&
              product.discount_percent !== undefined && (
                <div className="details-discount">
                  <TrendingDown size={14} />
                  {product.discount_percent}% off
                </div>
              )}
          </div>

          <div className="product-meta-grid">
            <div>
              <span>Availability</span>
              <strong>
                {product.availability || "Unknown"}
              </strong>
            </div>

            <div>
              <span>Last Checked</span>
              <strong>
                {formatDate(product.last_checked)}
              </strong>
            </div>
          </div>

          {product.product_url && (
            <a
              className="primary-button product-external-link"
              href={product.product_url}
              target="_blank"
              rel="noreferrer"
            >
              <ExternalLink size={17} />
              View on {product.store_name || "Store"}
            </a>
          )}
        </div>
      </section>

      <section className="content-card price-history-card">
        <div className="card-heading">
          <div>
            <h2>Price History</h2>
            <p>
              Track how this product's price has changed.
            </p>
          </div>
        </div>

        {historyLoading ? (
          <div className="loading-state">
            Loading price history...
          </div>
        ) : chartData.length > 0 ? (
          <div className="price-history-chart">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 10,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E2E8F0"
                />

                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                />

                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) =>
                    `₦${Number(value).toLocaleString()}`
                  }
                />

                <Tooltip
                  formatter={(value) => [
                    formatPrice(value),
                    "Price",
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#5C3AED"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    fill: "#5C3AED",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="history-empty-state">
            <TrendingDown size={26} />

            <h3>No price history yet</h3>

            <p>
              Price history will appear after PricePulse
              records additional price checks for this product.
            </p>
          </div>
        )}
      </section>

      <section className="content-card history-table-card">
        <div className="card-heading">
          <div>
            <h2>Price Records</h2>
            <p>
              Recorded prices for this product.
            </p>
          </div>
        </div>

        {history.length > 0 ? (
          <div className="history-table">
            <div className="history-row history-heading">
              <span>Date</span>
              <span>Price</span>
            </div>

            {history.map((item, index) => (
              <div
                className="history-row"
                key={`${item.checked_at}-${index}`}
              >
                <span>
                  {formatDate(
                    item.checked_at || item.date
                  )}
                </span>

                <strong>
                  {formatPrice(item.price)}
                </strong>
              </div>
            ))}
          </div>
        ) : (
          <div className="history-table-empty">
            No recorded price changes yet.
          </div>
        )}
      </section>
    </div>
  );
}

export default ProductDetails;