"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var client_1 = require("react-dom/client");
var react_2 = require("convex/react");
var App_tsx_1 = require("./App.tsx");
require("./index.css");
var convex = new react_2.ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
client_1.default.createRoot(document.getElementById('root')).render(<react_1.default.StrictMode>
    <react_2.ConvexProvider client={convex}>
      <App_tsx_1.default />
    </react_2.ConvexProvider>
  </react_1.default.StrictMode>);
