import { useEffect, useState } from "react";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {

    const api = {
        submit(user) {
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
            const user = { username, password }
            api.submit(user)
                .then(res => {
                    setServerMessage(res.message);
                    if (res.success) {
                        document.cookie = `token=${res.token}; max-age=60*60*12`;
                        navigate("/reports");
                    };
                });
        }
    };

    const display = {
        makeSubmitButtonActive() {
            const submitButton = document.querySelector(".submitButton");
            submitButton.classList.remove("disabled");
        }
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
                <form className="form" onSubmit={ controller.handleSubmit }>
                    <div className="labelAndInputContainer">
                        <label htmlFor="username">Username: </label>
                        <input className="inputField" type="text" name="username" id="username"/>
                    </div>
                    <div className="labelAndInputContainer">
                        <label htmlFor="password">Password: </label>
                        <input className="inputField" type="text" name="password" id="password" onChange = { controller.makeSubmitButtonActive } 
                        />
                    </div>
                    <p className="serverMessage">{ serverMessage }</p>
                    <div className="buttonsContainer">
                        <button className={`button submitButton disabled`} type="submit">
                            Submit
                        </button>
                    </div> 
                </form>
            </dialog>
        </section>
    );
}