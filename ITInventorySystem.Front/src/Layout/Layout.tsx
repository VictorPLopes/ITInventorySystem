import {Outlet} from "react-router-dom";
import "./layout.css";
import classNames from "classnames";
import Sidebar from "../components/left-sidebar/Sidebar";
import JwtUser from "../types/JwtUser.tsx"; // Importando a Sidebar

type LayoutProps = {
    port: string;
    isSidebarCollapsed: boolean;
    screenWidth: number;
    setIsSidebarCollapsed: (isSidebarCollapsed: boolean) => void;
    loggedUser: JwtUser | null;
};

const Layout = ({port, isSidebarCollapsed, screenWidth, setIsSidebarCollapsed, loggedUser}: LayoutProps) => {
    const classes = classNames({
        body: true,
        "body-trimmed": !isSidebarCollapsed && screenWidth > 768, // Aplica o estilo quando a sidebar não está colapsada e a tela é maior que 768px
    });

    return (
        <div className="layout-container">
            <Sidebar
                isSidebarCollapsed={isSidebarCollapsed}
                changeIsSidebarCollapsed={setIsSidebarCollapsed}
                port={port}
            />

            {/* O conteúdo principal da página será renderizado aqui */}
            <div className={classes}>
                {/* O Outlet renderiza o conteúdo das rotas dentro deste Layout */}
                <Outlet/>
            </div>
        </div>
    );
};

export default Layout;