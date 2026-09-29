import {
  Package,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import ProductRow from "../components/ui/ProductRow";
import { getProducts, searchProducts } from "../services/api";

const STORE_OPTIONS = ["All Stores", "Jumia", "Konga"];

function Products() {
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [storeFilter, setStoreFilter] = useState("All Stores");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProducts(searchTerm = "") {
    setLoading(true);
    setError("");

    try {
      const data = searchTerm
        ? await searchProducts(searchTerm)
        : await getProducts();

      setProducts(data.products || []);
    } catch (requestError) {
      console.error("Products loading failed:", requestError);
      setProducts([]);
      setError("Unable to load products. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleSearchSubmit(event) {
    event.preventDefault();

    const trimmedSearch = searchInput.trim();
    setActiveSearch(trimmedSearch);
    loadProducts(trimmedSearch);
  }

  function handleClearSearch() {
    setSearchInput("");
    setActiveSearch("");
    loadProducts();
  }

  function handleRefresh() {
    loadProducts(activeSearch);
  }

  const filteredProducts = useMemo(() => {
    if (storeFilter === "All Stores") {
      return products;
    }

    return products.filter(
      (product) =>
        product.store_name?.toLowerCase() === storeFilter.toLowerCase()
    );
  }, [products, storeFilter]);

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <h1>Products</h1>
          <p>
            Browse and compare products currently tracked by PricePulse.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshCw
            size={17}
            className={loading ? "button-spinner" : ""}
          />
          Refresh
        </button>
      </div>

      <div className="products-toolbar">
        <form className="products-search" onSubmit={handleSearchSubmit}>
          <Search size={18} />

          <input
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
          />

          {searchInput && (
            <button
              type="button"
              className="search-clear-button"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}

          <button type="submit" className="search-submit-button">
            Search
          </button>
        </form>

        <div className="products-filter">
          <SlidersHorizontal size={17} />

          <select
            value={storeFilter}
            onChange={(event) => setStoreFilter(event.target.value)}
            aria-label="Filter products by store"
          >
            {STORE_OPTIONS.map((store) => (
              <option key={store} value={store}>
                {store}
              </option>
            ))}
          </select>
        </div>
      </div>

      {(activeSearch || storeFilter !== "All Stores") && (
        <div className="active-filters">
          <div>
            <span>Showing:</span>

            {activeSearch && (
              <span className="filter-chip">
                Search: "{activeSearch}"
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Clear search filter"
                >
                  <X size={13} />
                </button>
              </span>
            )}

            {storeFilter !== "All Stores" && (
              <span className="filter-chip">
                Store: {storeFilter}
                <button
                  type="button"
                  onClick={() => setStoreFilter("All Stores")}
                  aria-label="Clear store filter"
                >
                  <X size={13} />
                </button>
              </span>
            )}
          </div>

          <span className="result-count">
            {filteredProducts.length} result
            {filteredProducts.length === 1 ? "" : "s"}
          </span>
        </div>
      )}

      {loading ? (
        <div className="content-card products-loading-card">
          <RefreshCw size={28} className="loading-icon" />
          <h3>Loading products...</h3>
          <p>Fetching the latest product data from PricePulse.</p>
        </div>
      ) : error ? (
        <div className="content-card products-error-card">
          <div className="products-state-icon">
            <Package size={28} />
          </div>
          <h3>Unable to load products</h3>
          <p>{error}</p>

          <button className="primary-button" onClick={handleRefresh}>
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="content-card products-empty-card">
          <div className="products-state-icon">
            <Package size={28} />
          </div>

          <h3>
            {activeSearch || storeFilter !== "All Stores"
              ? "No matching products"
              : "No products available"}
          </h3>

          <p>
            {activeSearch || storeFilter !== "All Stores"
              ? "Try changing your search or store filter."
              : "PricePulse has not loaded any products yet."}
          </p>

          {(activeSearch || storeFilter !== "All Stores") && (
            <button
              className="secondary-button"
              onClick={() => {
                setSearchInput("");
                setActiveSearch("");
                setStoreFilter("All Stores");
                loadProducts();
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="content-card products-table-card">
          <div className="products-table-heading">
            <div>
              <h2>Tracked Products</h2>
              <p>
                {filteredProducts.length} product
                {filteredProducts.length === 1 ? "" : "s"} currently shown
              </p>
            </div>

            <div className="products-source-badge">
              <Package size={15} />
              Live backend data
            </div>
          </div>

          <div className="products-table">
            <div className="product-row product-row-header">
              <span>Product</span>
              <span>Current Price</span>
              <span>Original Price</span>
              <span>Discount</span>
              <span>Rating</span>
            </div>

            <div className="product-row-list">
              {filteredProducts.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;