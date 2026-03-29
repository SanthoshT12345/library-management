export default function Dashboard({ books }) {
  // 1️⃣ Total book titles
  const totalBooks = books.length;

  // 2️⃣ Total available copies
  const totalCopies = books.reduce(
    (sum, book) => sum + book.availableCopies,
    0
  );

  // 3️⃣ Out of stock books
  const outOfStock = books.filter(
    book => book.availableCopies === 0
  ).length;

  // 4️⃣ Total categories (unique)
  const categories = new Set(books.map(book => book.category));
  const totalCategories = categories.size;

  return (
    <div className="dashboard-grid" style={{ marginBottom: "24px" }}>
      <Card title="Total Books" value={totalBooks} icon="📚" color="var(--primary-color)" />
      <Card title="Total Copies" value={totalCopies} icon="📑" color="var(--secondary-color)" />
      <Card title="Out of Stock" value={outOfStock} icon="⚠️" color="var(--danger-color)" />
      <Card title="Categories" value={totalCategories} icon="🏷️" color="#f59e0b" />
    </div>
  );
}

function Card({ title, value, icon, color }) {
  return (
    <div className="glass-card" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px" }}>
      <div style={{ fontSize: "2.5rem", background: `rgba(255,255,255,0.05)`, padding: "12px", borderRadius: "12px", border: `1px solid ${color}` }}>
        {icon}
      </div>
      <div>
        <h3 style={{ margin: "0 0 4px 0", fontSize: "1rem", color: "var(--text-muted)" }}>{title}</h3>
        <p style={{ margin: "0", fontSize: "1.8rem", fontWeight: "bold", color: "var(--text-main)" }}>
          {value}
        </p>
      </div>
    </div>
  );
}
