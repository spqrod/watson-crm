import { Link, NavLink } from "react-router-dom";
import "../styles/header.css";

export default function Header() {

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
                <li className="menuItem">
                    <NavLink className="menuLink" to="/login">
                        Log In
                    </NavLink>
                </li>
            </ul>
        </header>
    );
}