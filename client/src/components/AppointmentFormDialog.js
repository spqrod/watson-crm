import "../styles/appointmentFormDialog.css";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ReactDatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'

    export default function AppointmentFormDialog(data) {

    const [ selectedAppointment, setSelectedAppointment ] = useState(data.appointment);
    const [ takenTimeSlotsForTimePicker, setTakenTimeSlotsForTimePicker ] = useState([data.timeSlots]);
    const todayForPicker = dayjs().format("YYYY-MM-DD");
    const sixMonthsFromTodayForPicker = dayjs().add(6, "month").format("YYYY-MM-DD");
    const { 
        getTakenTimeSlots, 
        handleAppointmentSubmit, 
        handleAppointmentUpdate, 
        handleAppointmentDelete,
        isInPatientFormDialog,
        isOnAppointmentsPage
    } = data;
    const doctorsList = ["Dr Watson", "Mrs Moshoka", "Dr Chanda"];
    const paymentsList = ["Nhima", "Cash", "Swipe", "TT", "SES", "Liberty", "Medlink"];
    const treatmentsList = ["Con", "XR", "TF", "PF", "RCT", "XLA", "SXLA"];
    const startHour = "07:00";
    const finishHour = "17:00";

    const controller = {
        getSelectedDate: function() {
        const datePicker = document.querySelector(".appointmentForm .datePicker");
        return datePicker.value;
        },
        resetFormToDefault() {
            document.querySelector(".appointmentForm").reset();
            if (isOnAppointmentsPage) {
                const submitButton = document.querySelector(".button.submitButton");
                submitButton.classList.add("disabled");
            };
        },
        makeUpdateButtonActive() {
            const submitButton = document.querySelector(".button.update");
            submitButton.classList.remove("disabled");
        },
        updateNoshowCheckbox(isNoshowCheckboxChecked) {
            if (isNoshowCheckboxChecked)
                document.querySelector(".noshowCheckbox").checked = true;
        },
        convertTakenTimeSlotsToDateObjects(timeSlotsArray) {
            const dateObjectsArray = [];
            timeSlotsArray.forEach(timeSlot => {
                const hours = timeSlot.split(":")[0];
                const minutes = timeSlot.split(":")[1];
                const date = dayjs().hour(hours).minute(minutes).second(0).toDate();
                dateObjectsArray.push(date);
            });
            return dateObjectsArray;
        }
    }

    const display = {
        removeTimesOutOfWorkingHoursFromDatePicker() {
            const items = document.querySelectorAll(".react-datepicker__time-list-item");
            items.forEach(item => {
                if ((item.innerHTML < startHour) || (item.innerHTML > finishHour))
                    item.style.display = "none";
            });
        },
    }

    useEffect(() => {
        setSelectedAppointment(data.appointment);
        if (data.appointment)
            controller.updateNoshowCheckbox(data.appointment.noshow);
    }, [data.appointment]);
    
    useEffect(() => {
        console.log(data.timeSlots);
        const takenTimeSlotsAsDateObjectsArray = controller.convertTakenTimeSlotsToDateObjects(data.timeSlots);
        setTakenTimeSlotsForTimePicker(takenTimeSlotsAsDateObjectsArray)
    }, [data.timeSlots]);


    return (
        <dialog className="dialog appointmentFormDialog" onClose={ controller.resetFormToDefault } >
            <h3 className="dialogHeader">
                Appointment
            </h3>
            <form className="formForDialogCloseButton" method="dialog">
                <button className="closeButton" onClick={ controller.resetFormToDefault } >
                    <CloseIcon />
                </button>
            </form>
            <form className="appointmentForm" 
                onSubmit = { isOnAppointmentsPage ? 
                    selectedAppointment ? 
                        handleAppointmentUpdate : handleAppointmentSubmit 
                            : null }>
                <div className="infoContainer">
                    <div className="labelAndInputContainer date">
                        <label htmlFor="date">Date:</label>
                        <input
                            className="inputField datePicker" type="date" name="date" id="date" 
                            min={todayForPicker}
                            max={sixMonthsFromTodayForPicker}
                            onChange={() => { 
                                getTakenTimeSlots(controller.getSelectedDate());
                                if (selectedAppointment) controller.makeUpdateButtonActive();
                            }}
                            defaultValue={ selectedAppointment ? dayjs(selectedAppointment.date).format("YYYY-MM-DD") : ""}
                            readOnly = { isInPatientFormDialog ? true : false}
                        />
                    </div>
                    <div className="labelAndInputContainer time">
                        <label htmlFor="time">Time:</label>
                        {/* <input
                            className="inputField" 
                            type="time" 
                            name="time" 
                            id="time" 
                            defaultValue={selectedAppointment ? selectedAppointment.time : ""}
                            list="availableTimesDatalist"
                            onChange={ selectedAppointment ? controller.makeUpdateButtonActive : null}
                            readOnly = { isInPatientFormDialog ? true : false}

                        />
                        { isOnAppointmentsPage ?
                            <datalist id="availableTimesDatalist">
                                <option value="select"></option>
                                {takenTimeSlotsForTimePicker.map((item) => (<option key={item} value={item}></option>))}
                            </datalist> 
                            : null
                        } */}
                        <ReactDatePicker
                            onCalendarOpen={ display.removeTimesOutOfWorkingHoursFromDatePicker }
                            showTimeSelect
                            showTimeSelectOnly
                            excludeTimes={takenTimeSlotsForTimePicker}
                            timeIntervals={ 30 }
                            timeFormat="HH:mm"
                        />
                    </div>
                    <div className="labelAndInputContainer firstName">
                        <label htmlFor="firstName">First Name:</label>
                        <input
                            className="inputField" 
                            type="text" 
                            name="firstName" 
                            id="firstName" 
                            defaultValue={selectedAppointment ? selectedAppointment.firstName : ""}
                            onChange={ selectedAppointment ? controller.makeUpdateButtonActive : null}
                            readOnly = { isInPatientFormDialog ? true : false}

                        />
                    </div>
                    <div className="labelAndInputContainer lastName">
                        <label htmlFor="lastName">Last Name:</label>
                        <input
                            className="inputField" 
                            type="text" 
                            name="lastName" 
                            id="lastName" 
                            defaultValue={selectedAppointment ? selectedAppointment.lastName : ""}
                            onChange={ selectedAppointment ? controller.makeUpdateButtonActive : null}
                            readOnly = { isInPatientFormDialog ? true : false}

                        />
                    </div>
                    <div className="labelAndInputContainer treatment">
                        <label htmlFor="treatment">Treatment:</label>
                        { 
                        isOnAppointmentsPage ? 
                            <select
                                className="inputField" 
                                id="treatment" 
                                name="treatment"
                                onChange={ selectedAppointment ? controller.makeUpdateButtonActive : null}
                            >
                                <option hidden>{selectedAppointment ? selectedAppointment.treatment : ""}</option>
                                { treatmentsList.map((item) => (<option key={ item } value={ item }>{ item }</option>)) }
                            </select> : null
                        }
                        { 
                        isInPatientFormDialog ? 
                            <input
                                className="inputField" 
                                type="text" 
                                name="treatment" 
                                id="treatment" 
                                readOnly = { isInPatientFormDialog ? true : false}
                                defaultValue={ selectedAppointment ? selectedAppointment.treatment : ""}
                            /> : null
                        }

                    </div>
                    <div className="labelAndInputContainer doctor">
                        <label htmlFor="doctor">Doctor:</label>
                        { 
                        isOnAppointmentsPage ? 
                        <select
                            className="inputField"
                            id="doctor" 
                            name="doctor" 
                            onChange={ selectedAppointment ? controller.makeUpdateButtonActive : null}
                            readOnly = { isInPatientFormDialog ? true : false}
                        >
                            <option hidden>{selectedAppointment ? selectedAppointment.doctor : ""}</option>
                            { doctorsList.map((item) => (<option key={ item } value={ item }>{ item }</option>)) }
                        </select> : null 
                        }

                        { 
                        isInPatientFormDialog ? 
                            <input
                                className="inputField" 
                                type="text" 
                                name="doctor" 
                                id="doctor" 
                                readOnly = { isInPatientFormDialog ? true : false}
                                defaultValue={ selectedAppointment ? selectedAppointment.doctor : ""}
                            /> : null
                        }

                    </div>
                    <div className="labelAndInputContainer payment">
                        <label htmlFor="payment">Payment:</label>
                        { 
                        isOnAppointmentsPage ? 
                        <select
                            className="inputField"
                            id="payment" 
                            name="payment"
                            onChange={ selectedAppointment ? controller.makeUpdateButtonActive : null}
                            readOnly = { isInPatientFormDialog ? true : false}

                        >
                            <option hidden>{selectedAppointment ? selectedAppointment.payment : ""}</option>
                            { paymentsList.map((item) => (<option key={ item } value={ item }>{ item }</option>)) }
                        </select> : null
                        }

                        { 
                        isInPatientFormDialog ? 
                            <input
                                className="inputField" 
                                type="text" 
                                name="doctor" 
                                id="doctor" 
                                readOnly = { isInPatientFormDialog ? true : false}
                                defaultValue={ selectedAppointment ? selectedAppointment.doctor : ""}
                            /> : null
                        }
                    </div>
                    <div className="labelAndInputContainer cost">
                        <label htmlFor="cost">Cost:</label>
                        <input
                            className="inputField" 
                            type="number" 
                            name="cost" 
                            id="cost" 
                            defaultValue={ selectedAppointment ? selectedAppointment.cost : ""}
                            onChange={ selectedAppointment ? controller.makeUpdateButtonActive : null}
                            readOnly = { isInPatientFormDialog ? true : false}

                        />
                    </div>
                    <div className="labelAndInputContainer patientFile">
                        <label htmlFor="patientFile">Patient File:</label>
                        <input
                            className="inputField" 
                            type="text" 
                            name="patientFile" 
                            id="patientFile" 
                            defaultValue={selectedAppointment ? selectedAppointment.patientFile : ""}
                            onChange={ selectedAppointment ? controller.makeUpdateButtonActive : null}
                            readOnly = { isInPatientFormDialog ? true : false}

                        />
                    </div>
                    <div className="labelAndInputContainer phone">
                        <label htmlFor="phone">Phone:</label>
                        <input
                            className="inputField" 
                            type="tel" 
                            name="phone" 
                            id="phone" 
                            defaultValue={selectedAppointment ? selectedAppointment.phone : ""}
                            onChange={ selectedAppointment ? controller.makeUpdateButtonActive : null}
                            readOnly = { isInPatientFormDialog ? true : false}

                        />
                    </div>
                    <div className="labelAndInputContainer commentsContainer">
                        <label htmlFor="comments">Comments:</label>
                        <textarea 
                            className="commentsTextarea"
                            name="comments" 
                            id="comments" 
                            rows="1"
                            cols="30"
                            defaultValue={selectedAppointment ? selectedAppointment.comments : ""}
                            onChange={ selectedAppointment ? controller.makeUpdateButtonActive : null}
                            readOnly = { isInPatientFormDialog ? true : false}

                        >
                        </textarea>
                    </div>
                </div>
                { isOnAppointmentsPage ? 
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
                                className="inputField" 
                                type="checkbox" 
                                // className="noshowCheckbox" 
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
                            { selectedAppointment ? 
                                <><AutorenewOutlinedIcon />Update Appointment</> :
                                <><AddOutlinedIcon />Add New Appointment</>
                            }
                        </button>
                    </div> 
                    : null
                }
            </form>
        </dialog>

    );
}