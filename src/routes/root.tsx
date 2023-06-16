// import { Container } from './styles';

import Sidebar from "@app/components/Sidebar";
import { Outlet } from "react-router-dom";

const RootLayout: React.FC = () => {
    return (<>

        <Sidebar />
        <div id="content">
            <Outlet />
        </div>

    </>);
};

export default RootLayout;