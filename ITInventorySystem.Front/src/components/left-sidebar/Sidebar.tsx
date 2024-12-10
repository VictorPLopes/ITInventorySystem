import {Link} from "react-router-dom"
import "./sidebar.css"
import classNames from "classnames";
import {Fragment} from "react/jsx-runtime";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars, faBoxOpen, faFileLines, faHome, faUserGear, faUserTie} from '@fortawesome/free-solid-svg-icons';


type SidebarProps = {
    isSidebarCollapsed: boolean
    changeIsSidebarCollapsed: (isSidebarCollapsed: boolean) => void;
}

const Sidebar = ({
                     isSidebarCollapsed,
                     changeIsSidebarCollapsed

                 }: SidebarProps) => {
    const items = [
        {
            routerLink: "dashboard",
            icon: faHome,
            label: "Dashboard",
        },
        {
            routerLink: "products",
            icon: faBoxOpen,
            label: "Products",
        },
        {
            routerLink: "clients",
            icon: faUserTie,
            label: "Clients",
        },
        {
            routerLink: "users",
            icon: faUserGear,
            label: "Users",
        },
        {
            routerLink: "workorder",
            icon: faFileLines,
            label: "Work Orders",
        },
    ];

    const sidebarClasses = classNames({
        sidenav: true,
        "sidenav-collapsed": isSidebarCollapsed,
    })
    /*const closeSidenav = () => {
        changeIsSidebarCollapsed(true);
    }*/

    const toggleCollapse = (): void => {
        changeIsSidebarCollapsed(!isSidebarCollapsed)
    }

    return (
        <div className={sidebarClasses}>
            <div className="logo-container">
                <button className="logo" onClick={toggleCollapse}>
                    <FontAwesomeIcon icon={faBars}/> {/* Usando o FontAwesomeIcon para o ícone de menu */}
                </button>
                {!isSidebarCollapsed && (
                    <Fragment>
                        <div className="logo-text">Menu</div>
                        {/*{<button className="btn-close" onClick={closeSidenav}>
                            <FontAwesomeIcon icon={faTimes}/>
                        </button>}*/}
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
            </div>
        </div>
    )

}

export default Sidebar;