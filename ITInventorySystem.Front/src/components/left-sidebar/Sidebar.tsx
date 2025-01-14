import {Link} from "react-router-dom";
import "./sidebar.css";
import classNames from "classnames";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faBoxOpen, faFileLines, faHome, faUserGear, faUserTie, faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {Fragment, useEffect, useState} from "react";
import axios from "../../AxiosConfig";
import JwtUser from "../../types/JwtUser.tsx";
import {jwtDecode} from "jwt-decode";

const API_ENDPOINTS = {
    usersPage: (port: string) => `https://localhost:${port}/auth/users-page`,
};

type SidebarProps = {
    isSidebarCollapsed: boolean;
    changeIsSidebarCollapsed: (isSidebarCollapsed: boolean) => void;
    port: string;
    loggedUser: JwtUser | null;
};

const Sidebar = ({
                     isSidebarCollapsed,
                     changeIsSidebarCollapsed,
                     port,
                     loggedUser,
                 }: SidebarProps) => {
    const [hasAdminAccess, setHasAdminAccess] = useState<boolean>(false);
    
    const items = [
        {routerLink: "dashboard", icon: faHome, label: "Dashboard"},
        {routerLink: "inventory", icon: faBoxOpen, label: "Inventário"},
        {routerLink: "clients", icon: faUserTie, label: "Clientes"},
        {routerLink: "work-orders", icon: faFileLines, label: "Ordens de Serviço"},
    ];

    const adminItems = [
        {routerLink: "users", icon: faUserGear, label: "Usuários"},
    ];

    const sidebarClasses = classNames({
        sidenav: true,
        "sidenav-collapsed": isSidebarCollapsed,
    });

    const toggleCollapse = () => {
        changeIsSidebarCollapsed(!isSidebarCollapsed);
    };

    useEffect(() => {
        const checkAdminAccess = async () => {
            try {
                await axios.get(API_ENDPOINTS.usersPage(port));
                setHasAdminAccess(true);
            } catch {
                setHasAdminAccess(false);
            }
        };

        checkAdminAccess();
    }, [port]);

    const getCurrentUser = () => {
        const token = localStorage.getItem("token");
        if (!token) return null;

        try {
            return jwtDecode(token) as JwtUser; // Retorna o usuário logado decodificado
        } catch {
            return null;
        }
    };

    if (!loggedUser)
        loggedUser = getCurrentUser();

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };   
    

    return (
        <div className={sidebarClasses}>
            <div className="logo-container">
                <button className="logo" onClick={toggleCollapse}>
                    <FontAwesomeIcon icon={faBars}/> {/* Usando o FontAwesomeIcon para o ícone de menu */}
                </button>
                {!isSidebarCollapsed && (
                    <Fragment>
                        <div className="logo-text">Menu</div>
                    </Fragment>
                )
                }

            </div>
            <div className="sidenav-nav">
                {items.map(item => (
                    <li key={item.label} className="sidenav-nav-item">
                        <Link className="sidenav-nav-link" to={item.routerLink}>
                            <FontAwesomeIcon icon={item.icon}
                                             className="sidenav-link-icon"/> {/* Usando o FontAwesomeIcon para cada ícone */}
                            {!isSidebarCollapsed && <span className="sidenav-link-text">{item.label}</span>}
                        </Link>
                    </li>
                ))}
                {hasAdminAccess && adminItems.map(item => (
                    <li key={item.label} className="sidenav-nav-item">
                        <Link className="sidenav-nav-link" to={item.routerLink}>
                            <FontAwesomeIcon icon={item.icon}
                                             className="sidenav-link-icon"/> {/* Usando o FontAwesomeIcon para cada ícone */}
                            {!isSidebarCollapsed && <span className="sidenav-link-text">{item.label}</span>}
                        </Link>
                    </li>
                ))}
                <hr/>
                <div className="sidenav-nav-item user-section">
                    <Link to="/profile" className="user-info">
                        <div className="user-avatar">
                            <span>{loggedUser?.unique_name.charAt(0).toUpperCase()}</span> {/* Avatar com a inicial do nome */}
                        </div>
                        <span className="user-name">{loggedUser?.unique_name}</span> {/* Nome do usuário */}
                    </Link>
                    <button className="logout-button" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faArrowRightFromBracket} className="logout-icon" />
                    </button>
                </div>
            </div>            
        </div>
    )

}

export default Sidebar;