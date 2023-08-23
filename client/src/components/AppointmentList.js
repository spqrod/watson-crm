import "../styles/appointmentList.css";

export default function AppointmentList(data) {

    const { appointmentsArray, handleAppointmentClick } = data;

    return (
        <ul className="appointmentListContainer">
            {
                appointmentsArray ? appointmentsArray.map((appointment, index) => (
                    <li id={ appointment.id } className="appointmentListItem" onClick={handleAppointmentClick}>
                        <div className="infoContainer time">
                            <p>{appointment.time}</p>
                        </div>
                        <div className="infoContainer firstName">
                            <p>{appointment.firstName}</p>
                        </div>
                        <div className="infoContainer lastName">
                            <p>{appointment.lastName}</p>
                        </div>
                        <div className="infoContainer doctor">
                            <p>{appointment.doctor}</p>
                        </div>
                        <div className="infoContainer procedure">
                            <p>{appointment.treatment}</p>
                        </div>
                        <div className="infoContainer insurance">
                            <p>{appointment.payment}</p>
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