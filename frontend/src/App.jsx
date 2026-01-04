import { useState } from "react";
import BookList from "./components/BookList";
import AdminLogin from "./components/AdminLogin";

function App() {
  const [role, setRole] = useState("user"); 
  // "user" | "adminLogin" | "admin"

  return (
    <div style={{ padding: "20px" }}>
      <center color="black"><h1 >Library Management System</h1></center>

      {/* USER VIEW */}
      {role === "user" && (
        <>
          <p style={{ color: "blue" }}>Viewing as User</p>

          {/* 🔐 LOGIN AS ADMIN BUTTON */}
          <button
            onClick={() => setRole("adminLogin")}
            style={{display:"flex",marginLeft:"auto", marginBottom: "15px"}}
          >
            Login as Admin
          </button>

          <BookList isAdmin={false} />
        </>
      )}

      {/* ADMIN LOGIN SCREEN */}
      {role === "adminLogin" && (
        <AdminLogin onLogin={() => setRole("admin")} />
      )}

      {/* ADMIN VIEW */}
      {role === "admin" && (
        <>
          <p style={{ color: "green" }}>Logged in as Admin</p>

          {/* LOGOUT */}
          <button
            onClick={() => setRole("user")}
            style={{ marginBottom: "15px" }}
          >
            Logout Admin
          </button>

          <BookList isAdmin={true} />
        </>
      )}
    </div>
  );
}

export default App;
