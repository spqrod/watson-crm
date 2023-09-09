import "../styles/analytics.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function Analytics() {

    const navigate = useNavigate();

    const api = {
        checkAuthorization() {
            const fetchURL = "/authorization";
            return fetch(fetchURL);
        },
    };

    const controller = {
        checkAuthorization() {
            api.checkAuthorization()
                .then(res => {
                    if ((res.status === 401) || (res.status === 403))
                        navigate("/login");
                });
        },
    };

    useEffect(() => {
        controller.checkAuthorization();
    }, []);

    return (
        <section className="analyticsPage section">
            <div className="contentContainer">
            </div>
        </section>
    );
}