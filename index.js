import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./src/components/Home";
import About from "./src/components/About";
import More from "./src/components/More";
import Error from "./src/components/Error";
import LiveMatch from "./src/components/LiveMatch";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/more",
        element: <More />,
      },
    ],
  },
  {
    path: "/live/match/:index",
    element: <LiveMatch />,
  },
]);

const root = createRoot(document.getElementById("root"));

root.render(<RouterProvider router={router} />);
