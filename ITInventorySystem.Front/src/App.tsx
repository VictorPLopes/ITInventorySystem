import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SetupPage from "./pages/SetupPage";
import Dashboard from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import ClientsPage from "./pages/ClientsPage";
import InventoryPage from "./pages/InventoryPage";
import WorkOrdersPage from "./pages/WorkOrdersPage";
import ProfilePage from "./pages/ProfilePage";
import { Fragment, useEffect, useState } from "react";
import "./App.css";
import Layout from "./Layout/Layout";
import "@fortawesome/fontawesome-free/css/all.css";
import JwtUser from "./types/JwtUser";
import StockMovementPage from "./pages/StockMovementPage.tsx";

function App() {
    const port: string = "44307";

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
    const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
    const [loggedUser, setLoggedUser] = useState<null | JwtUser>(null);

    // Salva o usuário no estado e localStorage após login
    const saveLoggedUser = (user: JwtUser) => {
        localStorage.setItem("loggedUser", JSON.stringify(user)); // Salva no localStorage
        setLoggedUser(user); // Atualiza o estado
    };

    // Remove o usuário do estado e localStorage no logout
    const handleLogout = () => {
        localStorage.removeItem("loggedUser");
        setLoggedUser(null);
        window.location.href = "/"; // Redireciona para a página de login
    };

    // Carrega o usuário do localStorage ao montar o componente
    useEffect(() => {
        const storedUser = localStorage.getItem("loggedUser");
        if (storedUser) {
            setLoggedUser(JSON.parse(storedUser));
        }
    }, []);

    // Atualiza a largura da tela e ajusta a sidebar
    useEffect(() => {
        const updateSize = () => {
            setScreenWidth(window.innerWidth);
            if (window.innerWidth < 768) {
                setIsSidebarCollapsed(true);
            }
        };
        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return (
        <Fragment>
            <Routes>
                {/* Páginas de Login e configuração */}
                <Route
                    path="/"
                    element={<LoginPage port={port} onLogin={saveLoggedUser} />}
                />
                <Route
                    path="/setup"
                    element={<SetupPage port={port} />}
                />

                {/* Rotas com layout que inclui a sidebar */}
                <Route
                    element={
                        <Layout
                            port={port}
                            screenWidth={screenWidth}
                            isSidebarCollapsed={isSidebarCollapsed}
                            setIsSidebarCollapsed={setIsSidebarCollapsed}
                            loggedUser={loggedUser}
                        />
                    }
                >
                    <Route path="/dashboard" element={<Dashboard port={port} />} />
                    <Route
                        path="/users"
                        element={<UsersPage port={port} loggedUser={loggedUser} />}
                    />
                    <Route path="/clients" element={<ClientsPage port={port} />} />
                    <Route path="/inventory" element={<InventoryPage port={port} />} />
                    <Route
                        path="/work-orders"
                        element={<WorkOrdersPage port={port} />}
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProfilePage port={port} loggedUser={loggedUser} />
                        }
                    />
                    <Route
                        path="/movements"
                        element={<StockMovementPage port={port}/>}
                    />
                </Route>
            </Routes>
        </Fragment>
    );
}

export default App;
