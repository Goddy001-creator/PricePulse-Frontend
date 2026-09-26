import {
  BarChart3,
  Package,
  Percent,
  Store,
} from "lucide-react";
import { useEffect, useState } from "react";

import StatCard from "../components/ui/StatCard";
import ProductRow from "../components/ui/ProductRow";
import {
  getAnalyticsSummary,
  getProducts,
} from "../services/api";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [summaryData, productData] =
          await Promise.all([
            getAnalyticsSummary(),
            getProducts(),
          ]);

        setSummary(summaryData);
        setProducts(productData.products || []);
      } catch (error) {
        console.error(
          "Dashboard loading failed:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const recentProducts = products.slice(0, 5);

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>
            Welcome back! Here's what's happening
            with your prices today.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          Loading dashboard...
        </div>
      ) : (
        <>
          <section className="stats-grid">
            <StatCard
              title="Total Products"
              value={summary?.total_products ?? 0}
              subtitle="Tracked products"
              trend="Live"
              icon={<Package size={19} />}
              accent="blue"
            />

            <StatCard
              title="Stores Tracked"
              value="2"
              subtitle="Jumia, Konga"
              icon={<Store size={19} />}
              accent="purple"
            />

            <StatCard
              title="Average Discount"
              value={`${summary?.average_discount ?? 0}%`}
              subtitle="Across all products"
              icon={<Percent size={19} />}
              accent="green"
            />

            <StatCard
              title="Average Rating"
              value={summary?.average_rating ?? 0}
              subtitle="Across all products"
              icon={<BarChart3 size={19} />}
              accent="orange"
            />
          </section>

          <section className="dashboard-grid">
            <div className="content-card">
              <div className="card-heading">
                <div>
                  <h2>Recently Added Products</h2>
                  <p>
                    Latest products from tracked stores
                  </p>
                </div>

                <a href="/products">
                  View all products →
                </a>
              </div>

              <div className="product-table">
                <div className="product-row table-heading">
                  <span>Product</span>
                  <span>Price</span>
                  <span>Original Price</span>
                  <span>Discount</span>
                  <span>Rating</span>
                </div>

                {recentProducts.length > 0 ? (
                  recentProducts.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                    />
                  ))
                ) : (
                  <div className="empty-state">
                    No products found.
                  </div>
                )}
              </div>
            </div>

            <div className="content-card update-card">
              <div className="card-heading">
                <div>
                  <h2>Last Update</h2>
                  <p>Database status</p>
                </div>
              </div>

              <div className="update-content">
                <div className="update-icon">
                  <Package size={24} />
                </div>

                <strong>
                  Price data connected
                </strong>

                <span>
                  {summary?.total_products ?? 0} products
                  currently available.
                </span>

                <div className="status-pill">
                  ● Backend connected
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default Dashboard;