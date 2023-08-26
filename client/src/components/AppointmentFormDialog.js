import "../styles/appointmentFormDialog.css";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

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
            const submitButton = document.querySelector(".button.update");
            submitButton.classList.add("disabled");
        },
        makeUpdateButtonActive() {
            const submitButton = document.querySelector(".button.update");
            submitButton.classList.remove("disabled");
        },
        updateNoshowCheckbox(isNoshowCheckboxChecked) {
            if (isNoshowCheckboxChecked)
                document.querySelector(".noshowCheckbox").checked = true;
        }
    }

    useEffect(() => {
        setSelectedAppointment(data.appointment);
        if (data.appointment)
            controller.updateNoshowCheckbox(data.appointment.noshow);
    }, [data.appointment]);
    
    useEffect(() => {
        setAvailableTimesSlotsForTimePicker(data.timeSlots)
    }, [data.timeSlots]);

    return (
        <dialog className="dialog appointmentFormDialog" onClose={ controller.resetFormToDefault } >
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
                                if (selectedAppointment) controller.makeUpdateButtonActive();
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
                        <label htmlFor="cost">Cost:</label>
                        <input 
                            type="number" 
                            name="cost" 
                            id="cost" 
                            defaultValue={selectedAppointment ? selectedAppointment.cost : ""}
                            onChange={ selectedAppointment ? controller.makeUpdateButtonActive : null}
                        />
                    </div>
                    <div className="labelAndInputContainer">
                        <label htmlFor="file">File:</label>
                        <input 
                            type="text" 
                            name="file" 
                            id="file" 
                            defaultValue={selectedAppointment ? selectedAppointment.file : ""}
                            onChange={ selectedAppointment ? controller.makeUpdateButtonActive : null}
                        />
                    </div>
                    <div className="labelAndInputContainer">
                        <label htmlFor="phone">Phone:</label>
                        <input 
                            type="tel" 
                            name="phone" 
                            id="phone" 
                            defaultValue={selectedAppointment ? selectedAppointment.phone : ""}
                            onChange={ selectedAppointment ? controller.makeUpdateButtonActive : null}
                        />
                    </div>
                    <div className="labelAndInputContainer commentsContainer">
                        <label htmlFor="comments">Comments:</label>
                        {/* <input 
                            type="text" 
                            name="comments" 
                            id="comments" 
                            defaultValue={selectedAppointment ? selectedAppointment.comments : ""}
                            onChange={ selectedAppointment ? controller.makeUpdateButtonActive : null}
                        /> */}
                        <textarea 
                            className="commentsTextarea"
                            name="comments" 
                            id="comments" 
                            rows="1"
                            cols="30"
                            defaultValue={selectedAppointment ? selectedAppointment.comments : ""}
                            onChange={ selectedAppointment ? controller.makeUpdateButtonActive : null}
                        >
                        </textarea>
                    </div>
                </div>

                <div className="buttonsContainer">
                    <button 
                        className={`button deleteButton ${ selectedAppointment ? null : "disabled"}`} 
                        type="button" 
                        onClick={ handleAppointmentDelete }
                    >
                        <DeleteOutlineOutlinedIcon />
                        Delete
                    </button>
                    <div className={`button noShowButton ${ selectedAppointment ? null : "disabled"}`}> 
                        <input 
                            type="checkbox" 
                            className="noshowCheckbox" 
                            name="nowshow" 
                            id="noshow" 
                            onClick ={ controller.makeUpdateButtonActive }
                        /> 
                        <label htmlFor="noshow">No-show</label>
                    </div>
                    <button 
                        className={`button submitButton ${ selectedAppointment ? "disabled update" : null}`} 
                        type="submit"
                    >
                        { selectedAppointment ? "Update Appointment" : "Add New" }
                    </button>
                </div>
            </form>
        </dialog>

    );
}