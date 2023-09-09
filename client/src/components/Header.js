import { NavLink } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import "../styles/header.css";
import { useNavigate } from "react-router-dom";

export default function Header({ accessLevel }) {

    const navigate = useNavigate();

    const controller = {
        handleLogOut() {
            document.cookie = "token=0";
            navigate("/login");
        }
    };

    return (
        <header className="header">
            <ul className="menuContainer">
                <li className="menuItem">
                    <NavLink className="menuLink" to="/appointments">
                        Appointments
                    </NavLink>
                </li>
                <li className="menuItem">
                    <NavLink className="menuLink" to="/patients">
                        Patients
                    </NavLink>
                </li>
                <li className="menuItem">
                    <NavLink className="menuLink" to="/reports">
                        Reports
                    </NavLink>
                </li>
                {
                    accessLevel === "reception" ? null : 
                        accessLevel === "director" ?
                            <>
                                <li className="menuItem">
                                    <NavLink className="menuLink" to="/analytics">
                                        Analytics
                                    </NavLink>
                                </li>
                                <li className="menuItem">
                                    <NavLink className="menuLink" to="/settings">
                                        Settings
                                    </NavLink>
                                </li>
                            </>
                        : null
                }
                <li className="menuItem">
                    <div className="menuLink" onClick={ controller.handleLogOut }>
                        <LogoutIcon /> Log Out
                    </div>
                </li>
            </ul>
        </header>
    );
}