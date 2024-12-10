import { Outlet } from "react-router-dom";
import "./layout.css";
import classNames from "classnames";
import Sidebar from "../components/left-sidebar/Sidebar";  // Importando a Sidebar

type LayoutProps = {
  isSidebarCollapsed: boolean;
  screenWidth: number;
  setIsSidebarCollapsed: (isSidebarCollapsed: boolean) => void;
};

const Layout = ({ isSidebarCollapsed, screenWidth, setIsSidebarCollapsed }: LayoutProps) => {
  const classes = classNames({
    body: true,
    "body-trimmed": !isSidebarCollapsed && screenWidth > 768, // Aplica o estilo quando a sidebar não está colapsada e a tela é maior que 768px
  });

  return (
    <div className="layout-container">
      {/* Renderiza a Sidebar */}
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        changeIsSidebarCollapsed={setIsSidebarCollapsed}
      />

      {/* O conteúdo principal da página será renderizado aqui */}
      <div className={classes}>
        {/* O Outlet renderiza o conteúdo das rotas dentro deste Layout */}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;