import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AppAirdropDashboard from "../AppAirdropDashboard"

export const router = createBrowserRouter([
    {
      path: "/",
      element: <AppAirdropDashboard />,
    }
  ]);
