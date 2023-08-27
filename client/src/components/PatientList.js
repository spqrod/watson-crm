import "../styles/patientList.css";

export default function PatientList(data) {

    const { patientsArray, handlePatientClick } = data;

    return (
        <ul className="patientListContainer">
            {
                patientsArray ? patientsArray.map((patient, index) => (
                    <li id={ patient.id } className="patientListItem" onClick={handlePatientClick}>
                        <div className="infoContainer time">
                            <p>{patient.time}</p>
                        </div>
                        <div className="infoContainer firstName">
                            <p>{patient.firstName}</p>
                        </div>
                        <div className="infoContainer lastName">
                            <p>{patient.lastName}</p>
                        </div>
                        <div className="infoContainer doctor">
                            <p>{patient.doctor}</p>
                        </div>
                        <div className="infoContainer procedure">
                            <p>{patient.treatment}</p>
                        </div>
                        <div className="infoContainer insurance">
                            <p>{patient.payment}</p>
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