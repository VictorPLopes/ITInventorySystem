import {Link} from "react-router-dom";
import "./sidebar.css";
import classNames from "classnames";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBars, faBoxOpen, faFileLines, faHome, faUserGear, faUserTie,} from "@fortawesome/free-solid-svg-icons";
import {Fragment, useEffect, useState} from "react";
import axios from "../../AxiosConfig";
import {Button} from "react-bootstrap";

const API_ENDPOINTS = {
    usersPage: (port: string) => `https://localhost:${port}/auth/users-page`,
};

type SidebarProps = {
    isSidebarCollapsed: boolean;
    changeIsSidebarCollapsed: (isSidebarCollapsed: boolean) => void;
    port: string;
};

const Sidebar = ({
                     isSidebarCollapsed,
                     changeIsSidebarCollapsed,
                     port,
                 }: SidebarProps) => {
    const [hasAdminAccess, setHasAdminAccess] = useState<boolean>(false);

    const items = [
        {routerLink: "dashboard", icon: faHome, label: "Dashboard"},
        {routerLink: "inventory", icon: faBoxOpen, label: "Inventário"},
        {routerLink: "clients", icon: faUserTie, label: "Clientes"},
        {routerLink: "workorder", icon: faFileLines, label: "Ordens de Serviço"},
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
                <Button variant="danger" onClick={handleLogout} className="w-100">
                    Sair
                </Button>
            </div>
        </div>
    )

}

export default Sidebar;