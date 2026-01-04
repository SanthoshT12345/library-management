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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "15px",
        marginBottom: "20px"
      }}
    >
      <Card title="Total Books" value={totalBooks} />
      <Card title="Total Copies" value={totalCopies} />
      <Card title="Out of Stock" value={outOfStock} />
      <Card title="Categories" value={totalCategories} />
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        padding: "15px",
        borderRadius: "8px",
         background:"linear-gradient(brown,#CD5646FF)",
        textAlign: "center",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
      }}
    >
      <h3>{title}</h3>
      <p style={{ fontSize: "22px", fontWeight: "bold" }}>
        {value}
      </p>
    </div>
  );
}
