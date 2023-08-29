import "../styles/appointmentList.css";

export default function AppointmentList(data) {

    const { 
        appointmentsArray, 
        handleAppointmentClick, 
        isOnAppointmentsPage, 
        isInPatientsFormDialog 
    } = data;

    return (
        <ul className="appointmentListContainer">
            {   
                appointmentsArray ? appointmentsArray.length > 0 ? appointmentsArray.map((appointment, index) => (
                    <li id={ appointment.id } className="appointmentListItem" onClick={ handleAppointmentClick }>
                        { isInPatientsFormDialog ? 
                            <div className="infoContainer date">
                                <p>{appointment.date}</p>
                            </div> : null 
                        }
                        <div className="infoContainer time">
                            <p>{appointment.time}</p>
                        </div>
                        { isOnAppointmentsPage ?
                            <>
                                <div className="infoContainer firstName">
                                    <p>{appointment.firstName}</p>
                                </div> 
                                <div className="infoContainer lastName">
                                    <p>{appointment.lastName}</p>
                                </div>
                            </> : null
                        }
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
                    <p classList="noAppointmentsFoundLine">No Appointments Found</p>
                ) 
                : null
            }
        </ul>
    );
}