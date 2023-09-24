import "../styles/settings.css";
import { useState, useEffect } from "react";
import EditIcon from '@mui/icons-material/Edit';
import LoadingScreen, { showLoadingScreen, hideLoadingScreen }  from "../components/LoadingScreen.js";

export default function Analytics() {

    const [ doctors, setDoctors ] = useState([]);
    const [ treatments, setTreatments ] = useState([]);
    const [ payments, setPayments ] = useState([]);
    const [ timeSlots, setTimeSlots ] = useState([]);
    const [ users, setUsers ] = useState([]);

    const api = {
        getDoctors() {
            return fetch("/doctors")
                .then(res => res.json());
        },
        getTreatments() {
            return fetch("/treatments")
                .then(res => res.json());
        },
        getPayments() {
            return fetch("/payments")
                .then(res => res.json());
        },
        getTimeSlots() {
            return fetch("/time-slots")
                .then(res => res.json());
        },
        getUsers() {
            return fetch("/users")
                .then(res => res.json());
        },
    };

    const controller = {
        handleImportAppointments() {
            fetch("/import-appointments")
                .then(res => res.json())
                .then(res => console.log(res))
                .catch(error => console.log(error));
        },
        handleImportPatients() {
            fetch("/import-patients")
                .then(res => res.json())
                .then(res => console.log(res))
                .catch(error => console.log(error));
        },
        getDoctors() {
            return api.getDoctors()
                .then(res => setDoctors(res));
        },
        getTreatments() {
            return api.getTreatments()
                .then(res => setTreatments(res));
        },
        getPayments() {
            return api.getPayments()
                .then(res => setPayments(res));
        },
        getTimeSlots() {
            return api.getTimeSlots()
                .then(res => setTimeSlots(res));
        },
        getUsers() {
            return api.getUsers()
                .then(res => setUsers(res));
        },
        handleDoctorsEdit() {

        },
        handleTreatmentsEdit() {

        },
        handlePaymentsEdit() {

        },
    }

    useEffect(() => {
        showLoadingScreen();
        Promise.all([
            controller.getDoctors(), 
            controller.getTreatments(), 
            controller.getPayments(), 
            controller.getTimeSlots(),
            controller.getUsers(),
        ])
            .then(() => hideLoadingScreen());
    }, []);


    return (
        <section className="settingsPage section">
            <div className="contentContainer">
                <div className="listContainer doctors">
                    <h3>Doctors List:</h3>
                    <p>
                        { doctors.map((doctor, index) => 
                            doctor + (index == (doctors.length - 1) ? "" : ", ")
                        )}
                    </p>
                    <button className="button secondary" onClick={ controller.handleDoctorsEdit }><EditIcon /> Edit</button>
                </div>
                <div className="listContainer treatments">
                    <h3>Treatments List:</h3>
                    <p>
                        { treatments.map((treatment, index) => 
                            treatment + (index == (treatments.length - 1) ? "" : ", ")
                        )}
                    </p>
                    <button className="button secondary" onClick={ controller.handleTreatmentsEdit }><EditIcon /> Edit</button>
                </div>
                <div className="listContainer payments">
                    <h3>Payments List:</h3>
                    <p>
                        { payments.map((payment, index) => 
                            payment + (index == (payments.length - 1) ? "" : ", ")
                        )}
                    </p>
                    <button className="button secondary" onClick={ controller.handlePaymentsEdit }><EditIcon /> Edit</button>
                </div>
                <div className="listContainer timeSlots">
                    <h3>Time Slots List:</h3>
                    <p>
                        { timeSlots.map((timeSlot, index) => 
                            timeSlot + (index == (timeSlots.length - 1) ? "" : ", ")
                        )}
                    </p>
                    <button className="button secondary" onClick={ controller.handleTimeSlotsEdit }><EditIcon /> Edit</button>
                </div>
                <div className="listContainer users">
                    <h3>Users List:</h3>
                    <p>
                        { users.map((user, index) => 
                            user.username + (index == (users.length - 1) ? "" : ", ")
                        )}
                    </p>
                    <button className="button secondary" onClick={ controller.handleUsersEdit }><EditIcon /> Edit</button>
                </div>
                <LoadingScreen />
                {/* <dialog className="dialog settingDialog">

                </dialog> */}


                <button className="button" onClick={ controller.handleImportAppointments }>
                    Import appointments
                </button>
                <button className="button" onClick={ controller.handleImportPatients }>
                    Import patients
                </button>
            </div>
        </section>
    );
}