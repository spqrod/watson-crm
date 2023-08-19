import "../styles/appointmentAsListItem.css";

export default function AppointmentAsListItem(data) {

    const { appointment, handleAppointmentClick } = data;
    const { isHeaderRow } = data;
    let classNameString = "appointmentAsListItem"
    if (isHeaderRow) 
        classNameString += " headerRow"

    return (
        <li id={ appointment.id } className={ classNameString } onClick={handleAppointmentClick}>
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
                <p>{appointment.procedure}</p>
            </div>
            <div className="infoContainer insurance">
                <p>{appointment.insurance}</p>
            </div>
        </li>
    );
}