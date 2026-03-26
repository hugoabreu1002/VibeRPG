import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./index.css";

import { pokiService } from "./lib/poki";

const queryClient = new QueryClient();

// Initialize Poki SDK
pokiService.init().then(() => {
  pokiService.gameLoadingFinished();
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
);
