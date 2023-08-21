import "../styles/appointmentFormForDialog.css";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function AppointmentFormForDialog(data) {

    const [ selectedAppointment, setSelectedAppointment ] = useState(data.appointment);
    const [ availableTimesSlotsForTimePicker, setAvailableTimesSlotsForTimePicker ] = useState([data.timeSlots]);
    const todayForPicker = dayjs().format("YYYY-MM-DD");
    const sixMonthsFromTodayForPicker = dayjs().add(6, "month").format("YYYY-MM-DD");
    const { getAvailableTimeSlots } = data;

   const controller = {

        getSelectedDate: function() {
            const datePicker = document.querySelector(".appointmentForm .datePicker");
            return datePicker.value;
        }
    }

    useEffect(() => {
        setSelectedAppointment(data.appointment);
        setAvailableTimesSlotsForTimePicker(data.timeSlots);
    }, [data.timeSlots]);

        return (
            <form className="appointmentForm" action="">
                <p>{availableTimesSlotsForTimePicker}</p>
                <div className="infoContainer">
                    <div className="labelAndInputContainer">
                        <label htmlFor="date">Date:</label>
                        <input type="date" name="date" id="date" className="datePicker"
                            min={todayForPicker}
                            max={sixMonthsFromTodayForPicker}
                            onChange={() => getAvailableTimeSlots(controller.getSelectedDate())}
                            defaultValue={ selectedAppointment ? selectedAppointment.date : ""}
                        />
                    </div>
                    <div className="labelAndInputContainer">
                        <label htmlFor="time">Time:</label>
                        <input type="time" name="time" id="time" 
                            defaultValue={selectedAppointment ? selectedAppointment.time : ""}
                            list="availableTimes"
                        />
                        <datalist id="availableTimes">
                            {availableTimesSlotsForTimePicker.map((item) => (<option key={item} value={item}></option>))}
                        </datalist>
                    </div>
                    <div className="labelAndInputContainer">
                        <label htmlFor="firstName">First Name:</label>
                        <input type="text" name="firstName" id="firstName" defaultValue={selectedAppointment ? selectedAppointment.firstName : ""}/>
                    </div>
                    <div className="labelAndInputContainer">
                        <label htmlFor="lastName">Last Name:</label>
                        <input type="text" name="lastName" id="lastName" defaultValue={selectedAppointment ? selectedAppointment.lastName : ""}/>
                    </div>
                    <div className="labelAndInputContainer">
                        <label htmlFor="doctor">Doctor:</label>
                        <input type="text" name="doctor" id="doctor" defaultValue={selectedAppointment ? selectedAppointment.doctor : ""}/>
                    </div>
                    <div className="labelAndInputContainer">
                        <label htmlFor="payment">Payment:</label>
                        <input type="tel" name="payment" id="payment" defaultValue={selectedAppointment ? selectedAppointment.payment : ""}/>
                    </div>
                    <div className="labelAndInputContainer">
                        <label htmlFor="procedure">Procedure:</label>
                        <input type="text" name="procedure" id="procedure" defaultValue={selectedAppointment ? selectedAppointment.procedure : ""}/>
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