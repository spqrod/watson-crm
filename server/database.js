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
        return pool.query("insert into appointments (date, time, firstName, lastName, doctor, treatment, payment, cost, file, phone, comments) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", 
            [appointment.date, appointment.time, appointment.firstName, appointment.lastName, appointment.doctor, appointment.treatment, appointment.payment, appointment.cost, appointment.file, appointment.phone, appointment.comments]);
    },
    updateAppointment: function(appointment) {
        return pool.query("UPDATE appointments SET date=?, time=?, firstName=?, lastName=?, doctor=?, treatment=?, payment=?, cost=?, file=?, phone=?, comments=?, noshow=? WHERE id = ?", 
            [appointment.date, appointment.time, appointment.firstName, appointment.lastName, appointment.doctor, appointment.treatment, appointment.payment, appointment.cost, appointment.file, appointment.phone, appointment.comments, appointment.noshow, appointment.id]);
    },
    deleteAppointment: function(id) {
        return pool.query("delete from appointments where id=?", id);
    },
    getAppointmentsForDate: function(date) {
        const query = "select id, date, time, firstName, lastName, doctor, treatment, payment, cost, file, phone, comments, noshow from appointments where date=? order by time";
        return pool.query(query, date).then(res => res[0]);
    },
    getTakenTimeSlotsForDate: function(date) {
        const query = "select time from appointments where date=?"
        return pool.query(query, date).then(res => res[0]);
    },
    addNewPatient: function(patient) {
        return pool.query("insert into patients (firstName, lastName, file, phone, sex, insuranceId, marketing) values (?, ?, ?, ?, ?, ?, ?);", 
            [patient.firstName, patient.lastName, patient.file, patient.phone, patient.sex, patient.insuranceId, patient.marketing]);
    },
    getPatients(searchString) {
        const query = "select * from patients where ? in (firstName, lastName, file, nrc, phone, insuranceId)";
        return pool.query(query, [searchString])
            .then(res => res[0])
    }
}

module.exports = { database };






const dateToday = dayjs().format(dateFormatForDB);
const dateTomorrow = dayjs().add(1, "day").format(dateFormatForDB);
const date1 = dayjs().add(2, "day").format(dateFormatForDB);
const date2 = dayjs().add(3, "day").format(dateFormatForDB);
const date3 = dayjs().add(4, "day").format(dateFormatForDB);








const query3 = "UPDATE appointments SET noshow=? WHERE id = ?";

const helperForAppointments = {
    describeAppointmentsTable() {
        const query = "describe appointments";
        pool.query(query).then((res) => console.log(res));
    },
    deleteAllAppointments: function() {
        return pool.query("delete from appointments");
    },
    getAllAppointments: function() {
        return pool.query("select * from appointments");
    },
    addNewAppointmentsFromArray: function(appointmentsArray) {
        appointmentsArray.forEach(appointment => database.addNewAppointment(appointment));
    },
    exampleAppointmentsArray: [
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
    ]
};

const helperForPatients = {
    createTablePatients() {
        const query = 'create table patients (id mediumint primary key not null auto_increment, firstName varchar(255), lastName varchar(255), file varchar(255), nrc varchar(255), insuranceId integer, phone varchar(255), dateOfBirth date, sex char, dateAdded datetime default now(), marketing varchar(255));';
        pool.query(query).then((res) => console.log(res));
    },
    describePatientsTable() {
        const query = "describe patients";
        pool.query(query).then((res) => console.log(res[0]));
    },
    deleteAllPatients: function() {
        return pool.query("delete from patients");
    },
    getAllPatients: function() {
        return pool.query("select * from patients").then(res => console.log(res[0]));
    },
    alterTablePatients() {
        const query = "alter table patients add column nrc varchar(255)";
        pool.query(query).then(res => console.log(res[0]));
    },
    addNewPatientsFromArray: function(patientsArray) {
        patientsArray.forEach(patient => database.addNewPatient(patient));
    },
    examplePatientsArray: [
        {
            firstName: "John",
            lastName: "Watson",
            file: "3232/22",
            phone: "260000 98231 12",
            sex: "M",
            insuranceId: "13135719035893",
            dateOfBirth: "1990-02-10",
            marketing: "Word of mouth"
        },
        {
            firstName: "Mark",
            lastName: "Brown",
            file: "3232/22",
            phone: "260000 98231 00",
            sex: "M",
            insuranceId: "981751332123",
            dateOfBirth: "1939-02-09",
            marketing: "Word of mouth"
        },
        {
            firstName: "Leeroy",
            lastName: "Hawking",
            file: "1232/00",
            phone: "260000 98231 86",
            sex: "M",
            insuranceId: "0927057130",
            dateOfBirth: "1992-06-11",
            marketing: "Word of mouth"
        },
        {
            firstName: "Stephen",
            lastName: "Jenkins",
            file: "32232/99",
            phone: "260 9238231 12",
            sex: "M",
            dateOfBirth: "1920-02-10",
            marketing: "Word of mouth",
            comments: "Friend of John"
        },
        {
            firstName: "Gary",
            lastName: "John",
            file: "92754/75",
            phone: "260 9261914 82",
            sex: "M",
            dateOfBirth: "1966-05-02",
            marketing: "Word of mouth",
        },
    ],
};

// helperForPatients.alterTablePatients();
// database.addNewPatient(helperForPatients.examplePatientsArray[0])
// helperForPatients.addNewPatientsFromArray(helperForPatients.examplePatientsArray)
// helperForPatients.getAllPatients();
// database.getPatient("12");