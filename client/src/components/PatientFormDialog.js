import "../styles/patientFormDialog.css";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';
import CloseIcon from '@mui/icons-material/Close';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';


export default function PatientFormDialog(data) {

    const [ dialogMode, setDialogMode ] = useState(data.dialogMode);
    const dateFormatForDB = "YYYY-MM-DD"
    const today = dayjs().format(dateFormatForDB);
    // const [ selectedPatient, setSelectedPatient ] = useState(data.patient);
    // const [ availableTimesSlotsForTimePicker, setAvailableTimesSlotsForTimePicker ] = useState([data.timeSlots]);
    const { 
        handlePatientSearch
        // handlePatientSubmit, 
        // handlePatientUpdate, 
        // handlePatientDelete 
    } = data;


    const controller = {

        // resetFormToDefault() {
        //     document.querySelector(".patientForm").reset();
        //     const submitButton = document.querySelector(".button.update");
        //     submitButton.classList.add("disabled");
        // },
        // makeUpdateButtonActive() {
        //     const submitButton = document.querySelector(".button.update");
        //     submitButton.classList.remove("disabled");
        // },

    }

    // useEffect(() => {
    //     setSelectedPatient(data.patient);
    //     if (data.patient)
    //         controller.updateNoshowCheckbox(data.patient.noshow);
    // }, [data.patient]);

    useEffect(() => {
        setDialogMode(data.dialogMode);
    }, [data.dialogMode]);
    
 
    return (
        <dialog className="dialog patientFormDialog" onClose={ controller.resetFormToDefault } >
            <form className="formForDialogCloseButton" method="dialog">
                <button className="closeButton" onClick={ controller.resetFormToDefault } >
                    <CloseIcon />
                </button>
            </form>
            <form 
                className="patientForm" 
                onSubmit={ dialogMode === "search" ? handlePatientSearch : null }
            >
                <div className="infoContainer">
                    <div className="labelAndInputContainer firstName">
                        <label htmlFor="firstName">First Name:</label>
                        <input 
                            type="text" 
                            name="firstName" 
                            id="firstName" 
                            // defaultValue={selectedPatient ? selectedPatient.firstName : ""}
                            // onChange={ selectedPatient ? controller.makeUpdateButtonActive : null}
                        />
                    </div>
                    <div className="labelAndInputContainer lastName">
                        <label htmlFor="lastName">Last Name:</label>
                        <input 
                            type="text" 
                            name="lastName" 
                            id="lastName" 
                            // defaultValue={selectedPatient ? selectedPatient.lastName : ""}
                            // onChange={ selectedPatient ? controller.makeUpdateButtonActive : null}
                        />
                    </div>
                    <div className="labelAndInputContainer file">
                        <label htmlFor="file">File:</label>
                        <input 
                            type="text" 
                            name="file" 
                            id="file" 
                            // defaultValue={selectedPatient ? selectedPatient.file : ""}
                            // onChange={ selectedPatient ? controller.makeUpdateButtonActive : null}
                        />
                    </div>
                    <div className="labelAndInputContainer nrc">
                        <label htmlFor="nrc">NRC:</label>
                        <input 
                            type="text" 
                            name="nrc" 
                            id="nrc" 
                            // defaultValue={selectedPatient ? selectedPatient.phone : ""}
                            // onChange={ selectedPatient ? controller.makeUpdateButtonActive : null}
                        />
                    </div>
                    <div className="labelAndInputContainer insuranceId">
                        <label htmlFor="insuranceId">Insurance ID:</label>
                        <input 
                            type="number" 
                            name="insuranceId" 
                            id="insuranceId" 
                            // defaultValue={selectedPatient ? selectedPatient.phone : ""}
                            // onChange={ selectedPatient ? controller.makeUpdateButtonActive : null}
                        />
                    </div>
                    <div className="labelAndInputContainer phone">
                        <label htmlFor="phone">Phone:</label>
                        <input 
                            type="tel" 
                            name="phone" 
                            id="phone" 
                            // defaultValue={selectedPatient ? selectedPatient.phone : ""}
                            // onChange={ selectedPatient ? controller.makeUpdateButtonActive : null}
                        />
                    </div>
                    <div className="labelAndInputContainer dateOfBirth">
                        <label htmlFor="date">Date of Birth:</label>
                        <input type="date" name="dateOfBirth" id="dateOfBirth"
                            // min={todayForPicker}
                            max = { today }
                            // onChange={() => { 
                            //     getAvailableTimeSlots(controller.getSelectedDate());
                            //     if (selectedPatient) controller.makeUpdateButtonActive();
                            // }}
                            // defaultValue={ selectedPatient ? selectedPatient.date : ""}
                        />
                    </div>
                    <div className="labelAndInputContainer sex">
                        <label htmlFor="sex">Sex:</label>
                        <select 
                            id="sex" 
                            name="sex"
                            // onChange={ selectedPatient ? controller.makeUpdateButtonActive : null}
                        >
                            <option hidden>{dialogMode === "addNew" ? null : ""}</option>
                            <option value="m">M</option>
                            <option value="f">F</option>
                        </select>
                    </div>
                    <div className="labelAndInputContainer dateAdded">
                        <label htmlFor="dateAdded">Date Added:</label>
                        <input 
                            type="date"
                            id="dateAdded" 
                            name="dateAdded" 
                            // onChange={ selectedPatient ? controller.makeUpdateButtonActive : null}
                            defaultValue = { dialogMode === "addNew" ? today : null }
                            disabled = { dialogMode === "addNew" ? true : false }
                        />
                    </div>
                    <div className="labelAndInputContainer marketing">
                        <label htmlFor="marketing">Marketing:</label>
                        <input 
                            type="text" 
                            name="marketing" 
                            id="marketing" 
                            // defaultValue={selectedPatient ? selectedPatient.cost : ""}
                            // onChange={ selectedPatient ? controller.makeUpdateButtonActive : null}
                        />
                    </div>
                </div> 
                <div className="buttonsContainer">
                    <button 
                        className={`button deleteButton ${ dialogMode === "search" || dialogMode === "addNew" ? "disabled" : null }`} 
                        type="button" 
                        // onClick={ handlePatientDelete }
                    >
                        <DeleteOutlineOutlinedIcon />
                        Delete
                    </button>
                    <button 
                        className={`button submitButton ${ dialogMode === "update" ? "disabled" : null}`} 
                        type="submit"
                    >
                        { dialogMode === "search" ?
                            <><SearchOutlinedIcon />Search</> :
                            dialogMode === "addNew" ?
                                <><AddOutlinedIcon />Add New Patient</> :
                                dialogMode === "update" ?
                                    <><AutorenewOutlinedIcon />Update Patient</> :
                                    null
                        }
                    </button>
                </div>
            </form>
        </dialog>

    );
}