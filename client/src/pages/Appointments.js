import "../styles/appointments.css";
import AppointmentList from "../components/AppointmentList";
import AppointmentFormForDialog from "../components/AppointmentFormDialog";
import { useState, useEffect } from "react";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LoadingScreen, { showLoadingScreen, hideLoadingScreen }  from "../components/LoadingScreen.js";

import dayjs from "dayjs";

export default function Appointments() {

    const [ appointmentsArray, setAppointmentsArray ] = useState();
    const [ selectedAppointment, setSelectedAppointment ] = useState();
    const [ takenTimeSlotsForTimePicker, setTakenTimeSlotsForTimePicker ] = useState([]);
    const [ isNewAppointment, setIsNewAppointment ] = useState(false);


    const dateFormatForDB = "YYYY-MM-DD";
    const dateFormatForHeader = "dddd, DD.MM.YYYY";
    const todayDate = dayjs().format(dateFormatForHeader);
    const tomorrowDate = dayjs().add(1, "day").format(dateFormatForHeader);
    const [ datePickerDate, setDatePickerDate ] = useState(todayDate);
    const sixMonthsFromTodayForPicker = dayjs().add(6, "month").format("YYYY-MM-DD");

    const api = {
        getAppointments: function(date) {
            const fetchURL = `/appointments?date=${date}`;
            return fetch(fetchURL).then(res => res.json());
        },
        getTakenTimeSlots(date) {
            const fetchURL = `/taken-time-slots/${date}`;
            return fetch(fetchURL).then(res => res.json());
        },
        addNewAppointment(appointment) {
            const fetchURL = `/appointments/`;
            const fetchBody = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(appointment)
            }
            return fetch(fetchURL, fetchBody).then(res => res.json());
        },
        updateAppointment(appointment) {
            const fetchURL = `/appointments/`;
            const fetchBody = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(appointment)
            }
            return fetch(fetchURL, fetchBody).then(res => res.json());
        },
        deleteAppointment(id) {
            const fetchURL = `/appointments/${id}`;
            const fetchOptions = {
                method: "DELETE"
            }
            return fetch(fetchURL, fetchOptions).then(res => res.json());
        },
        searchAppointments: function(searchString) {
            const fetchURL = `/appointments?searchString=${searchString}`;
            return fetch(fetchURL).then(res => res.json());
        },
    };

    const controller = {
        getAppointments: function(selectedDate) {
            showLoadingScreen();
            return api.getAppointments(selectedDate)
                .then(appointments => {
                    appointments.forEach(item => item.date = dayjs(item.date).format(dateFormatForDB));
                    setAppointmentsArray(appointments);
                    hideLoadingScreen();
            });
        },
        handleAppointmentClick: function(e) {
            const isEmptyAppointment = e.currentTarget.classList.contains("emptyTimeSlot");
            const appointmentID = e.currentTarget.id;
            const appointment = controller.getAppointment(appointmentID);
            setSelectedAppointment(appointment);
            showLoadingScreen();
            controller.getTakenTimeSlots(appointment.date)
                .then(() => {
                    hideLoadingScreen();
                    if (isEmptyAppointment)
                        setIsNewAppointment(true)
                    else 
                        setIsNewAppointment(false)
                    display.showDialog();
                });
        },
        getAppointment: function(id) {
            const appointment = appointmentsArray.find(item => item.id == id);
            return appointment;
        },
        handleTodayClick: function() {
            const selectedDate = dayjs().format(dateFormatForDB);
            controller.getAppointments(selectedDate);
            controller.handleDateSelect("today");
        },
        handleTomorrowClick: function() {
            const selectedDate = dayjs().add(1, "day").format(dateFormatForDB);
            controller.getAppointments(selectedDate);
            controller.handleDateSelect("tomorrow");
        },
        handleDatePickerClick: function() {
            const datePicker = document.querySelector(".datePickerContainer .datePicker.inputField");
            datePicker.showPicker();
        },
        handleDateSelectInDatePicker: function() {
            const datePicker = document.querySelector(".datePickerContainer .datePicker.inputField");
            const selectedDate = dayjs(datePicker.value, "YYYY-MM-DD").format(dateFormatForDB);
            controller.getAppointments(selectedDate);
            setDatePickerDate(dayjs(datePicker.value, "YYYY-MM-DD").format(dateFormatForHeader));
            controller.handleDateSelect("datePicker");
        },
        handleDateSelect: function(dateAsString) {
            display.hidePreviousFullDate();
            display.showFullDate(dateAsString);
            display.highlightDateContainer(dateAsString);
            display.highlightHeaderRowContainer();
            display.highlightAppointmentListContainer();
            display.removeHighlightFromSearchContainer();
            display.resetSearchInput();
        },
        handleAddNewAppointment: function(isNeededToPreFillAppointmentFields) {
            setIsNewAppointment(true);
            if (!isNeededToPreFillAppointmentFields)
                setSelectedAppointment();
            display.showDialog();
        },
        getTakenTimeSlots: function(date) {
            showLoadingScreen();
            return api.getTakenTimeSlots(date).then(res => {
                setTakenTimeSlotsForTimePicker(res);
                hideLoadingScreen();
            });
        },
        handleAppointmentSubmit: function (e) {
            e.preventDefault();
            const appointment = { 
                date: e.target.date.value, 
                time: e.target.time.value,
                firstName: e.target.firstName.value,
                lastName: e.target.lastName.value,
                doctor: e.target.doctor.value,
                treatment: e.target.treatment.value,
                payment: e.target.payment.value,
                cost: e.target.cost.value,
                phone: e.target.phone.value,
                patientFile: e.target.patientFile.value,
                comments: e.target.comments.value,
            }
            showLoadingScreen();
            api.addNewAppointment(appointment).then(res => {
                display.closeDialog();
                document.querySelector(".appointmentForm").reset();
                const selectedDate = dayjs(appointment.date).format(dateFormatForDB);
                controller.getAppointments(selectedDate);
                hideLoadingScreen();
            });
        },
        handleAppointmentUpdate: function (e) {
            e.preventDefault();
            const appointment = { 
                id: selectedAppointment.id,
                date: e.target.date.value, 
                time: e.target.time.value,
                firstName: e.target.firstName.value,
                lastName: e.target.lastName.value,
                doctor: e.target.doctor.value,
                treatment: e.target.treatment.value,
                payment: e.target.payment.value,
                cost: e.target.cost.value,
                phone: e.target.phone.value,
                patientFile: e.target.patientFile.value,
                comments: e.target.comments.value,
                noshow: e.target.noshow.checked,
            };
            showLoadingScreen();
            api.updateAppointment(appointment).then(res => {
                display.closeDialog();
                document.querySelector(".appointmentForm").reset();
                const selectedDate = dayjs(appointment.date).format(dateFormatForDB);
                controller.getAppointments(selectedDate);
                hideLoadingScreen();
            });
        },
        handleAppointmentDelete: function(e) {
            e.preventDefault();
            showLoadingScreen();
            api.deleteAppointment(selectedAppointment.id).then(() => {
                display.closeDialog();
                document.querySelector(".appointmentForm").reset();
                controller.getAppointments(selectedAppointment.date);
                hideLoadingScreen();
            });
        },
        handleSearchSubmit(e) {
            e.preventDefault();
            display.highlightSearchContainer();
            display.highlightHeaderRowContainer();
            display.highlightAppointmentListContainer();
            display.removeHighlightFromDateContainer();
            display.hidePreviousFullDate();
            const searchString = e.target.search.value;
            showLoadingScreen();
            api.searchAppointments(searchString).then(res => {
                setAppointmentsArray(res);
                hideLoadingScreen();
            });
        },
        isThisNewAppointmentBeingCreatedFromPatientPage() {
            return localStorage.getItem("isNewAppointmentFromPatientPage");
        },
        populateNewAppointmentFormWithPatientData() {
            const isNeededToPreFillAppointmentFields = true;
            const patient = controller.getPatientFromLocalStorage();
            const appointment = controller.createAppointmentFromPatientData(patient);
            setSelectedAppointment(appointment);
            controller.handleAddNewAppointment(isNeededToPreFillAppointmentFields);
        },
        getPatientFromLocalStorage() {
            const patient = {};
            for (let i = 0; i < localStorage.length; i++ ) {
                const key = localStorage.key(i);
                const value = localStorage.getItem(key);
                patient[key] = value;
            }
            localStorage.clear();
            return patient;
        },
        createAppointmentFromPatientData(patient) {
            const appointment = {};
            appointment.firstName = patient.firstName;
            appointment.lastName = patient.lastName;
            appointment.patientFile = patient.file;
            appointment.phone = patient.phone;
            return appointment;
        },
        handleAddAnotherAppointment() {
            const isNeededToPreFillAppointmentFields = true;
            const appointment = {...selectedAppointment};
            appointment.date = null;
            appointment.time = null;
            appointment.doctor = null;
            appointment.treatment = null;
            appointment.cost = null;
            setSelectedAppointment(appointment);
            controller.handleAddNewAppointment(isNeededToPreFillAppointmentFields);
        }
    };

    const display = {
        showDialog: function() {
            const dialog = document.querySelector(".dialog");
            dialog.showModal();
        },
        closeDialog: function() {
            const dialog = document.querySelector(".dialog");
            dialog.close();
        },
        hidePreviousFullDate() {
            const previousActiveDate = document.querySelector(".fullDate.active");
            if (previousActiveDate)
                previousActiveDate.classList.remove("active");
        },
        showFullDate(dateAsString) {
            const fullDate = document.querySelector(`.fullDate.${dateAsString}`);
            fullDate.classList.add("active");
        },
        highlightDateContainer(dateAsString) {
            const previousActiveContainer = document.querySelector("div.active");
            if (previousActiveContainer)
                previousActiveContainer.classList.remove("active");
            const dateContainer = document.querySelector(`.${dateAsString}Container`);
            dateContainer.classList.add("active");
        },
        highlightHeaderRowContainer() {
            const headerRow = document.querySelector(".headerRowContainer");
            headerRow.classList.add("active");
        },
        highlightAppointmentListContainer() {
            const appointmentListContainer = document.querySelector(".appointmentListContainer");
            appointmentListContainer.classList.add("active");
        },
        highlightSearchContainer() {
            const searchContainer = document.querySelector(".searchContainer");
            searchContainer.classList.add("active");
        },
        removeHighlightFromDateContainer() {
            if (document.querySelector(`.dateContainer .active`)) {
                const activeDateContainer = document.querySelector(`.dateContainer .active`);
                activeDateContainer.classList.remove("active");
            }
        },
        removeHighlightFromSearchContainer() {
            const searchContainer = document.querySelector(".searchContainer");
            searchContainer.classList.remove("active");
        },
        resetSearchInput() {
            const searchInput = document.querySelector(".searchInput");
            searchInput.value = "";
        }
    };

    useEffect(() => {
        if (controller.isThisNewAppointmentBeingCreatedFromPatientPage())
            controller.populateNewAppointmentFormWithPatientData();
        else 
            controller.handleTodayClick();
    }, []);

    return (
        <section className="appointmentsPage section">
            <div className="contentContainer">
                <div className="header">
                    <div className="dateContainer">
                        <div className="todayContainer" onClick={controller.handleTodayClick}>
                            <p className="shortDate">Today</p>
                            <p className="fullDate today">{ todayDate }</p>
                        </div>
                        <div className="tomorrowContainer" onClick={controller.handleTomorrowClick}>
                            <p>Tomorrow</p>
                            <p className="fullDate tomorrow">{ tomorrowDate }</p>
                        </div>
                        <div className="datePickerContainer" onClick={controller.handleDatePickerClick}>
                            <label htmlFor="datePicker" className="datePickerLabel" >
                                <CalendarMonthOutlinedIcon />
                                <input 
                                    className="datePicker inputField" 
                                    type="date" 
                                    id="datePicker" 
                                    name="datePicker" 
                                    max={ sixMonthsFromTodayForPicker } 
                                    onChange={controller.handleDateSelectInDatePicker}/>
                            </label>
                            <p className="fullDate datePicker">{ datePickerDate }</p>
                        </div>
                    </div>
                    <div className="addNewContainer" onClick={ () => controller.handleAddNewAppointment(false) }>
                        <AddOutlinedIcon />New Appointment
                    </div>
                    <form className="searchContainer" onSubmit = { controller.handleSearchSubmit }>
                        <label htmlFor="search" className="searchLabel">
                            <SearchOutlinedIcon /><span>Search</span>
                        </label>
                        <input type="text" name="search" id="search" className="searchInput inputField"/>
                    </form>
                </div>

                <div className="headerRowContainer">
                    <p>Date</p>
                    <p>Time</p>
                    <p>First Name</p>
                    <p>Last Name</p>
                    <p>Doctor</p>
                    <p>Treatment</p>
                    <p>Payment</p>
                    <p>Cost</p>
                </div>
                <AppointmentList 
                    appointmentsArray = { appointmentsArray } 
                    handleAppointmentClick = { controller.handleAppointmentClick } 
                    isOnAppointmentsPage = { true }
                />
            </div>
            <AppointmentFormForDialog 
                appointment={ selectedAppointment } 
                getTakenTimeSlots={ controller.getTakenTimeSlots } 
                timeSlots={ takenTimeSlotsForTimePicker } 
                isOnAppointmentsPage = { true }
                isNewAppointment = { isNewAppointment }
                handleAppointmentSubmit = { controller.handleAppointmentSubmit }
                handleAppointmentUpdate = { controller.handleAppointmentUpdate }
                handleAppointmentDelete = { controller.handleAppointmentDelete }
                handleAddAnotherAppointment = { controller.handleAddAnotherAppointment }
            />
            <LoadingScreen />
        </section>
    );
}