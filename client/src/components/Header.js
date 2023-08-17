import { Link, NavLink } from "react-router-dom";
import "../styles/header.css";

export default function Header() {

    return (
        <header className="header">
            <ul className="menuContainer">
                <li className="menuItem">
                    <NavLink className="menuLink" to="/">
                        Домой
                    </NavLink>
                </li>
            </ul>
        </header>
    );
}