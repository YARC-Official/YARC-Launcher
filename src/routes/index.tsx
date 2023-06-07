import { createBrowserRouter} from "react-router-dom";

import RootLayout from "@app/routes/root";
import Home from "@app/routes/Home";

const Router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <Home />
            }
        ]
    },
]);

export default Router;