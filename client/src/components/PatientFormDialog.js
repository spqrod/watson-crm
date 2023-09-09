import "../styles/patientFormDialog.css";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import CloseIcon from '@mui/icons-material/Close';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AppointmentList from "./AppointmentList";
import AppointmentFormDialog from "./AppointmentFormDialog";

export default function PatientFormDialog(data) {

    const [ dialogMode, setDialogMode ] = useState(data.dialogMode);
    const [ selectedPatient, setSelectedPatient ] = useState(data.patient);
    const [ appointmentsForPatient, setAppointmentsForPatient ] = useState(data.appointments);
    const [ selectedAppointment, setSelectedAppointment ] = useState();
    const { 
        handlePatientSearch,
        handlePatientSubmit, 
        handlePatientUpdate, 
        handlePatientDelete 
    } = data;

    const controller = {
        resetFormToDefault() {
            document.querySelector(".patientForm").reset();
            const submitButton = document.querySelector(".button.submitButton");
            submitButton.classList.add("disabled");
        },
        makeUpdateButtonActive() {
            const submitButton = document.querySelector(".button.submitButton");
            submitButton.classList.remove("disabled");
        },
        getAppointment: function(id) {
            const appointment = appointmentsForPatient.find(item => item.id == id);
            return appointment;
        },
        handleAppointmentClick(e) {
            const appointmentID = e.currentTarget.id;
            const appointment = controller.getAppointment(appointmentID);
            setSelectedAppointment(appointment);
            display.showAppointmentDialog();
        }
    };

    const display = {
        dateFormatForDatePicker: "YYYY-MM-DD",
        today: dayjs().format("YYYY-MM-DD"),
        showAppointmentDialog() {
            const dialog = document.querySelector(".appointmentFormDialog");
            dialog.showModal();
        }
    };

    useEffect(() => {
        setSelectedPatient(data.patient);
    }, [data.patient]);

    useEffect(() => {
        setAppointmentsForPatient(data.appointments);
    }, [data.appointments]);

    useEffect(() => {
        setDialogMode(data.dialogMode);
    }, [data.dialogMode]);
    
    return (
        <dialog className="dialog patientFormDialog" onClose={ controller.resetFormToDefault } >
            <h3 className="dialogHeader">Patient</h3>
            <form className="formForDialogCloseButton" method="dialog">
                <button className="closeButton" onClick={ controller.resetFormToDefault } >
                    <CloseIcon />
                </button>
            </form>
            <form 
                className="patientForm" 
                onSubmit={ dialogMode === "update" ? 
                    handlePatientUpdate : dialogMode === "addNew" ? 
                        handlePatientSubmit : "" }
            >
                <div className="infoContainer">
                    <div className="labelAndInputContainer firstName">
                        <label htmlFor="firstName">First Name:</label>
                        <input 
                            type="text" 
                            name="firstName" 
                            id="firstName" 
                            defaultValue={ dialogMode === "update" ? selectedPatient.firstName : ""}
                            onChange={ controller.makeUpdateButtonActive }
                        />
                    </div>
                    <div className="labelAndInputContainer lastName">
                        <label htmlFor="lastName">Last Name:</label>
                        <input 
                            type="text" 
                            name="lastName" 
                            id="lastName" 
                            defaultValue={ dialogMode === "update" ? selectedPatient.lastName : ""}
                            onChange={ controller.makeUpdateButtonActive }
                        />
                    </div>
                    <div className="labelAndInputContainer file">
                        <label htmlFor="file">File:</label>
                        <input 
                            type="text" 
                            name="file" 
                            id="file" 
                            defaultValue={ dialogMode === "update" ? selectedPatient.file : ""}
                            onChange={ controller.makeUpdateButtonActive }
                        />
                    </div>
                    <div className="labelAndInputContainer nrc">
                        <label htmlFor="nrc">NRC:</label>
                        <input 
                            type="text" 
                            name="nrc" 
                            id="nrc" 
                            defaultValue={ dialogMode === "update" ? selectedPatient.nrc : ""}
                            onChange={ controller.makeUpdateButtonActive }

                        />
                    </div>
                    <div className="labelAndInputContainer insuranceId">
                        <label htmlFor="insuranceId">Insurance ID:</label>
                        <input 
                            type="number" 
                            name="insuranceId" 
                            id="insuranceId" 
                            defaultValue={ dialogMode === "update" ? selectedPatient.insuranceId : "" }
                            onChange={ controller.makeUpdateButtonActive }

                            />
                    </div>
                    <div className="labelAndInputContainer phone">
                        <label htmlFor="phone">Phone:</label>
                        <input 
                            type="tel" 
                            name="phone" 
                            id="phone" 
                            autoComplete="tel"
                            defaultValue={ dialogMode === "update" ? selectedPatient.phone : "" }
                            onChange={ controller.makeUpdateButtonActive }
                        />
                    </div>
                    <div className="labelAndInputContainer dateOfBirth">
                        <label htmlFor="date">Date of Birth:</label>
                        <input type="date" name="dateOfBirth" id="dateOfBirth"
                            max = { display.today }
                            onChange={ controller.makeUpdateButtonActive }
                            defaultValue={ dialogMode === "update" ? 
                                selectedPatient.dateOfBirth ? 
                                dayjs(selectedPatient.dateOfBirth).format(display.dateFormatForDatePicker) : "" : "" }
                        />
                    </div>
                    <div className="labelAndInputContainer sex">
                        <label htmlFor="sex">Sex:</label>
                        <select 
                            id="sex" 
                            name="sex"
                            className="sex"
                            onChange={ controller.makeUpdateButtonActive }
                        >
                            {/* 
                                This ugly condition tree is in place because:
                                1. defaultValue on <selec> does not work for some reason.
                                2. selected on <option> does not work for some reason.
                                3. value on <select> works but prevents any changes to select. JS solution not found
                            */}
                            { dialogMode === "addNew" ?  
                                <>
                                    <option hidden></option>
                                    <option value="M">M</option>
                                    <option value="F">F</option>
                                </> : dialogMode === "update" ?
                                    selectedPatient ? 
                                        selectedPatient.sex ?
                                            selectedPatient.sex === "M" ?
                                                <>
                                                    <option value="M">M</option>
                                                    <option value="F">F</option>
                                                </> :
                                                <>
                                                    <option value="F">F</option>
                                                    <option value="M">M</option>
                                                </> :
                                            <>
                                                <option hidden></option>
                                                <option value="M">M</option>
                                                <option value="F">F</option>
                                            </> :
                                        "" : 
                                    ""
                            }
                        </select>
                    </div>
                    <div className="labelAndInputContainer dateAdded">
                        <label htmlFor="dateAdded">Date Added:</label>
                        <input 
                            type="date"
                            id="dateAdded" 
                            name="dateAdded" 
                            onChange={ controller.makeUpdateButtonActive }
                            defaultValue = { dialogMode === "update" ? 
                                dayjs(selectedPatient.dateAdded).format(display.dateFormatForDatePicker) : dialogMode === "addNew" ? 
                                display.today : "" }
                            disabled = { true }
                        />
                    </div>
                    <div className="labelAndInputContainer marketing">
                        <label htmlFor="marketing">Marketing:</label>
                        <input 
                            type="text" 
                            name="marketing" 
                            id="marketing" 
                            defaultValue={ dialogMode === "update" ? selectedPatient.marketing : ""}
                            onChange={ controller.makeUpdateButtonActive }

                        />
                    </div>
                    <div className="buttonsContainer" id="buttonsContainer">
                        <button 
                            className={`button deleteButton ${ dialogMode === "search" || dialogMode === "addNew" ? "disabled" : "" }`} 
                            type="button" 
                            onClick={ handlePatientDelete }
                        >
                            <DeleteOutlineOutlinedIcon />
                            Delete
                        </button>
                        <button 
                            className={`button submitButton disabled`} 
                            type="submit"
                        >
                            { dialogMode === "addNew" ? <><AddOutlinedIcon />Add New Patient</> :
                                    dialogMode === "update" ? <><AutorenewOutlinedIcon />Update Patient</> :
                                        ""
                            }
                        </button>
                    </div>
                </div> 
            </form>
            <p className="appointmentsLine">Appointments:</p>
            <div className="appointmentsListAndHeaderContainer">
                <div className="headerRowContainer">
                    <p>Date</p>
                    <p>Time</p>
                    <p>Doctor</p>
                    <p>Treatment</p>
                    <p>Payment</p>
                </div>
                <AppointmentList 
                    appointmentsArray = { appointmentsForPatient } 
                    handleAppointmentClick = { controller.handleAppointmentClick }
                    isInPatientsFormDialog = { true }
                />
            </div>
            <AppointmentFormDialog 
                appointment={ selectedAppointment } 
                isInPatientFormDialog = { true }
                getTakenTimeSlots={ null } 
                timeSlots = { null } 
                handleAppointmentSubmit = { null }
                handleAppointmentUpdate = { null }
                handleAppointmentDelete = { null }
            />
        </dialog>

    );
}