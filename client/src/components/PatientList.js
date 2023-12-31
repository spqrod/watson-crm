import "../styles/patientList.css";
import dayjs from "dayjs";

export default function PatientList(data) {

    const { patientsArray, handlePatientClick } = data;
    const dateFormatForDisplay = "DD.MM.YYYY";

    return (
        <ul className="patientListContainer">
            {
                patientsArray.length > 0 ? patientsArray.map((patient, index) => (
                    <li id={ patient.id } className="patientListItem" onClick={handlePatientClick}>
                        <div className="infoContainer firstName">
                            <p>{patient.firstName}</p>
                        </div>
                        <div className="infoContainer lastName">
                            <p>{patient.lastName}</p>
                        </div>
                        <div className="infoContainer file">
                            <p>{patient.file}</p>
                        </div>
                        <div className="infoContainer nrc">
                            <p>{patient.nrc}</p>
                        </div>
                        <div className="infoContainer phone">
                            <p>{patient.phone}</p>
                        </div>
                        <div className="infoContainer dateOfBirth">
                            <p>{ patient.dateOfBirth ? dayjs(patient.dateOfBirth).format(dateFormatForDisplay) : null }</p>
                        </div>
                        <div className="infoContainer dateAdded">
                            <p>{ dayjs(patient.dateAdded).format(dateFormatForDisplay) }</p>
                        </div>
                    </li>
                ))
                : (
                    <p className="patientListItem">No patients found</p>
                )
            }
        </ul>
    );
}