import { useState } from "react";
import BookList from "./components/BookList";
import AdminLogin from "./components/AdminLogin";
import "./index.css"; // Ensure CSS is imported

function App() {
  const [role, setRole] = useState("user"); 
  // "user" | "adminLogin" | "admin"

  return (
    <div className="container">
      <header style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h1>Library Management System</h1>
        {role === "user" && (
          <div className="flex-between">
            <span className="badge badge-user">Viewing as User</span>
            <button
              onClick={() => setRole("adminLogin")}
              className="btn-outline"
            >
              🔐 Login as Admin
            </button>
          </div>
        )}
        {role === "admin" && (
          <div className="flex-between">
            <span className="badge badge-admin">Logged in as Admin</span>
            <button
              onClick={() => setRole("user")}
              className="btn-outline"
            >
              🚪 Logout Admin
            </button>
          </div>
        )}
      </header>

      <main>
        {/* USER VIEW */}
        {role === "user" && (
          <section>
            <BookList isAdmin={false} />
          </section>
        )}

        {/* ADMIN LOGIN SCREEN */}
        {role === "adminLogin" && (
          <section style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
            <AdminLogin onLogin={() => setRole("admin")} onCancel={() => setRole("user")} />
          </section>
        )}

        {/* ADMIN VIEW */}
        {role === "admin" && (
          <section>
            <BookList isAdmin={true} />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
