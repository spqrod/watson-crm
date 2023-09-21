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
    const [ noshow, setNoshow ] = useState(false);
    const [ takenTimeSlotsForTimePicker, setTakenTimeSlotsForTimePicker ] = useState([data.timeSlots]);
    const [ selectedTime, setSelectedTime ] = useState();
    const [ doctors, setDoctors ] = useState([]); 
    const [ treatments, setTreatments ] = useState([]); 
    const [ payments, setPayments ] = useState([]); 
    const todayForPicker = dayjs().format("YYYY-MM-DD");
    const sixMonthsFromTodayForPicker = dayjs().add(6, "month").format("YYYY-MM-DD");
    const { 
        getTakenTimeSlots, 
        handleAppointmentSubmit, 
        handleAppointmentUpdate, 
        handleAppointmentDelete,
        isInPatientFormDialog,
        isOnAppointmentsPage,
        isNewAppointment,
    } = data;
    const startHour = "07:00";
    const finishHour = "17:00";

    const api = {
        getDoctors() {
            const fetchURL = "/doctors";
            return fetch(fetchURL).then(res => res.json());
        },
        getTreatments() {
            const fetchURL = "/treatments";
            return fetch(fetchURL).then(res => res.json());
        },
        getPayments() {
            const fetchURL = "/payments";
            return fetch(fetchURL).then(res => res.json());
        },
    };

    const controller = {
        getSelectedDate: function() {
        const datePicker = document.querySelector(".appointmentForm .datePicker");
        return datePicker.value;
        },
        resetAppointmentFormToDefault() {
            document.querySelector(".appointmentForm").reset();
            setSelectedTime();
            if (isOnAppointmentsPage) {
                const submitButton = document.querySelector(".button.submitButton");
                submitButton.classList.add("disabled");
            };
        },
        makeSubmitButtonActive() {
            const submitButton = document.querySelector(".button.submitButton");
            submitButton.classList.remove("disabled");
        },
        updateNoshowCheckbox(isNoshowCheckboxChecked) {
            if (isNoshowCheckboxChecked)
                document.querySelector(".noshowCheckbox").checked = true;
        },
        convertTakenTimeSlotsToDateObjects(timeSlotsArray) {
            if (timeSlotsArray) {
                const dateObjectsArray = [];
                timeSlotsArray.forEach(timeSlot => 
                    dateObjectsArray.push(controller.convertTimeSlotToDateObject(timeSlot)));
                return dateObjectsArray;
            }
        },
        convertTimeSlotToDateObject(timeSlot) {
            const hours = timeSlot.split(":")[0];
            const minutes = timeSlot.split(":")[1];
            const date = dayjs().hour(hours).minute(minutes).second(0).toDate();
            return date;
        },
        getDoctors() {
            api.getDoctors()
                .then(res => setDoctors(res));
        },
        getTreatments() {
            api.getTreatments()
                .then(res => setTreatments(res));
        },
        getPayments() {
            api.getPayments()
                .then(res => setPayments(res));
        },
    };

    const display = {
        removeTimesOutOfWorkingHoursFromDatePicker() {
            const items = document.querySelectorAll(".react-datepicker__time-list-item");
            items.forEach(item => {
                if ((item.innerHTML < startHour) || (item.innerHTML > finishHour))
                    item.style.display = "none";
            });
        },
    };

    useEffect(() => {
        controller.getDoctors();
        controller.getTreatments();
        controller.getPayments();
    }, []);

    useEffect(() => {
        setSelectedAppointment(data.appointment);
        if (data.appointment) {
            if (isOnAppointmentsPage)
                controller.updateNoshowCheckbox(data.appointment.noshow);
            else if (isInPatientFormDialog)
                setNoshow(data.appointment.noshow);
            if (data.appointment.time)
                setSelectedTime(controller.convertTimeSlotToDateObject(data.appointment.time));
        } else 
            setSelectedTime();
    }, [data.appointment]);
    
    useEffect(() => {
        const takenTimeSlotsAsDateObjectsArray = controller.convertTakenTimeSlotsToDateObjects(data.timeSlots);
        setTakenTimeSlotsForTimePicker(takenTimeSlotsAsDateObjectsArray);
    }, [data.timeSlots]);

    return (
        <dialog className="dialog appointmentFormDialog"  onClose={ controller.resetAppointmentFormToDefault }>
            <h3 className="dialogHeader">
                { isNewAppointment ? "New Appointment" : "Appointment" }
            </h3>
            <form className="formForDialogCloseButton" method="dialog">
                <button className="closeButton"  >
                    <CloseIcon />
                </button>
            </form>
            <form className={`appointmentForm ${ isInPatientFormDialog ? "inPatientDialogForm" : null }`}
                 onSubmit = { 
                    isOnAppointmentsPage ? 
                        isNewAppointment ? 
                            handleAppointmentSubmit : handleAppointmentUpdate
                            : null }> 
                <div className="infoContainer">
                    <div className="labelAndInputContainer date">
                        <label htmlFor="date">Date:</label>
                        <input
                            className="inputField datePicker" type="date" name="date" id="date" 
                            min={todayForPicker}
                            max={sixMonthsFromTodayForPicker}
                            onInput={(e) => { 
                                getTakenTimeSlots(e.target.value);
                                if (selectedAppointment) controller.makeSubmitButtonActive();
                            }}
                            defaultValue={ selectedAppointment ? dayjs(selectedAppointment.date).format("YYYY-MM-DD") : "yyyy-mm-dd" }
                            readOnly = { isInPatientFormDialog ? true : false}
                        />
                    </div>
                    <div className="labelAndInputContainer time">
                        <label htmlFor="time">Time:</label>
                        <ReactDatePicker
                            onCalendarOpen={ display.removeTimesOutOfWorkingHoursFromDatePicker }
                            selected={ selectedTime }
                            onChange={ time => { 
                                setSelectedTime(time);
                                controller.makeSubmitButtonActive();
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            excludeTimes={ takenTimeSlotsForTimePicker }
                            timeIntervals={ 30 }
                            dateFormat="HH:mm"
                            timeFormat="HH:mm"
                            readOnly = { isInPatientFormDialog ? true : false }
                        />
                        <input type="text" name="time" id="time" className="timeHiddenInputField" value={ dayjs(selectedTime).format("HH:mm") }/>
                    </div>
                    <div className="labelAndInputContainer firstName">
                        <label htmlFor="firstName">First Name:</label>
                        <input
                            className="inputField" 
                            type="text" 
                            name="firstName" 
                            id="firstName" 
                            defaultValue={selectedAppointment ? selectedAppointment.firstName : ""}
                            onChange = { controller.makeSubmitButtonActive }
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
                            onChange = { controller.makeSubmitButtonActive }
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
                                onChange = { controller.makeSubmitButtonActive }
                            >
                                <option hidden>{selectedAppointment ? selectedAppointment.treatment : ""}</option>
                                { treatments.map((item) => (<option key={ item } value={ item }>{ item }</option>)) }
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
                            onChange = { controller.makeSubmitButtonActive }
                            readOnly = { isInPatientFormDialog ? true : false}
                        >
                            <option hidden>{selectedAppointment ? selectedAppointment.doctor : ""}</option>
                            { doctors.map((item) => (<option key={ item } value={ item }>{ item }</option>)) }
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
                            onChange = { controller.makeSubmitButtonActive }
                            readOnly = { isInPatientFormDialog ? true : false}

                        >
                            <option hidden>{selectedAppointment ? selectedAppointment.payment : ""}</option>
                            { payments.map((item) => (<option key={ item } value={ item }>{ item }</option>)) }
                        </select> : null
                        }

                        { 
                        isInPatientFormDialog ? 
                            <input
                                className="inputField" 
                                type="text" 
                                name="payment" 
                                id="payment" 
                                readOnly = { isInPatientFormDialog ? true : false}
                                defaultValue={ selectedAppointment ? selectedAppointment.payment : ""}
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
                            onChange = { controller.makeSubmitButtonActive }
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
                            onChange = { controller.makeSubmitButtonActive }
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
                            autoComplete="tel"
                            defaultValue={selectedAppointment ? selectedAppointment.phone : ""}
                            onChange = { controller.makeSubmitButtonActive }
                            readOnly = { isInPatientFormDialog ? true : false}

                        />
                    </div>
                    <div className="labelAndInputContainer commentsContainer">
                        <label htmlFor="comments">Comments:</label>
                        <textarea 
                            className="commentsTextarea inputField"
                            name="comments" 
                            id="comments" 
                            rows="1"
                            cols="30"
                            defaultValue={selectedAppointment ? selectedAppointment.comments : ""}
                            onChange = { controller.makeSubmitButtonActive }
                            readOnly = { isInPatientFormDialog ? true : false}

                        >
                        </textarea>
                    </div>
                </div>

                { isInPatientFormDialog ? noshow ? 
                    <div className="labelAndInputContainer commentsContainer">
                        <p>The patient did not come for the appointment (No-show)</p>
                    </div>
                : null : null }

                { isOnAppointmentsPage ? 
                    <div className="buttonsContainer">
                        { isNewAppointment ? null :
                            <button 
                                className={`button deleteButton ${ selectedAppointment ? null : "disabled"}`} 
                                type="button" 
                                onClick={ handleAppointmentDelete }
                            >
                                <DeleteOutlineOutlinedIcon />
                                Delete
                            </button>
                        }
                        { isNewAppointment ? null :
                            <div className={`button noShowButton ${ selectedAppointment ? null : "disabled"}`}> 
                                <input
                                    className="inputField noshowCheckbox" 
                                    type="checkbox" 
                                    name="nowshow" 
                                    id="noshow" 
                                    onClick ={ controller.makeSubmitButtonActive }
                                /> 
                                <label htmlFor="noshow">No-show</label>
                            </div>
                        }
                        <button 
                            className={`button submitButton disabled`} 
                            type="submit"
                        >
                            { isNewAppointment ? 
                                <><AddOutlinedIcon />Add New Appointment</> :
                                <><AutorenewOutlinedIcon />Update Appointment</>
                            }
                        </button>
                    </div> 
                    : null
                }
            </form>
        </dialog>

    );
}