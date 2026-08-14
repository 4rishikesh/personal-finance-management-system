// import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";

// export default function Layout({ children }) {
//   return (
//     <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
//       <Sidebar />
//       <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
//         <Navbar />
//         <main style={{ flex: 1, overflow: "auto", padding: 28 }}>
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar />
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        // On mobile, add bottom padding so content isn't hidden behind tab bar
        paddingBottom: "var(--mobile-tab-height, 0px)",
      }}>
        <Navbar />
        <main style={{ flex: 1, overflow: "auto", padding: "20px" }}
          className="main-content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}