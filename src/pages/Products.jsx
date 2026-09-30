import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Package,
  RefreshCw,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ProductRow from "../components/ui/ProductRow";
import { getProductsPage } from "../services/api";

const STORE_OPTIONS = ["All Stores", "Jumia", "Konga"];
const PAGE_SIZE = 10;

// Builds lists like [1, 2, 3] or [1, "start", 4, 5, 6, "end", 13]
function getPageItems(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const items = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) items.push("start");

  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }

  if (end < total - 1) items.push("end");

  items.push(total);
  return items;
}

function SortHeader({ label, sortKey, sort, order, onSort }) {
  const active = sort === sortKey;

  return (
    <button
      type="button"
      className={`sort-header ${active ? "active" : ""}`}
      onClick={() => onSort(sortKey)}
      aria-label={`Sort by ${label}`}
    >
      {label}
      {active &&
        (order === "asc" ? (
          <ArrowUp size={12} />
        ) : (
          <ArrowDown size={12} />
        ))}
    </button>
  );
}

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = (searchParams.get("q") || "").trim();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [searchInput, setSearchInput] = useState(urlQuery);
  const [storeFilter, setStoreFilter] = useState("All Stores");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("updated");
  const [order, setOrder] = useState("desc");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const requestRef = useRef(0);

  const filtersActive = Boolean(urlQuery) || storeFilter !== "All Stores";

  const loadProducts = useCallback(async () => {
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;

    setLoading(true);
    setError("");

    try {
      const data = await getProductsPage({
        page,
        perPage: PAGE_SIZE,
        sort,
        order,
        q: urlQuery,
        store: storeFilter === "All Stores" ? "" : storeFilter,
      });

      // Ignore answers from outdated requests
      if (requestId !== requestRef.current) return;

      setProducts(data.products || []);
      setTotal(data.total ?? 0);
      setTotalPages(data.total_pages ?? 1);

      if (data.total_pages && page > data.total_pages) {
        setPage(data.total_pages);
      }
    } catch (requestError) {
      if (requestId !== requestRef.current) return;

      console.error("Products loading failed:", requestError);
      setProducts([]);
      setTotal(0);
      setTotalPages(1);
      setError("Unable to load products. Make sure the backend is running.");
    } finally {
      if (requestId === requestRef.current) {
        setLoading(false);
      }
    }
  }, [page, sort, order, urlQuery, storeFilter]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // The URL (?q=...) is the source of truth for the search term
  useEffect(() => {
    setSearchInput(urlQuery);
    setPage(1);
  }, [urlQuery]);

  function handleSearchSubmit(event) {
    event.preventDefault();

    const trimmedSearch = searchInput.trim();

    if (trimmedSearch === urlQuery) {
      if (page === 1) {
        loadProducts();
      } else {
        setPage(1);
      }
      return;
    }

    setSearchParams(trimmedSearch ? { q: trimmedSearch } : {});
  }

  function handleClearSearch() {
    setSearchInput("");
    setSearchParams({});
  }

  function handleStoreChange(value) {
    setStoreFilter(value);
    setPage(1);
  }

  function handleSort(key) {
    if (sort === key) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(key);
      setOrder(key === "name" ? "asc" : "desc");
    }

    setPage(1);
  }

  function goToPage(nextPage) {
    setPage(Math.min(Math.max(1, nextPage), totalPages));
  }

  const showingFrom = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(page * PAGE_SIZE, total);

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
          onClick={loadProducts}
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
            onChange={(event) => handleStoreChange(event.target.value)}
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

      {filtersActive && (
        <div className="active-filters">
          <div>
            <span>Showing:</span>

            {urlQuery && (
              <span className="filter-chip">
                Search: "{urlQuery}"
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
                  onClick={() => handleStoreChange("All Stores")}
                  aria-label="Clear store filter"
                >
                  <X size={13} />
                </button>
              </span>
            )}
          </div>

          <span className="result-count">
            {total} result
            {total === 1 ? "" : "s"}
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

          <button className="primary-button" onClick={loadProducts}>
            <RefreshCw size={17} />
            Try Again
          </button>
        </div>
      ) : total === 0 ? (
        <div className="content-card products-empty-card">
          <div className="products-state-icon">
            <Package size={28} />
          </div>

          <h3>
            {filtersActive ? "No matching products" : "No products available"}
          </h3>

          <p>
            {filtersActive
              ? "Try changing your search or store filter."
              : "PricePulse has not loaded any products yet."}
          </p>

          {filtersActive && (
            <button
              className="secondary-button"
              onClick={() => {
                setStoreFilter("All Stores");
                setPage(1);
                handleClearSearch();
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
                {total} product
                {total === 1 ? "" : "s"}{" "}
                {filtersActive ? "matching" : "currently tracked"}
              </p>
            </div>

            <div className="products-source-badge">
              <Package size={15} />
              Live backend data
            </div>
          </div>

          <div className="products-table">
            <div className="product-row product-row-header">
              <SortHeader
                label="Product"
                sortKey="name"
                sort={sort}
                order={order}
                onSort={handleSort}
              />

              <SortHeader
                label="Current Price"
                sortKey="price"
                sort={sort}
                order={order}
                onSort={handleSort}
              />

              <span>Original Price</span>

              <SortHeader
                label="Discount"
                sortKey="discount"
                sort={sort}
                order={order}
                onSort={handleSort}
              />

              <SortHeader
                label="Rating"
                sortKey="rating"
                sort={sort}
                order={order}
                onSort={handleSort}
              />
            </div>

            <div className="product-row-list">
              {products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          </div>

          <div className="pagination-bar">
            <span className="pagination-summary">
              Showing {showingFrom} to {showingTo} of {total}{" "}
              {total === 1 ? "product" : "products"}
            </span>

            {totalPages > 1 && (
              <nav className="pagination" aria-label="Products pages">
                <button
                  type="button"
                  className="pagination-button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>

                {getPageItems(page, totalPages).map((item) =>
                  typeof item === "string" ? (
                    <span key={item} className="pagination-ellipsis">
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      className={`pagination-button ${
                        item === page ? "active" : ""
                      }`}
                      onClick={() => goToPage(item)}
                      aria-label={`Page ${item}`}
                      aria-current={item === page ? "page" : undefined}
                    >
                      {item}
                    </button>
                  )
                )}

                <button
                  type="button"
                  className="pagination-button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </nav>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;