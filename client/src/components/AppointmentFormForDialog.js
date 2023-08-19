import "../styles/appointmentFormForDialog.css";
import { useEffect, useState } from "react";

export default function AppointmentFormForDialog(data) {

    const [ selectedAppointment, setSelectedAppointment ] = useState(data.appointment);

    useEffect(() => {
        setSelectedAppointment(data.appointment);
    }, [data]);

    return (
        <form className="appointmentForm" action="">
            <div className="infoContainer">
                <div className="labelAndInputContainer">
                    <label htmlFor="date">Date:</label>
                    <input type="text" name="date" id="date" value={selectedAppointment.date}/>
                </div>
                <div className="labelAndInputContainer">
                    <label htmlFor="time">Time:</label>
                    <input type="text" name="time" id="time" value={selectedAppointment.time}/>
                </div>
                <div className="labelAndInputContainer">
                    <label htmlFor="firstName">First Name:</label>
                    <input type="text" name="firstName" id="firstName" value={selectedAppointment.firstName}/>
                </div>
                <div className="labelAndInputContainer">
                    <label htmlFor="lastName">Last Name:</label>
                    <input type="text" name="lastName" id="lastName" value={selectedAppointment.lastName}/>
                </div>
                <div className="labelAndInputContainer">
                    <label htmlFor="doctor">Doctor:</label>
                    <input type="text" name="doctor" id="doctor" value={selectedAppointment.doctor}/>
                </div>
                <div className="labelAndInputContainer">
                    <label htmlFor="payment">Payment:</label>
                    <input type="text" name="payment" id="payment" value={selectedAppointment.payment}/>
                </div>
                <div className="labelAndInputContainer">
                    <label htmlFor="procedure">Procedure:</label>
                    <input type="text" name="procedure" id="procedure" value={selectedAppointment.procedure}/>
                </div>

            </div>

            <div className="buttonsContainer">
                <button className="button">
                    Delete
                </button>
                <button className="button">
                    Save
                </button>
            </div>


        </form>
    );
}