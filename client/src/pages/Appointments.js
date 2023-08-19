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
            firstName: "Leeroy",
            lastName: "Hawking",
            doctor: "Dr Watson",
            procedure: "Scaling",
            payment: "Cash"
        },
        {
            id: 3,
            date: "02.03.2023",
            time: "13:30",
            firstName: "Stephen",
            lastName: "Jenkins",
            doctor: "Dr Watson",
            procedure: "Scaling",
            payment: "Cash"
        },
        {
            id: 4,
            date: "02.03.2023",
            time: "14:00",
            firstName: "Lark",
            lastName: "Hawking",
            doctor: "Dr Watson",
            procedure: "Scaling",
            payment: "Cash"
        },
        {
            id: 5,
            date: "02.03.2023",
            time: "15:00",
            firstName: "Stephen",
            lastName: "Downing",
            doctor: "Dr Watson",
            procedure: "Scaling",
            payment: "Cash"
        },
        {
            id: 6,
            date: "02.03.2023",
            time: "15:30",
            firstName: "Jessica",
            lastName: "Hawking",
            doctor: "Dr Watson",
            procedure: "Scaling",
            payment: "Cash"
        },
        {
            id: 7,
            date: "02.03.2023",
            time: "16:00",
            firstName: "Chris",
            lastName: "Brown",
            doctor: "Dr Watson",
            procedure: "Scaling",
            payment: "Cash"
        },
        {
            id: 8,
            date: "02.03.2023",
            time: "16:30",
            firstName: "Mark",
            lastName: "Hawking",
            doctor: "Dr Watson",
            procedure: "Scaling",
            payment: "Cash"
        },
        {
            id: 9,
            date: "02.03.2023",
            time: "16:30",
            firstName: "Stephen",
            lastName: "Hawking",
            doctor: "Dr Watson",
            procedure: "Scaling",
            payment: "Cash"
        },
        {
            id: 10,
            date: "02.03.2023",
            time: "16:30",
            firstName: "Facundo",
            lastName: "Montana",
            doctor: "Dr Watson",
            procedure: "Scaling",
            payment: "Nhima"
        },
        {
            id: 11,
            date: "02.03.2023",
            time: "16:30",
            firstName: "Sergey",
            lastName: "Brin",
            doctor: "Dr Watson",
            procedure: "Scaling",
            payment: "Cash"
        },
        {
            id: 12,
            date: "02.03.2023",
            time: "16:30",
            firstName: "Nikola",
            lastName: "Tesla",
            doctor: "Dr Watson",
            procedure: "Whitening",
            payment: "Cash"
        },
        {
            id: 13,
            date: "02.03.2023",
            time: "16:30",
            firstName: "John",
            lastName: "Kennedy",
            doctor: "Dr Watson",
            procedure: "Scaling",
            payment: "Nhima"
        },
        {
            id: 14,
            date: "02.03.2023",
            time: "16:30",
            firstName: "Donald",
            lastName: "Ceasar",
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