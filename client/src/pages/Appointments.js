import "../styles/appointments.css";
import AppointmentList from "../components/AppointmentList";
import AppointmentFormForDialog from "../components/AppointmentFormForDialog";
import { useState, useEffect } from "react";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';

export default function Appointments() {

    // const [ selectedDate, setSelectedDate ] = useState(dayjs().format("DD-MM-YYYY"));
    const [ appointmentsArray, setAppointmentsArray ] = useState();
    const [ selectedAppointment, setSelectedAppointment ] = useState();
    const [ availableTimesSlotsForTimePicker, setAvailableTimesSlotsForTimePicker ] = useState([]);

    const dateFormatForDB = "YYYY-MM-DD";
    const dateFormatForHeader = "dddd, DD.MM.YYYY";
    const todayDate = dayjs().format(dateFormatForHeader);
    const tomorrowDate = dayjs().add(1, "day").format(dateFormatForHeader);
    const todayForPicker = dayjs().format("YYYY-MM-DD");
    const sixMonthsFromTodayForPicker = dayjs().add(6, "month").format("YYYY-MM-DD");

    const api = {
        getAppointments: function(data) {
            const fetchURL = `/appointments/${data}`;
            return fetch(fetchURL).then(res => res.json());
        },
        getAvailableTimeSlots(date) {
            const fetchURL = `/time-slots/${date}`;
            return fetch(fetchURL).then(res => res.json());
        }
    };

    const controller = {
        getAppointments: function(selectedDate) {
            api.getAppointments(selectedDate).then(res => {
                res.forEach(item => item.date = dayjs(item.date).format(dateFormatForDB));
                setAppointmentsArray(res);
            });
        },
        handleAppointmentClick: function(e) {
            const appointmentID = e.currentTarget.id;
            const appointment = controller.getAppointment(appointmentID);
            console.log(appointment);
            setSelectedAppointment(appointment);
            display.showDialog();
        },
        getAppointment: function(id) {
            const appointment = appointmentsArray.find(item => item.id == id);
            return appointment;
        },
        getPatientData: function() {

        },
        handleTodayClick: function() {
            const selectedDate = dayjs().format(dateFormatForDB);
            controller.getAppointments(selectedDate);
        },
        handleTomorrowClick: function() {
            const selectedDate = dayjs().add(1, "day").format(dateFormatForDB);
            controller.getAppointments(selectedDate);
        },
        handleDatePickerClick: function() {
            const datePicker = document.querySelector(".datePicker");
            datePicker.showPicker();
        },
        handleDateSelect: function() {
            const datePicker = document.querySelector(".datePicker");
            const selectedDate = dayjs(datePicker.value, "YYYY-MM-DD").format(dateFormatForDB);
            controller.getAppointments(selectedDate);
        },
        handleAddNew: function() {
            setSelectedAppointment();
            display.showDialog();
        },
        getAvailableTimeSlots: function(date) {
            api.getAvailableTimeSlots(date).then(res => setAvailableTimesSlotsForTimePicker(res));
        }

    };

    const display = {

        showDialog: function() {
            const dialog = document.querySelector(".dialog");
            dialog.showModal();
        },
    };

    return (
        <section className="appointmentsPage section">
            <div className="contentContainer">
                <div className="dateContainer">
                    <div className="todayContainer" onClick={controller.handleTodayClick}>
                        <p>Today</p>
                        <p>{ todayDate }</p>
                    </div>
                    <div className="tomorrowContainer" onClick={controller.handleTomorrowClick}>
                        <p>Tomorrow</p>
                        <p>{ tomorrowDate }</p>
                    </div>
                    <div className="datePickerContainer">
                        <label htmlFor="datePicker" className="datePickerLabel" onClick={controller.handleDatePickerClick}>
                            <CalendarMonthOutlinedIcon />
                            <input className="datePicker" type="date" id="datePicker" name="datePicker" min={ todayForPicker } max={ sixMonthsFromTodayForPicker } onChange={controller.handleDateSelect}/>
                        </label>
                    </div>
                </div>
                <div className="addNewContainer" onClick={ controller.handleAddNew }>
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
                <AppointmentList appointmentsArray = { appointmentsArray } handleAppointmentClick = { controller.handleAppointmentClick } />
            </div>

            <dialog className="dialog">
                <form className="formForDialogCloseButton" method="dialog">
                    <button className="closeButton" >
                        x
                    </button>
                </form>
                <AppointmentFormForDialog appointment={selectedAppointment} getAvailableTimeSlots={controller.getAvailableTimeSlots} timeSlots={availableTimesSlotsForTimePicker}/>
            </dialog>

        </section>
    );
}