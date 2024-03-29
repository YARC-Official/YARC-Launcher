import { createBrowserRouter } from "react-router-dom";

import RootLayout from "@app/routes/root";
import Home from "@app/routes/Home";
import Settings from "@app/routes/Settings";
import StableYARGPage from "./YARG/Stable";
import NightlyYARGPage from "./YARG/Nightly";
import OfficialSetlistPage from "./Setlist/Official";
import Queue from "@app/routes/Queue";
import NewsPage from "./NewsPage";

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
                path: "/settings",
                element: <Settings />
            },

            {
                path: "/queue",
                element: <Queue />
            },

            {
                path: "/yarg/stable",
                element: <StableYARGPage />
            },

            {
                path: "/yarg/nightly",
                element: <NightlyYARGPage />
            },

            {
                path: "/setlist/official",
                element: <OfficialSetlistPage />
            },

            {
                path: "/news/:md",
                element: <NewsPage />
            }
        ]
    },
]);

export default Router;