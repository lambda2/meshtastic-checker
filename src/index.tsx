import "@app/index.css";
import { enableMapSet } from "immer";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "@app/App.tsx";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

enableMapSet();

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
