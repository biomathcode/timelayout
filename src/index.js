import React from "react";
import ReactDOM from "react-dom";
import App from "./App"; // Import your main App component
import LanguageProvider from "./context/uselang";
import { Provider } from "jotai";

// Render the main App component into the root HTML element

ReactDOM.createRoot(document.getElementById("root")).render(
  //   <React>
  <LanguageProvider>
    <Provider>
      <App />
    </Provider>
  </LanguageProvider>
  //   </React>
);
