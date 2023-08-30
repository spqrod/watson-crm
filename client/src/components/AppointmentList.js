import "../styles/appointmentList.css";
import dayjs from "dayjs";

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
                            <div className="infoContainer date">
                                <p>{ dayjs(appointment.date).format("DD.MM.YYYY") }</p>
                            </div> 
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