import { useEffect, useState } from "react";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";
import LoadingScreen, { showLoadingScreen, hideLoadingScreen }  from "../components/LoadingScreen.js";

export default function Login() {

    const [ mode, setMode ] = useState("login");

    const api = {
        submitLogIn(user) {
            const fetchURL = "/login";
            const fetchOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            };
            return fetch(fetchURL, fetchOptions)
                .then(res => res.json());
        },
        submitRegister(user) {
            const fetchURL = "/register";
            const fetchOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            };
            return fetch(fetchURL, fetchOptions)
                .then(res => res.json());
        }
    };

    const controller = {
        makeSubmitButtonActive() {
            display.makeSubmitButtonActive();
        },
        handleSubmit(e) {
            e.preventDefault();
            const username = e.target.username.value;
            const password = e.target.password.value;
            const user = { username, password };
            showLoadingScreen();

            if (mode === "login")
                api.submitLogIn(user)
                    .then(res => {
                        hideLoadingScreen();
                        if (res.success) {
                            document.cookie = `token=${res.token}; max-age=86400`;
                            document.cookie = `accessLevel=${res.accessLevel}; max-age=86400`;
                            navigate("/appointments");
                        } else {
                            setServerMessage(res.message);
                            display.turnServerMessageRed();
                        }
                });
            else if (mode === "register")
                api.submitRegister(user)
                    .then(res => {
                        hideLoadingScreen();
                        if (res.success) {
                            setServerMessage("Registration successful! You will be able to login once the administrator approves your account.");
                            display.turnServerMessageGreen();
                        } else {
                            setServerMessage(res.message);
                            display.turnServerMessageRed();
                        }
                });
        },
        handleRegisterOrLoginClick() {
            display.resetForm();
            display.makeSubmitButtonDisabled();
            setServerMessage();
            if (mode === "login")
                setMode("register");
            else if (mode === "register")
                setMode("login");
        },
    };

    const display = {
        resetForm() {
            const form = document.querySelector(".form");
            form.reset();
        },
        makeSubmitButtonActive() {
            const submitButton = document.querySelector(".submitButton");
            submitButton.classList.remove("disabled");
        },
        makeSubmitButtonDisabled() {
            const submitButton = document.querySelector(".submitButton");
            submitButton.classList.add("disabled");
        },
        turnServerMessageGreen() {
            const serverMessage = document.querySelector(".serverMessage");
            serverMessage.classList.remove("fail");
            serverMessage.classList.add("success");
        },
        turnServerMessageRed() {
            const serverMessage = document.querySelector(".serverMessage");
            serverMessage.classList.add("fail");
            serverMessage.classList.remove("success");
        },
    }

    const [ serverMessage, setServerMessage ] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const dialog = document.querySelector(".dialog");
        dialog.showModal();
    }, []);

    return (
        <section className="loginPage section">            
            <dialog className="dialog loginFormDialog">
                <h3 className="dialogHeader">
                    { mode === "login" ? "Log In" : "Register" } 
                </h3>
                <form className="form" onSubmit={ controller.handleSubmit }>
                    <div className="labelAndInputContainer">
                        <label htmlFor="username">Username: </label>
                        <input className="inputField" type="text" name="username" id="username" autoComplete="username"/>
                    </div>
                    <div className="labelAndInputContainer">
                        <label htmlFor="password">Password: </label>
                        <input className="inputField" type="password" name="password" id="password" onChange = { controller.makeSubmitButtonActive } 
                        />
                    </div>
                    <p className="serverMessage fail">{ serverMessage }</p>
                    <div className="buttonsContainer">
                        <button className={`button submitButton disabled`} type="submit">
                            { mode === "login" ? "Log In" : "Register" } 
                        </button>
                        <p className="registerLine" onClick={controller.handleRegisterOrLoginClick}>
                            { mode === "login" ? "New here? Register." : "Already registered? Log in." } 
                        </p>
                    </div> 
                </form>
            </dialog>
            <LoadingScreen />
        </section>
    );
}