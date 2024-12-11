// src/App.tsx
import {Route, Routes} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import {Fragment, useEffect, useState} from "react";
import './App.css';
import Layout from './Layout/Layout';
import '@fortawesome/fontawesome-free/css/all.css';


function App() {
    let port: string = "44307"


    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
    const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

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
                {/* Página de Login - Não usa o layout com a sidebar */}
                <Route path="*" element={<LoginPage port={port}/>}/>

                {/* Rotas com layout que inclui a sidebar */}
                <Route
                    element={
                        <Layout
                            port={port}
                            screenWidth={screenWidth}
                            isSidebarCollapsed={isSidebarCollapsed}
                            setIsSidebarCollapsed={setIsSidebarCollapsed}
                        />
                    }
                >
                    <Route path="/dashboard" element={<Dashboard port={port}/>}/>
                    <Route path="/users" element={<UsersPage port={port}/>}/>
                    {/* Outras rotas que exigem o Layout com Sidebar */}
                    {/* <Route path="/clients" element={<ClientsPage port={port}/>}/> */}
                    {/* <Route path="/inventory" element={<InventoryPage port={port}/>}/> */}
                    {/* <Route path="/work-orders" element={<WorkOrdersPage port={port}/>}/> */}
                </Route>
            </Routes>
        </Fragment>
    );
}

export default App;
