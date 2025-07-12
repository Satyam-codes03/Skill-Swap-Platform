
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import "stream-chat-react/dist/css/v2/index.css";
// import "@stream-io/stream-chat-css/dist/css/index.css";
import 'stream-chat-react/dist/css/v2/index.css';

import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router";
// import { BrowserRouter } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* browserRouter it means we can use any component coming from react-router in our app(application) */}
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
      
    </BrowserRouter>
  </StrictMode>
);