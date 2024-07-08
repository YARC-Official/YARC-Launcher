import { createBrowserRouter } from "react-router-dom";

import RootLayout from "@app/routes/root";
import Home from "@app/routes/Home";
import Settings from "@app/routes/Settings";
import StableYARGPage from "./YARG/Stable";
import NightlyYARGPage from "./YARG/Nightly";
import OfficialSetlistPage from "./Setlist/Official";
import Queue from "@app/routes/Queue";
import NewsPage from "./NewsPage";
import AppProfile from "./AppProfile";

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
                path: "/app-profile/:uuid",
                element: <AppProfile />
            },
            {
                path: "/news/:md",
                element: <NewsPage />
            }
        ]
    },
]);

export default Router;
