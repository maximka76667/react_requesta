import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const theme = {
  input: {
    styles: {
      base: {
        container: {
          position: "relative",
          minWidth: "min-w-[100px]",
        },
      },
    },
  },
  select: {
    styles: {
      base: {
        container: {
          position: "relative",
          width: "w-[150px]",
          minWidth: "min-w-[150px]",
        },
      },
    },
  },
};

import { ThemeProvider } from "@material-tailwind/react";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider value={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
