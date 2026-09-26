import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";

import {
  getRatings,
  getTopDiscounts,
} from "../services/api";

function Analytics() {
  const [ratings, setRatings] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const [ratingData, discountData] =
          await Promise.all([
            getRatings(),
            getTopDiscounts(5),
          ]);

        setRatings(ratingData.ratings || []);
        setDiscounts(
          discountData.products || []
        );
      } catch (error) {
        console.error(
          "Analytics loading failed:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  const distribution = [1, 2, 3, 4, 5].map(
    (rating) => ({
      rating: String(rating),
      count: ratings.filter(
        (item) =>
          Math.round(Number(item.rating)) ===
          rating
      ).length,
    })
  );

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h1>Analytics</h1>
          <p>
            Understand product ratings and discounts.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          Loading analytics...
        </div>
      ) : (
        <div className="analytics-grid">
          <div className="content-card chart-card">
            <div className="card-heading">
              <div>
                <h2>Rating Distribution</h2>
                <p>
                  Number of products by rating
                </p>
              </div>
            </div>

            <div className="chart-container">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart data={distribution}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E2E8F0"
                  />

                  <XAxis dataKey="rating" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Bar
                    dataKey="count"
                    fill="#5C3AED"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="content-card">
            <div className="card-heading">
              <div>
                <h2>Top 5 Discounted Products</h2>
                <p>
                  Products with the highest discounts
                </p>
              </div>
            </div>

            <div className="discount-list">
              {discounts.map((product) => (
                <div
                  className="discount-item"
                  key={product.id}
                >
                  <div className="discount-product">
                    <div className="mini-thumbnail">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt=""
                        />
                      ) : (
                        "PP"
                      )}
                    </div>

                    <span>
                      {product.product_name}
                    </span>
                  </div>

                  <strong>
                    {product.discount_percent ?? 0}%
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;