// import { useLocation } from "react-router-dom";
// import ThemeToggle from "./ThemeToggle";

// const titles = {
//   "/dashboard": "Dashboard",
//   "/transactions": "Transactions",
//   "/budgets": "Budgets",
//   "/analytics": "Analytics",
//   "/settings": "Settings",
// };

// export default function Navbar() {
//   const { pathname } = useLocation();

//   return (
//     <header style={{
//       height: 56, borderBottom: "1px solid var(--border)",
//       display: "flex", alignItems: "center",
//       justifyContent: "space-between", padding: "0 24px",
//       background: "var(--surface)",
//     }}>
//       <span style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}>
//         {titles[pathname] || "FinanceFlow"}
//       </span>
//       <ThemeToggle />
//     </header>
//   );
// }

import { useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const titles = {
  "/dashboard": "Dashboard",
  "/transactions": "Transactions",
  "/budgets": "Budgets",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header style={{
      height: 54,
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      background: "var(--surface)",
      position: "sticky",
      top: 0,
      zIndex: 10,
    }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>
        {titles[pathname] || "FinanceFlow"}
      </span>
      <ThemeToggle />
    </header>
  );
}