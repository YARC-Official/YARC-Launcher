import { createBrowserRouter} from "react-router-dom";

import RootLayout from "@app/routes/root";
import Home from "@app/routes/Home";
import News from "@app/routes/News";
import Settings from "@app/routes/Settings";
import StableYARGPage from "./YARG/Stable";
import NightlyYARGPage from "./YARG/Nightly";

const Router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <Home />
            },

            {
                path: "/news",
                element: <News />
            },

            {
                path: "/settings",
                element: <Settings />
            },

            {
                path: "/yarg/stable",
                element: <StableYARGPage />
            },

            {
                path: "/yarg/nightly",
                element: <NightlyYARGPage />
            },
        ]
    },
]);

export default Router;