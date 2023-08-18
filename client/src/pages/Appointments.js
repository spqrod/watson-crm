import "../styles/appointments.css";
import AppointmentAsListItem from "../components/AppointmentAsListItem";
import AppointmentFormForDialog from "../components/AppointmentFormForDialog";
import { useState } from "react";


export default function Appointments() {


    const appointmentsArray = [
        {
            id: 0,
            date: "02.03.2023",
            time: "10:30",
            firstName: "John",
            lastName: "Watson",
            doctor: "Dr Watson",
            procedure: "Scaling",
            payment: "Nhima"
        },
        {
            id: 1,
            date: "02.03.2023",
            time: "11:30",
            firstName: "Mark",
            lastName: "Brown",
            doctor: "Dr Watson",
            procedure: "Extraction",
            payment: "Cash"
        },
        {
            id: 2,
            date: "02.03.2023",
            time: "12:30",
            firstName: "Stephen",
            lastName: "Hawking",
            doctor: "Dr Watson",
            procedure: "Scaling",
            payment: "Cash"
        },

    ];

    const date = new Date().toDateString();

    const [ selectedAppointment, setSelectedAppointment ] = useState(appointmentsArray[0]);

    const controller = {
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
            const liArray = appointmentsArray.map((item, index) => 
                <AppointmentAsListItem appointment={ item } key = { item.id } handleAppointmentClick = { controller.handleAppointmentClick } />
            )
            return liArray;
        },
        showDialog: function() {
            const dialog = document.querySelector(".dialog");
            dialog.showModal();
        },
    }

    return (
        <section className="appointmentsPage section">
            <div className="dateContainer">
                <p>{date}</p>
            </div>
            <div className="searchContainer">
                <p>Search</p>
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
        </section>
    );
}