// import { NavLink } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// const navItems = [
//   { label: "Dashboard", path: "/dashboard" },
//   { label: "Transactions", path: "/transactions" },
//   { label: "Budgets", path: "/budgets" },
//   { label: "Analytics", path: "/analytics" },
//   { label: "Settings", path: "/settings" },
// ];

// export default function Sidebar() {
//   const { logout, user } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <aside style={{
//       width: 220, minHeight: "100vh", background: "var(--sidebar)",
//       borderRight: "1px solid var(--border)", display: "flex",
//       flexDirection: "column", flexShrink: 0,
//     }}>
//       <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid var(--border)" }}>
//         <div style={{ fontSize: 18, fontWeight: 600, color: "var(--text)" }}>FinanceFlow</div>
//         <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>Personal Finance Platform</div>
//       </div>

//       <nav style={{ flex: 1, padding: "12px 10px" }}>
//         {navItems.map((item) => (
//           <NavLink
//             key={item.path}
//             to={item.path}
//             style={({ isActive }) => ({
//               display: "block", padding: "9px 12px", borderRadius: 8, marginBottom: 2,
//               fontSize: 14, fontWeight: 500, textDecoration: "none",
//               background: isActive ? "#2563eb" : "transparent",
//               color: isActive ? "#ffffff" : "var(--muted)",
//               transition: "all 0.15s",
//             })}
//           >
//             {item.label}
//           </NavLink>
//         ))}
//       </nav>

//       <div style={{ padding: "12px 10px", borderTop: "1px solid var(--border)" }}>
//         {user && (
//           <div style={{ padding: "8px 12px", marginBottom: 4 }}>
//             <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{user.name}</div>
//             <div style={{ fontSize: 12, color: "var(--muted)" }}>{user.email}</div>
//           </div>
//         )}
//         <button
//           onClick={handleLogout}
//           style={{ width: "100%", padding: "9px 12px", background: "transparent", border: "1px solid var(--border)", borderRadius: 8, color: "var(--muted)", fontSize: 13, cursor: "pointer", textAlign: "left" }}
//         >
//           Sign out
//         </button>
//       </div>
//     </aside>
//   );
// }

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: "⊞" },
  { label: "Transactions", path: "/transactions", icon: "↕" },
  { label: "Budgets", path: "/budgets", icon: "◎" },
  { label: "Analytics", path: "/analytics", icon: "▦" },
  { label: "Settings", path: "/settings", icon: "⚙" },
];

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/*  Desktop sidebar  */}
      <aside style={{
        width: 220,
        minHeight: "100vh",
        background: "var(--sidebar)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
        className="desktop-sidebar"
      >
        <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>FinanceFlow</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>Personal Finance Platform</div>
        </div>

        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 8,
                marginBottom: 2,
                fontSize: 14,
                fontWeight: 500,
                textDecoration: "none",
                background: isActive ? "#2563eb" : "transparent",
                color: isActive ? "#ffffff" : "var(--muted)",
                transition: "all 0.15s",
              })}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: "12px 10px", borderTop: "1px solid var(--border)" }}>
          {user && (
            <div style={{ padding: "8px 12px", marginBottom: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{user.name}</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>{user.email}</div>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              width: "100%", padding: "8px 12px",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: 8, color: "var(--muted)",
              fontSize: 13, cursor: "pointer", textAlign: "left",
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/*  Mobile bottom tab bar  */}
      <nav className="mobile-tabs">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              padding: "8px 4px",
              textDecoration: "none",
              color: isActive ? "#2563eb" : "var(--muted)",
              fontSize: 10,
              fontWeight: isActive ? 600 : 400,
              borderTop: isActive ? "2px solid #2563eb" : "2px solid transparent",
              transition: "all 0.15s",
            })}
          >
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}