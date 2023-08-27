import "../styles/patientList.css";

export default function PatientList(data) {

    const { patientsArray, handlePatientClick } = data;

    return (
        <ul className="patientListContainer">
            {
                patientsArray ? patientsArray.map((patient, index) => (
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
                            <p>{patient.dateOfBirth}</p>
                        </div>
                        <div className="infoContainer dateAdded">
                            <p>{patient.dateAdded}</p>
                        </div>
                    </li>
                ))
                : (
                    null
                )
            }
        </ul>
    );
}