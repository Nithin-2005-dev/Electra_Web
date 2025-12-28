export default function ProductInfo({
  product,
  buying,
  onBuy,
  onOpenSizeChart,
}) {
  return (
    <section className="info">
      <h1>{product.name}</h1>
      <div className="price">₹{product.price}</div>

      <button className="size-chart" onClick={onOpenSizeChart}>
        Size Chart
      </button>

      <button
        className="buy"
        disabled={!product.available || buying}
        onClick={onBuy}
      >
        {buying ? "Processing…" : "Buy It Now"}
      </button>

      {!product.available && <span className="out">Out of stock</span>}

      <div className="details">
        <h3>Product Details</h3>
        <ul>
          <li>
            <strong>Fabric:</strong>{" "}
            {product.material || "French Terry Loopknit Cotton"}
          </li>
          <li>
            <strong>Fit:</strong> {product.fit || "Oversized"}
          </li>
          <li>
            <strong>GSM:</strong> {product.gsm || 240}
          </li>
          <li>
            <strong>Care:</strong> Cold wash, inside-out
          </li>
        </ul>
      </div>
    </section>
  );
}
