import {
    createBrowserRouter,
  } from "react-router-dom";
import Mailer from "../page/form";

  const router = createBrowserRouter([
    {
      path: "/",
      element:<Mailer></Mailer>,
    },
  ]);

  export default router 