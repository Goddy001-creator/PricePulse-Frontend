function formatPrice(value) {
  if (value === null || value === undefined) {
    return "—";
  }

  return `₦${Number(value).toLocaleString()}`;
}

function ProductRow({ product }) {
  return (
    <div className="product-row">
      <div className="product-name-cell">
        <div className="product-thumbnail">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt=""
            />
          ) : (
            <span>PP</span>
          )}
        </div>

        <div>
          <strong>{product.product_name}</strong>
          <small>{product.store_name}</small>
        </div>
      </div>

      <span>{formatPrice(product.current_price)}</span>

      <span className="old-price">
        {formatPrice(product.old_price)}
      </span>

      <span className="discount">
        {product.discount_percent !== null
          ? `${product.discount_percent}%`
          : "—"}
      </span>

      <span className="rating">
        ★ {product.rating ?? "—"}
      </span>
    </div>
  );
}

export default ProductRow;