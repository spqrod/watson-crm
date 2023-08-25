import "../styles/appointmentFormDialog.css";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function AppointmentFormDialog(data) {

    const [ selectedAppointment, setSelectedAppointment ] = useState(data.appointment);
    const [ availableTimesSlotsForTimePicker, setAvailableTimesSlotsForTimePicker ] = useState([data.timeSlots]);
    const todayForPicker = dayjs().format("YYYY-MM-DD");
    const sixMonthsFromTodayForPicker = dayjs().add(6, "month").format("YYYY-MM-DD");
    const { 
        getAvailableTimeSlots, 
        handleAppointmentSubmit, 
        handleAppointmentUpdate, 
        handleAppointmentDelete 
    } = data;
    const doctorsList = ["Dr Watson", "Mrs Moshoka", "Dr Chanda"];
    const paymentsList = ["Nhima", "Cash", "Swipe", "SES", "Liberty", "Medlink"];
    const treatmentsList = ["Con", "XR", "TF", "PF", "RCT", "XLA", "SXLA"];

    const controller = {
        getSelectedDate: function() {
        const datePicker = document.querySelector(".appointmentForm .datePicker");
        return datePicker.value;
        },
        resetFormToDefault() {
            document.querySelector(".appointmentForm").reset();
        },
        makeUpdateButtonActive() {
            const submitButton = document.querySelector(".button.update");
            submitButton.classList.remove("disabled");
        }
    }

    useEffect(() => {
        setSelectedAppointment(data.appointment);
    }, [data.appointment]);
    
    useEffect(() => {
        setAvailableTimesSlotsForTimePicker(data.timeSlots)
    }, [data.timeSlots]);

    return (
        <dialog className="dialog appointmentFormDialog">
            <form className="formForDialogCloseButton" method="dialog">
                <button className="closeButton" onClick={controller.resetFormToDefault} >
                    x
                </button>
            </form>
            <form className="appointmentForm" onSubmit={ selectedAppointment ? handleAppointmentUpdate : handleAppointmentSubmit }>
                <div className="infoContainer">
                    <div className="labelAndInputContainer">
                        <label htmlFor="date">Date:</label>
                        <input type="date" name="date" id="date" className="datePicker"
                            min={todayForPicker}
                            max={sixMonthsFromTodayForPicker}
                            onChange={() => { 
                                getAvailableTimeSlots(controller.getSelectedDate());
                                controller.makeUpdateButtonActive();
                            }}
                            defaultValue={ selectedAppointment ? selectedAppointment.date : ""}
                        />
                    </div>
                    <div className="labelAndInputContainer">
                        <label htmlFor="time">Time:</label>
                        <input 
                            type="time" 
                            name="time" 
                            id="time" 
                            defaultValue={selectedAppointment ? selectedAppointment.time : ""}
                            list="availableTimesDatalist"
                            onChange={ selectedAppointment ? controller.makeUpdateButtonActive : null}
                        />
                        <datalist id="availableTimesDatalist">
                            {availableTimesSlotsForTimePicker.map((item) => (<option key={item} value={item}></option>))}
                        </datalist>
                    </div>
                    <div className="labelAndInputContainer">
                        <label htmlFor="firstName">First Name:</label>
                        <input 
                            type="text" 
                            name="firstName" 
                            id="firstName" 
                            defaultValue={selectedAppointment ? selectedAppointment.firstName : ""}
                            onChange={ selectedAppointment ? controller.makeUpdateButtonActive : null}
                        />
                    </div>
                    <div className="labelAndInputContainer">
                        <label htmlFor="lastName">Last Name:</label>
                        <input 
                            type="text" 
                            name="lastName" 
                            id="lastName" 
                            defaultValue={selectedAppointment ? selectedAppointment.lastName : ""}
                            onChange={ selectedAppointment ? controller.makeUpdateButtonActive : null}
                        />
                    </div>
                    <div className="labelAndInputContainer">
                        <label htmlFor="doctor">Doctor:</label>
                        <select 
                            id="doctor" 
                            name="doctor" 
                            onChange={ selectedAppointment ? controller.makeUpdateButtonActive : null}
                        >
                            <option hidden>{selectedAppointment ? selectedAppointment.doctor : ""}</option>
                            { doctorsList.map((item) => (<option key={ item } value={ item }>{ item }</option>)) }
                        </select>
                    </div>
                    <div className="labelAndInputContainer">
                        <label htmlFor="payment">Payment:</label>
                        <select 
                            id="payment" 
                            name="payment"
                            onChange={ selectedAppointment ? controller.makeUpdateButtonActive : null}
                        >
                            <option hidden>{selectedAppointment ? selectedAppointment.payment : ""}</option>
                            { paymentsList.map((item) => (<option key={ item } value={ item }>{ item }</option>)) }
                        </select>
                    </div>
                    <div className="labelAndInputContainer">
                        <label htmlFor="procedure">Treatment:</label>
                        <select 
                            id="treatment" 
                            name="treatment"
                            onChange={ selectedAppointment ? controller.makeUpdateButtonActive : null}
                        >
                            <option hidden>{selectedAppointment ? selectedAppointment.treatment : ""}</option>
                            { treatmentsList.map((item) => (<option key={ item } value={ item }>{ item }</option>)) }
                        </select>
                    </div>
                </div>

                <div className="buttonsContainer">
                    <button 
                        className={`button ${ selectedAppointment ? null : "disabled"}`} 
                        type="button" 
                        onClick={ handleAppointmentDelete }
                    >
                        Delete
                    </button>
                    <button 
                        className={`button ${ selectedAppointment ? "disabled update" : null}`} 
                        type="submit"
                    >
                        { selectedAppointment ? "Update Appointment" : "Add New" }
                    </button>
                </div>
            </form>
        </dialog>

    );
}