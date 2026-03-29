export default function BorrowerList({ borrowers }) {
  if (!borrowers || borrowers.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: "center", padding: "30px" }}>
        <p style={{ color: "var(--text-muted)" }}>No borrowers found. Please add a borrower first.</p>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        👥 <span>Library Borrowers</span>
      </h3>
      
      <div className="table-container">
        <table className="table-modern">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {borrowers.map((b) => (
              <tr key={b._id}>
                <td style={{ fontWeight: "500", color: "var(--text-main)" }}>{b.name}</td>
                <td><a href={`mailto:${b.email}`}>{b.email}</a></td>
                <td style={{ color: "var(--text-muted)" }}>{b.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
