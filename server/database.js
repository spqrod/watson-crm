const mysql = require("mysql2");
const dayjs = require("dayjs");

const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE_NAME,
}).promise();


const dateFormatForDB = "YYYY-MM-DD";

const database = {
    
    addNewAppointment: function(appointment) {
        return pool.query("insert into appointments (date, time, firstName, lastName, doctor, payment, treatment) values (?, ?, ?, ?, ?, ?, ?)", 
            [appointment.date, appointment.time, appointment.firstName, appointment.lastName, appointment.doctor, appointment.payment, appointment.treatment]);
    },
    updateAppointment: function(appointment) {
        return pool.query("UPDATE appointments SET date=?, time=?, firstName=?, lastName=?, doctor=?, payment=?, treatment=? WHERE id = ?", 
            [appointment.date, appointment.time, appointment.firstName, appointment.lastName, appointment.doctor, appointment.payment, appointment.treatment, appointment.id]);
    },
    addNewAppointmentsFromArray: function(appointmentsArray) {
        appointmentsArray.forEach(appointment => database.addNewAppointment(appointment));
    },
    deleteAppointment: function(id) {
        return pool.query("delete from appointments where id=?", id);
    },
    deleteAllAppointments: function() {
        return pool.query("delete from appointments");
    },
    getAppointmentsForDate: function(date) {
        const query = "select id, date, time, firstName, lastName, doctor, payment, treatment from appointments where date=? order by time";
        return pool.query(query, date).then(res => res[0]);
    },
    getAllAppointments: function() {
        return pool.query("select * from appointments");
    },
    getTakenTimeSlotsForDate: function(date) {
        const query = "select time from appointments where date=?"
        return pool.query(query, date).then(res => res[0]);
    }

}




const dateToday = dayjs().format(dateFormatForDB);
const dateTomorrow = dayjs().add(1, "day").format(dateFormatForDB);
const date1 = dayjs().add(2, "day").format(dateFormatForDB);
const date2 = dayjs().add(3, "day").format(dateFormatForDB);
const date3 = dayjs().add(4, "day").format(dateFormatForDB);

const exampleAppointmentsArray = [
    {
        id: 0,
        date: dateToday,
        time: "10:30",
        firstName: "John",
        lastName: "Watson",
        doctor: "Dr Watson",
        treatment: "Scaling",
        payment: "Nhima"
    },
    {
        id: 1,
        date: dateToday,
        time: "11:30",
        firstName: "Mark",
        lastName: "Brown",
        doctor: "Dr Watson",
        treatment: "Extraction",
        payment: "Cash"
    },
    {
        id: 2,
        date: dateToday,
        time: "12:30",
        firstName: "Leeroy",
        lastName: "Hawking",
        doctor: "Dr Watson",
        treatment: "Scaling",
        payment: "Cash"
    },
    {
        id: 3,
        date: dateTomorrow,
        time: "13:30",
        firstName: "Stephen",
        lastName: "Jenkins",
        doctor: "Dr Watson",
        treatment: "Scaling",
        payment: "Cash"
    },
    {
        id: 4,
        date: dateTomorrow,
        time: "14:00",
        firstName: "Lark",
        lastName: "Hawking",
        doctor: "Dr Watson",
        treatment: "Scaling",
        payment: "Cash"
    },
    {
        id: 5,
        date: dateTomorrow,
        time: "15:00",
        firstName: "Stephen",
        lastName: "Downing",
        doctor: "Dr Watson",
        treatment: "Scaling",
        payment: "Cash"
    },
    {
        id: 6,
        date: date1,
        time: "15:30",
        firstName: "Jessica",
        lastName: "Hawking",
        doctor: "Dr Watson",
        treatment: "Scaling",
        payment: "Cash"
    },
    {
        id: 7,
        date: date1,
        time: "16:00",
        firstName: "Chris",
        lastName: "Brown",
        doctor: "Dr Watson",
        treatment: "Scaling",
        payment: "Cash"
    },
    {
        id: 8,
        date: date1,
        time: "16:30",
        firstName: "Mark",
        lastName: "Hawking",
        doctor: "Dr Watson",
        treatment: "Scaling",
        payment: "Cash"
    },
    {
        id: 9,
        date: date2,
        time: "16:30",
        firstName: "Stephen",
        lastName: "Hawking",
        doctor: "Dr Watson",
        treatment: "Scaling",
        payment: "Cash"
    },
    {
        id: 10,
        date: date2,
        time: "16:30",
        firstName: "Facundo",
        lastName: "Montana",
        doctor: "Dr Watson",
        treatment: "Scaling",
        payment: "Nhima"
    },
    {
        id: 11,
        date: date2,
        time: "16:30",
        firstName: "Sergey",
        lastName: "Brin",
        doctor: "Dr Watson",
        treatment: "Scaling",
        payment: "Cash"
    },
    {
        id: 12,
        date: date3,
        time: "16:30",
        firstName: "Nikola",
        lastName: "Tesla",
        doctor: "Dr Watson",
        treatment: "Whitening",
        payment: "Cash"
    },
    {
        id: 13,
        date: date3,
        time: "16:30",
        firstName: "John",
        lastName: "Kennedy",
        doctor: "Dr Watson",
        treatment: "Scaling",
        payment: "Nhima"
    },
    {
        id: 14,
        date: date3,
        time: "16:30",
        firstName: "Donald",
        lastName: "Ceasar",
        doctor: "Dr Watson",
        treatment: "Scaling",
        payment: "Cash"
    },

];

// database.addNewAppointmentsFromArray(exampleAppointmentsArray);
// database.deleteAllAppointments();
// database.getAllAppointments().then(res => console.log(res[0]));

module.exports = { database };