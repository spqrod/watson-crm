import "../styles/appointments.css";
import AppointmentAsListItem from "../components/AppointmentAsListItem";
import AppointmentFormForDialog from "../components/AppointmentFormForDialog";
import { useState, useEffect } from "react";


export default function Appointments() {

    const date = new Date().toDateString();

    const [ appointmentsArray, setAppointmentsArray ] = useState([]);
    const [ selectedAppointment, setSelectedAppointment ] = useState();

    const api = {
        getAppointments: function() {
            const fetchURL = "/appointments";
            return fetch(fetchURL).then(res => res.json());
        }
    };

    const controller = {
        getAppointments: function() {
            api.getAppointments().then(res => setAppointmentsArray(res));
        },
        handleAppointmentClick: function(e) {
            const appointmentID = e.currentTarget.id;
            const appointment = controller.getAppointment(appointmentID);
            setSelectedAppointment(appointment);
            display.showDialog(appointment);
        },
        getAppointment: function(id) {
            return appointmentsArray[id];
        },
        getPatientData: function() {

        },
    };
    
    const display = {
        renderAppointmentsList: function() {
            if (appointmentsArray) {
                const liArray = appointmentsArray.map((item, index) => 
                    <AppointmentAsListItem appointment={ item } key = { item.id } handleAppointmentClick = { controller.handleAppointmentClick } />
                )
                return liArray;
            }
        },
        showDialog: function() {
            const dialog = document.querySelector(".dialog");
            dialog.showModal();
        },
    };

    useEffect(() => {
        controller.getAppointments();
    }, []);

    return (
        <section className="appointmentsPage section">
            <div className="contentContainer">

                <div className="dateContainer">
                    <p>{date}</p>
                </div>
                <div className="addNewContainer">
                    New Appointment
                </div>
                <div className="searchContainer">
                    <p>Search</p>
                </div>
                <div className="headerRowContainer">
                    <p>Time</p>
                    <p>First Name</p>
                    <p>Last Name</p>
                    <p>Doctor</p>
                    <p>Procedure</p>
                    <p>Payment</p>
                </div>
                <ul className="appointmentListContainer" >
                    { display.renderAppointmentsList() }
                </ul>
                <dialog className="dialog">
                    <form className="formForDialogCloseButton" method="dialog">
                        <button className="closeButton" >
                            x
                        </button>
                    </form>
                    <AppointmentFormForDialog appointment={selectedAppointment} />
                </dialog>
            </div>

        </section>
    );
}