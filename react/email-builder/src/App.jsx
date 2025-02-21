import React from "react";
import EmailBuilder from "./components/EmailBuilder";

function App() {
  return (
    <div style={{ padding: "20px", width: "80%", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center" }}>
        Drag & Drop Email Template Builder
      </h2>
      <EmailBuilder />
    </div>
  );
}

export default App;
