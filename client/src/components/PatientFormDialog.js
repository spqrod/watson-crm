import "../styles/patientFormDialog.css";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import CloseIcon from '@mui/icons-material/Close';
import AppointmentList from "./AppointmentList";
import AppointmentFormDialog from "./AppointmentFormDialog";
import { useNavigate } from "react-router-dom";

export default function PatientFormDialog(data) {

    const [ dialogMode, setDialogMode ] = useState(data.dialogMode);
    const [ selectedPatient, setSelectedPatient ] = useState(data.patient);
    const [ appointmentsForPatient, setAppointmentsForPatient ] = useState(data.appointments);
    const [ selectedAppointment, setSelectedAppointment ] = useState();
    const [ payments, setPayments ] = useState([]); 
    const [ selectedPayment, setSelectedPayment ] = useState("");
    const { 
        handlePatientSubmit, 
        handlePatientUpdate, 
        handlePatientDelete 
    } = data;
    const navigate = useNavigate();

    const api = {
        getPayments() {
            const fetchURL = "/payments";
            return fetch(fetchURL).then(res => res.json());
        },
    }

    const controller = {
        resetPatientFormToDefault() {
            // Closing appointment dialog that is open inside a patient dialog triggers onClose method that belongs to the patient dialog for some reason. That is why this additional check isPatientFormDialogOpen is implemented.
            const isPatientFormDialogOpen = document.querySelector(".patientFormDialog").open;
            if (!isPatientFormDialogOpen) {
                document.querySelector(".patientForm").reset();
                const submitButton = document.querySelector(".button.submitButton");
                submitButton.classList.add("disabled");
                setAppointmentsForPatient([]);
                setSelectedPayment("");
            };
        },
        makeUpdateButtonActive() {
            const submitButton = document.querySelector(".button.submitButton");
            submitButton.classList.remove("disabled");
        },
        getAppointment: function(id) {
            const appointment = appointmentsForPatient.find(item => item.id === Number(id));
            return appointment;
        },
        handleAppointmentClick(e) {
            const appointmentID = e.currentTarget.id;
            const appointment = controller.getAppointment(appointmentID);
            setSelectedAppointment(appointment);
            display.showAppointmentDialog();
        },
        addNewAppointment(e) {
            localStorage.clear();
            localStorage.setItem("isNewAppointmentFromPatientPage", "true");
            for (const [key, value] of Object.entries(selectedPatient)) {
                localStorage.setItem(key, value);
            }
            navigate("/appointments");
        },
        getPayments() {
            api.getPayments()
                .then(res => setPayments(res));
        },
    };

    const display = {
        dateFormatForDatePicker: "YYYY-MM-DD",
        today: dayjs().format("YYYY-MM-DD"),
        showAppointmentDialog() {
            const dialog = document.querySelector(".appointmentFormDialog");
            dialog.showModal();
        },
        updatePaymentLabel(payment) {
            setSelectedPayment(payment);
        }
    };

    useEffect(() => {
        setSelectedPatient(data.patient);
        if (data.patient)
            display.updatePaymentLabel(data.patient.payment);
    }, [data.patient]);

    useEffect(() => {
        setAppointmentsForPatient(data.appointments);
    }, [data.appointments]);

    useEffect(() => {
        setDialogMode(data.dialogMode);
    }, [data.dialogMode]);

    useEffect(() => {
        controller.getPayments();
    }, []);
    
    return (
        <dialog className="dialog patientFormDialog" onClose={ controller.resetPatientFormToDefault } >
            <h3 className="dialogHeader">
                { selectedPatient ? "Patient" : "New Patient" } 
            </h3>
            <form className="formForDialogCloseButton" method="dialog">
                <button className="closeButton" >
                    <CloseIcon />
                </button>
            </form>
            <form className="patientForm" onSubmit={ dialogMode === "update" ? handlePatientUpdate : dialogMode === "addNew" ? handlePatientSubmit : "" }>
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
                    <div className="labelAndInputContainer payment">
                        <label htmlFor="payment">Payment:</label>
                        <select
                            className="inputField payment"
                            id="payment" 
                            name="payment"
                            onChange = { () => {
                                controller.makeUpdateButtonActive(); 
                                setSelectedPayment(document.querySelector(".inputField.payment").value)
                            }}
                        >
                            <option hidden>{ selectedPatient ? selectedPatient.payment : ""}</option>
                            { payments.map((item) => 
                                (<option key={ item } value={ item }>{ item }</option>)) }
                        </select>
                    </div>
                    { (selectedPayment === "Cash" || selectedPayment === "Swipe" || selectedPayment === "TT") ? null : 
                        <div className="labelAndInputContainer insuranceId">
                            <label htmlFor="insuranceId"> 
                                { selectedPayment !== "" ? selectedPayment : "Insurance" } ID: 
                            </label>
                            <input 
                                type="number" 
                                name="insuranceId" 
                                id="insuranceId" 
                                defaultValue={ dialogMode === "update" ? selectedPatient.insuranceId : "" }
                                onChange={ controller.makeUpdateButtonActive } />
                        </div>
                    }
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
                        <label htmlFor="dateOfBirth">Date of Birth:</label>
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
                        { dialogMode === "update" ? 
                            <button className="button createNewAppointment" type="button" onClick={ controller.addNewAppointment }>
                                <AddOutlinedIcon /> Add New Appointment
                            </button> 
                        : null }
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
            { selectedPatient ? 
                <div className="appointmentsContainer">
                    <p className="appointmentsLine">Appointments:</p>
                    <div className="appointmentsListAndHeaderContainer">
                        <div className="headerRowContainer">
                            <p>Date</p>
                            <p>Time</p>
                            <p>Doctor</p>
                            <p>Treatment</p>
                            <p>Payment</p>
                            <p>Cost</p>
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
                </div>
                : null }
        </dialog>

    );
}