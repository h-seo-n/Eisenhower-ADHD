import type { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import App from "../pages/app/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
