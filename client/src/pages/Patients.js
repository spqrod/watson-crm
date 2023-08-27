import "../styles/patients.css";
import PatientList from "../components/PatientList";
import PatientFormForDialog from "../components/PatientFormDialog";
import { useState, useEffect } from "react";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

import dayjs from "dayjs";

export default function Patients() {

    const [ patientsArray, setPatientsArray ] = useState();
    const [ selectedPatient, setSelectedPatient ] = useState();
    const [ dialogMode, setDialogMode ] = useState();

    const dateFormatForDB = "YYYY-MM-DD";

    const api = {
        getPatients: function(searchString) {
            const fetchURL = `/patients/${searchString}`;
            return fetch(fetchURL).then(res => res.json());
        },
        // getAvailableTimeSlots(date) {
        //     const fetchURL = `/taken-time-slots/${date}`;
        //     return fetch(fetchURL).then(res => res.json());
        // },
        // addNewPatient(patient) {
        //     const fetchURL = `/patients/`;
        //     const fetchBody = {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json"
        //         },
        //         body: JSON.stringify(patient)
        //     }
        //     return fetch(fetchURL, fetchBody).then(res => res.json());
        // },
        // updatePatient(patient) {
        //     const fetchURL = `/patients/`;
        //     const fetchBody = {
        //         method: "PUT",
        //         headers: {
        //             "Content-Type": "application/json"
        //         },
        //         body: JSON.stringify(patient)
        //     }
        //     return fetch(fetchURL, fetchBody).then(res => res.json());
        // },
        // deletePatient(id) {
        //     const fetchURL = `/patients/${id}`;
        //     const fetchOptions = {
        //         method: "DELETE"
        //     }
        //     return fetch(fetchURL, fetchOptions).then(res => res.json());
        // }
    };

    const controller = {
        handleAddNew: function() {
            setDialogMode("addNew");
            display.showDialog();
        },
        handleSearchSubmit(e) {
            e.preventDefault();
            const searchString = e.target.search.value;
            api.getPatients(searchString).then(res => {
                console.log(res);
                setPatientsArray(res);
            });
        },
        handlePatientClick: function(e) {
            // const patientID = e.currentTarget.id;
            // const patient = controller.getPatient(patientID);
            // setSelectedPatient(patient);
            // controller.getAvailableTimeSlots(patient.date);
            display.showDialog();
        },
    // getPatient: function(id) {
    //     // const patient = patientsArray.find(item => item.id == id);
    //     // return patient;
    // },
    // getPatientData: function() {

    // },
    //     handleTodayClick: function() {
    //         const selectedDate = dayjs().format(dateFormatForDB);
    //         controller.getPatients(selectedDate);
    //         controller.handleDateSelect("today");
    // //     },
    // //     handleTomorrowClick: function() {
    // //         const selectedDate = dayjs().add(1, "day").format(dateFormatForDB);
    // //         controller.getPatients(selectedDate);
    // //         controller.handleDateSelect("tomorrow");
    // //     },
    // //     handleDatePickerClick: function() {
    // //         const datePicker = document.querySelector(".datePickerContainer .datePicker.input");
    // //         datePicker.showPicker();
    // //     },
    // //     handleDateSelectInDatePicker: function() {
    // //         const datePicker = document.querySelector(".datePickerContainer .datePicker.input");
    // //         const selectedDate = dayjs(datePicker.value, "YYYY-MM-DD").format(dateFormatForDB);
    // //         setDatePickerDate(dayjs(datePicker.value, "YYYY-MM-DD").format(dateFormatForHeader));
    // //         controller.handleDateSelect("datePicker");
    // //         controller.getPatients(selectedDate);
    // //     },
    // //     handleDateSelect: function(dateAsString) {
    // //         display.showFullDate(dateAsString);
    // //         display.highlightDateContainer(dateAsString);
    // //         display.highlightHeaderRowContainer();
    // //         display.highlightPatientListContainer();
    // //     },

    // //     getAvailableTimeSlots: function(date) {
    // //         api.getAvailableTimeSlots(date).then(res => setAvailableTimesSlotsForTimePicker(res));
    // //     },
    // //     handlePatientSubmit: function (e) {
    // //         e.preventDefault();
    // //         const patient = { 
    // //             date: e.target.date.value, 
    // //             time: e.target.time.value,
    // //             firstName: e.target.firstName.value,
    // //             lastName: e.target.lastName.value,
    // //             doctor: e.target.doctor.value,
    // //             treatment: e.target.treatment.value,
    // //             payment: e.target.payment.value,
    // //             cost: e.target.cost.value,
    // //             phone: e.target.phone.value,
    // //             file: e.target.file.value,
    // //             comments: e.target.comments.value,
    // //         }
    // //         api.addNewPatient(patient).then(res => {
    // //             display.closeDialog();
    // //             document.querySelector(".patientForm").reset();
    // //             const selectedDate = dayjs(patient.date).format(dateFormatForDB);
    // //             controller.getPatients(selectedDate);
    // //         });
    // //     },
    // //     handlePatientUpdate: function (e) {
    // //         e.preventDefault();
    // //         const patient = { 
    // //             id: selectedPatient.id,
    // //             date: e.target.date.value, 
    // //             time: e.target.time.value,
    // //             firstName: e.target.firstName.value,
    // //             lastName: e.target.lastName.value,
    // //             doctor: e.target.doctor.value,
    // //             treatment: e.target.treatment.value,
    // //             payment: e.target.payment.value,
    // //             cost: e.target.cost.value,
    // //             phone: e.target.phone.value,
    // //             file: e.target.file.value,
    // //             comments: e.target.comments.value,
    // //             noshow: e.target.noshow.checked,
    // //         };
    // //         api.updatePatient(patient).then(res => {
    // //             display.closeDialog();
    // //             document.querySelector(".patientForm").reset();
    // //             const selectedDate = dayjs(patient.date).format(dateFormatForDB);
    // //             controller.getPatients(selectedDate);
    // //         });
    // //     },
    // //     handlePatientDelete: function(e) {
    // //         e.preventDefault();
    // //         api.deletePatient(selectedPatient.id).then(() => {
    // //             display.closeDialog();
    // //             document.querySelector(".patientForm").reset();
    // //             controller.getPatients(selectedPatient.date);
    // //         });
    // //     }

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
    //     showFullDate(dateAsString) {
    //         const previousActiveDate = document.querySelector(".fullDate.active");
    //         if (previousActiveDate)
    //             previousActiveDate.classList.remove("active");
    //         const fullDate = document.querySelector(`.fullDate.${dateAsString}`);
    //         fullDate.classList.add("active");
    //     },
    //     highlightDateContainer(dateAsString) {
    //         const previousActiveContainer = document.querySelector("div.active");
    //         if (previousActiveContainer)
    //             previousActiveContainer.classList.remove("active");
    //         const dateContainer = document.querySelector(`.${dateAsString}Container`);
    //         dateContainer.classList.add("active");
    //     },
    //     highlightHeaderRowContainer() {
    //         const headerRow = document.querySelector(".headerRowContainer");
    //         headerRow.classList.add("active");
    //     },
    //     highlightPatientListContainer() {
    //         const patientListContainer = document.querySelector(".patientListContainer");
    //         patientListContainer.classList.add("active");
    //     }
    };

    return (
        <section className="patientsPage section">
            <div className="contentContainer">
                <div className="header">
                    <div className="addNewContainer" onClick={ controller.handleAddNew }>
                        <AddOutlinedIcon />New Patient
                    </div>
                <form className="searchContainer" onSubmit = { controller.handleSearchSubmit }>
                    <label htmlFor="search" className="searchLabel">
                        <SearchOutlinedIcon /><span>Search</span>
                    </label>
                    <input type="text" name="search" id="search"/>
                </form>
                </div>
                <div className="headerRowContainer">
                    <p>First Name</p>
                    <p>Last Name</p>
                    <p>File</p>
                    <p>NRC</p>
                    <p>Phone</p>
                    <p>Date of Birth</p>
                    <p>Date Added</p>
                </div>
                <PatientList 
                    patientsArray = { patientsArray } 
                    handlePatientClick = { controller.handlePatientClick } 
                />
            </div>
            <PatientFormForDialog 
                dialogMode = { dialogMode }
                // patient={ selectedPatient } 
                handlePatientSearch = { controller.handlePatientSearch }
                // handlePatientSubmit = { controller.handlePatientSubmit }
                // handlePatientUpdate = { controller.handlePatientUpdate }
                // handlePatientDelete = { controller.handlePatientDelete }
            />
        </section>
    );
}