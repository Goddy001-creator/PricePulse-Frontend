import {
  Filter,
  RefreshCw,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import ProductRow from "../components/ui/ProductRow";
import {
  getProducts,
  searchProducts,
} from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [store, setStore] = useState("All Stores");
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    setLoading(true);

    try {
      const data = query.trim()
        ? await searchProducts(query.trim())
        : await getProducts();

      setProducts(data.products || []);
    } catch (error) {
      console.error(
        "Products loading failed:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (store === "All Stores") {
      return products;
    }

    return products.filter(
      (product) =>
        product.store_name?.toLowerCase() ===
        store.toLowerCase()
    );
  }, [products, store]);

  function handleSearch(event) {
    event.preventDefault();
    loadProducts();
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h1>Products</h1>
          <p>
            Compare prices across your tracked stores.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={loadProducts}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="content-card">
        <div className="products-toolbar">
          <div className="select-wrapper">
            <Filter size={17} />

            <select
              value={store}
              onChange={(event) =>
                setStore(event.target.value)
              }
            >
              <option>All Stores</option>
              <option>Jumia</option>
              <option>Konga</option>
            </select>
          </div>

          <form
            className="product-search"
            onSubmit={handleSearch}
          >
            <Search size={17} />

            <input
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search products..."
            />
          </form>
        </div>

        {loading ? (
          <div className="loading-state">
            Loading products...
          </div>
        ) : (
          <div className="product-table">
            <div className="product-row table-heading">
              <span>Product</span>
              <span>Price</span>
              <span>Original Price</span>
              <span>Discount</span>
              <span>Rating</span>
            </div>

            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
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
        )}
      </div>
    </div>
  );
}

export default Products;