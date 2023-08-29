import "../styles/patients.css";
import PatientList from "../components/PatientList";
import PatientFormForDialog from "../components/PatientFormDialog";
import { useState, useEffect } from "react";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

import dayjs from "dayjs";

export default function Patients() {

    const [ patientsArray, setPatientsArray ] = useState([]);
    const [ appointmentsForArray, setAppointmentsForArray ] = useState([]);
    const [ selectedPatient, setSelectedPatient ] = useState();
    const [ dialogMode, setDialogMode ] = useState();

    const dateFormatForDB = "YYYY-MM-DD";

    const api = {
        getPatients: function(searchString) {
            const fetchURL = `/patients/${searchString}`;
            return fetch(fetchURL).then(res => res.json());
        },
        addNewPatient(patient) {
            const fetchURL = `/patients/`;
            const fetchBody = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(patient)
            }
            return fetch(fetchURL, fetchBody)
                .then(res => res.json());
        },
        updatePatient(patient) {
            const fetchURL = `/patients/`;
            const fetchBody = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(patient)
            }
            return fetch(fetchURL, fetchBody)
                .then(res => res.json());
        },
        deletePatient(id) {
            const fetchURL = `/patients/${id}`;
            const fetchOptions = {
                method: "DELETE"
            }
            return fetch(fetchURL, fetchOptions).then(res => res.json());
        },
        getAppointmentForPatient(patientFile) {
            patientFile = encodeURIComponent(patientFile);
            const fetchURL = `/appointments?patientFile=${patientFile}`;
            return fetch(fetchURL).then(res => res.json());
        }
    };

    const controller = {
        handleAddNewPatient: function() {
            setDialogMode("addNew");
            display.showDialog();
        },
        handleSearchSubmit(e) {
            e.preventDefault();

            display.removeHighlightFromAddNewContainer();
            display.highlightSearchContainer();
            display.highlightHeaderRowContainer();
            display.highlightPatientListContainer();

            const searchString = e.target.search.value;

            api.getPatients(searchString).then(res => setPatientsArray(res));
        },
        getPatient: function(id) {
            const patient = patientsArray.find(item => item.id == id);
            return patient;
        },
        getAppointments(patientFile) {
            api.getAppointmentForPatient(patientFile)
                .then(appointments => {
                    appointments.forEach(item => item.date = dayjs(item.date).format(dateFormatForDB));
                    setAppointmentsForArray(appointments)
                });
        },
        handlePatientClick: function(e) {
            const patientID = e.currentTarget.id;
            const patient = controller.getPatient(patientID);
            setSelectedPatient(patient);
            controller.getAppointments(patient.file);
            setDialogMode("update");
            display.showDialog();
        },
        handlePatientSubmit: function (e) {
            e.preventDefault();
            display.removeHighlightFromSearchContainer();
            display.resetSearchInput();
            display.highlightAddNewContainer();
            display.highlightHeaderRowContainer();
            display.highlightPatientListContainer();
            const patient = { 
                firstName: e.target.firstName.value,
                lastName: e.target.lastName.value,
                file: e.target.file.value ? e.target.file.value : null,
                nrc: e.target.nrc.value ? e.target.nrc.value : null,
                insuranceId: e.target.insuranceId.value ? e.target.insuranceId.value : null,
                phone: e.target.phone.value ? e.target.phone.value : null,
                dateOfBirth: e.target.dateOfBirth.value ? e.target.dateOfBirth.value : null,
                sex: e.target.sex.value ? e.target.sex.value : null,
                marketing: e.target.marketing.value ? e.target.marketing.value : null,
            };
            api.addNewPatient(patient)
                .then(lastAddedPatient => {
                    display.closeDialog();
                    document.querySelector(".patientForm").reset();
                    setPatientsArray([lastAddedPatient]);
            });
        },
        handlePatientUpdate: function (e) {
            e.preventDefault();
            const patient = { 
                id: selectedPatient.id,
                firstName: e.target.firstName.value,
                lastName: e.target.lastName.value,
                file: e.target.file.value,
                nrc: e.target.nrc.value,
                insuranceId: e.target.insuranceId.value,
                phone: e.target.phone.value,
                dateOfBirth: e.target.dateOfBirth.value ? e.target.dateOfBirth.value : null,
                sex: e.target.sex.value,
                marketing: e.target.marketing.value,
            };
            api.updatePatient(patient)
                .then(() => {
                    display.closeDialog();
                    document.querySelector(".patientForm").reset();
                    const searchString = document.querySelector(".searchInput").value;
                    return api.getPatients(searchString);
                })
                .then(res => setPatientsArray(res));
        },
        handlePatientDelete: function(e) {
            e.preventDefault();
            api.deletePatient(selectedPatient.id).then(() => {
                display.closeDialog();
                document.querySelector(".patientForm").reset();
                const searchInput = document.querySelector(".searchInput");

                if (searchInput.value !== "") {
                    api.getPatients(searchInput.value).then(res => setPatientsArray(res));
                } else {
                    display.removeHighlightFromAddNewContainer();
                    display.removeHighlightFromRowContainer();
                    display.removeHighlightFromPatientListContainer();
                    setPatientsArray([]);
                }
            });
        },
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
        highlightAddNewContainer() {
            const searchContainer = document.querySelector(`.addNewContainer`);
            searchContainer.classList.add("active");
        },
        highlightSearchContainer() {
            const searchContainer = document.querySelector(`.searchContainer`);
            searchContainer.classList.add("active");
        },
        highlightHeaderRowContainer() {
            const headerRow = document.querySelector(".headerRowContainer");
            headerRow.classList.add("active");
        },
        highlightPatientListContainer() {
            const patientListContainer = document.querySelector(".patientListContainer");
            patientListContainer.classList.add("active");
        },
        removeHighlightFromSearchContainer() {
            const searchContainer = document.querySelector(`.searchContainer`);
            searchContainer.classList.remove("active");
        },
        removeHighlightFromRowContainer() {
            const rowContainer = document.querySelector(`.headerRowContainer`);
            rowContainer.classList.remove("active");
        },
        removeHighlightFromPatientListContainer() {
            const patientListContainer = document.querySelector(`.patientListContainer`);
            patientListContainer.classList.remove("active");
        },
        removeHighlightFromAddNewContainer() {
            const addNewContainer = document.querySelector(`.addNewContainer`);
            addNewContainer.classList.remove("active");
        },
        resetSearchInput() {
            const searchInput = document.querySelector(".searchInput");
            searchInput.value = "";
        }
    };

    return (
        <section className="patientsPage section">
            <div className="contentContainer">
                <div className="header">
                    <div className="addNewContainer" onClick={ controller.handleAddNewPatient }>
                        <AddOutlinedIcon />New Patient
                    </div>
                <form className="searchContainer" onSubmit = { controller.handleSearchSubmit }>
                    <label htmlFor="search" className="searchLabel">
                        <SearchOutlinedIcon /><span>Search</span>
                    </label>
                    <input type="text" name="search" id="search" className="searchInput"/>
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
                patient = { selectedPatient } 
                appointments = { appointmentsForArray }
                handlePatientSearch = { controller.handlePatientSearch }
                handlePatientSubmit = { controller.handlePatientSubmit }
                handlePatientUpdate = { controller.handlePatientUpdate }
                handlePatientDelete = { controller.handlePatientDelete }
            />
        </section>
    );
}