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
    getAppointmentsForDate: function(date) {
        const query = "select id, date, time, firstName, lastName, doctor, treatment, payment, cost, patientFile, phone, comments, noshow from appointments where date=? order by time";
        return pool.query(query, date).then(res => res[0]);
    },
    searchAppointments(searchString) {
        const query = "select * from appointments where ? in (firstName, lastName, patientFile, doctor, treatment, phone)";
        return pool.query(query, [searchString])
            .then(res => res[0])
    },
    addNewAppointment: function(appointment) {
        console.log(appointment.patientFile)
        return pool.query("insert into appointments (date, time, firstName, lastName, doctor, treatment, payment, cost, patientFile, phone, comments) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", 
            [appointment.date, appointment.time, appointment.firstName, appointment.lastName, appointment.doctor, appointment.treatment, appointment.payment, appointment.cost, appointment.patientFile, appointment.phone, appointment.comments]);
    },
    updateAppointment: function(appointment) {
        return pool.query("UPDATE appointments SET date=?, time=?, firstName=?, lastName=?, doctor=?, treatment=?, payment=?, cost=?, patientFile=?, phone=?, comments=?, noshow=? WHERE id = ?", 
            [appointment.date, appointment.time, appointment.firstName, appointment.lastName, appointment.doctor, appointment.treatment, appointment.payment, appointment.cost, appointment.patientFile, appointment.phone, appointment.comments, appointment.noshow, appointment.id]);
    },
    deleteAppointment: function(id) {
        return pool.query("delete from appointments where id=?", id);
    },
    getAppointmentsForPatient(patientFile) {
        const query  = "select id, date, time, firstName, lastName, doctor, treatment, payment, cost, patientFile, phone, comments, noshow from appointments where patientFile = ?";
        return pool.query(query, [patientFile]).then(res => res[0]);
    },

    getTakenTimeSlotsForDate: function(date) {
        const query = "select time from appointments where date=?"
        return pool.query(query, date).then(res => res[0]);
    },

    getPatients(searchString) {
        const query = "select * from patients where ? in (firstName, lastName, file, nrc, phone, insuranceId)";
        return pool.query(query, [searchString])
            .then(res => res[0])
    },
    addNewPatient: function(patient) {
        const query = "insert into patients (firstName, lastName, file, nrc, phone, insuranceId, dateOfBirth, sex, marketing) values (?, ?, ?, ?, ?, ?, ?, ?, ?);";
        const array = [patient.firstName, patient.lastName, patient.file, patient.nrc, patient.phone, patient.insuranceId, patient.dateOfBirth, patient.sex, patient.marketing];
        return pool.query(query, array);
    },
    updatePatient: function(patient) {
        const query = "UPDATE patients SET firstName=?, lastName=?, file=?, nrc=?, phone=?, insuranceId=?, dateOfBirth=?, sex=?, marketing=? WHERE id = ?";
        const array = [patient.firstName, patient.lastName, patient.file, patient.nrc, patient.phone, patient.insuranceId, patient.dateOfBirth, patient.sex, patient.marketing, patient.id];
        return pool.query(query, array);
    },
    deletePatient: function(id) {
        return pool.query("delete from patients where id=?", id);
    },

    getLastInsertedPatient() {
        const query = "select * from patients where id = (select last_insert_id())";
        return pool.query(query)
            .then(res => res[0][0]);
    },
}

module.exports = { database };






const dateToday = dayjs().format(dateFormatForDB);
const dateTomorrow = dayjs().add(1, "day").format(dateFormatForDB);
const date1 = dayjs().add(2, "day").format(dateFormatForDB);
const date2 = dayjs().add(3, "day").format(dateFormatForDB);
const date3 = dayjs().add(4, "day").format(dateFormatForDB);









const helperForAppointments = {
    createTable() {
        const query = "create table appointments (id mediumint auto_increment not null primary key, date date, time time, firstName varchar(255), lastName varchar(255), doctor varchar(255), treatment varchar(255), payment varchar(255), cost varchar(255), patientFile varchar(255), phone varchar(255), comments varchar(255), noshow boolean, dateAdded datetime default now())";
        pool.query(query);
    },
    describeAppointmentsTable() {
        const query = "describe appointments";
        pool.query(query).then((res) => console.log(res[0]));
    },
    alterTableAppointments() {
        const query = "alter table appointments drop foreign key appointments_ibfk_1";
        // const query = "alter table appointments add column patientFile varchar(255)";
        pool.query(query);
    },
    deleteAllAppointments: function() {
        return pool.query("delete from appointments");
    },
    getAllAppointments: function() {
        pool.query("select * from appointments").then(res => console.log(res[0]));
    },
    addNewAppointmentsFromArray: function(appointmentsArray) {
        appointmentsArray.forEach(appointment => database.addNewAppointment(appointment));
    },
    exampleAppointmentsArray: [
        {
            date: dateToday,
            time: "10:30",
            firstName: "John",
            lastName: "Watson",
            patientFile: "3232/22",
            doctor: "Dr Watson",
            treatment: "Scaling",
            payment: "Nhima"
        },
        {
            date: dateToday,
            time: "11:30",
            firstName: "John",
            lastName: "Watson",
            patientFile: "3232/22",
            doctor: "Dr Watson",
            treatment: "Scaling",
            payment: "Nhima"
        },
        {
            date: dateTomorrow,
            time: "08:30",
            firstName: "John",
            lastName: "Watson",
            patientFile: "3232/22",
            doctor: "Dr Watson",
            treatment: "Scaling",
            payment: "Nhima"
        },
        {
            date: dateTomorrow,
            time: "18:30",
            firstName: "John",
            lastName: "Watson",
            patientFile: "3232/22",
            doctor: "Dr Watson",
            treatment: "Scaling",
            payment: "Cash"
        },
        {
            date: dateToday,
            time: "11:30",
            firstName: "Mark",
            lastName: "Brown",
            patientFile: "9872/91",
            doctor: "Dr Watson",
            treatment: "Extraction",
            payment: "Cash"
        },
        {
            date: dateToday,
            time: "12:30",
            firstName: "Leeroy",
            lastName: "Hawking",
            patientFile: "0002/00",
            doctor: "Dr Watson",
            treatment: "Scaling",
            payment: "Cash"
        },
        {
            date: dateTomorrow,
            time: "13:30",
            firstName: "Stephen",
            lastName: "Jenkins",
            patientFile: "0003/00",
            doctor: "Dr Watson",
            treatment: "Scaling",
            payment: "Cash"
        },
        {
            date: dateTomorrow,
            time: "14:00",
            firstName: "Lark",
            lastName: "Hawking",
            patientFile: "0004/00",
            doctor: "Dr Watson",
            treatment: "Scaling",
            payment: "Cash"
        },
        {
            date: dateTomorrow,
            time: "15:00",
            firstName: "Stephen",
            lastName: "Downing",
            patientFile: "0005/00",
            doctor: "Dr Watson",
            treatment: "Scaling",
            payment: "Cash"
        },
        {
            date: date1,
            time: "15:30",
            firstName: "Jessica",
            lastName: "Hawking",
            patientFile: "0006/00",
            doctor: "Dr Watson",
            treatment: "Scaling",
            payment: "Cash"
        },
        {
            date: date1,
            time: "16:00",
            firstName: "Chris",
            lastName: "Brown",
            patientFile: "0007/00",
            doctor: "Dr Watson",
            treatment: "Scaling",
            payment: "Cash"
        },
        {
            date: date1,
            time: "16:30",
            firstName: "Mark",
            lastName: "Hawking",
            patientFile: "0008/00",
            doctor: "Dr Watson",
            treatment: "Scaling",
            payment: "Cash"
        },
        {
            date: date2,
            time: "16:30",
            firstName: "Stephen",
            lastName: "Hawking",
            patientFile: "0009/00",
            doctor: "Dr Watson",
            treatment: "Scaling",
            payment: "Cash"
        },
        {
            date: date2,
            time: "16:30",
            firstName: "Facundo",
            lastName: "Montana",
            patientFile: "0010/00",
            doctor: "Dr Watson",
            treatment: "Scaling",
            payment: "Nhima"
        },
        {
            date: date2,
            time: "16:30",
            firstName: "Sergey",
            lastName: "Brin",
            patientFile: "0011/00",
            doctor: "Dr Watson",
            treatment: "Scaling",
            payment: "Cash"
        },
        {
            date: date3,
            time: "16:30",
            firstName: "Nikola",
            lastName: "Tesla",
            patientFile: "0012/00",
            doctor: "Dr Watson",
            treatment: "Whitening",
            payment: "Cash"
        },
        {
            date: date3,
            time: "16:30",
            firstName: "John",
            lastName: "Kennedy",
            patientFile: "0013/00",
            doctor: "Dr Watson",
            treatment: "Scaling",
            payment: "Nhima"
        },
        {
            date: date3,
            time: "16:30",
            firstName: "Donald",
            lastName: "Ceasar",
            patientFile: "0014/00",
            doctor: "Dr Watson",
            treatment: "Scaling",
            payment: "Cash"
        },
    ],
    dropTable() {
        const query = "drop table appointments";
        pool.query(query);
    }
};


// helperForAppointments.createTable();
// helperForAppointments.dropTable();
// helperForAppointments.addNewAppointmentsFromArray(helperForAppointments.exampleAppointmentsArray);
// helperForAppointments.getAllAppointments();
// helperForAppointments.deleteAllAppointments();
// helperForAppointments.describeAppointmentsTable();
// helperForAppointments.alterTableAppointments();
// database.getAppointmentsForPatient("3232/22").then(res => console.log(res));







const helperForPatients = {
    createTablePatients() {
        const query = 'create table patients (id mediumint primary key not null auto_increment, firstName varchar(255), lastName varchar(255), file varchar(255), nrc varchar(255), insuranceId varchar(255), phone varchar(255), dateOfBirth date, sex char, dateAdded datetime default now(), marketing varchar(255));';
        pool.query(query).then((res) => console.log(res));
    },
    dropTable() {
        const query = "drop table patients";
        pool.query(query);
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
        // const query = "alter table patients modify column id varchar(255) primary key not null default '9999/99'";
        // const query = "alter table patients drop primary key;";
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
            nrc: "481920/22",
            phone: "260000 98231 12",
            sex: "M",
            insuranceId: "13135719035893",
            dateOfBirth: "1990-02-10",
            marketing: "Word of mouth"
        },
        {
            firstName: "Mark",
            lastName: "Brown",
            file: "9872/91",
            nrc: "481920/78",
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
            nrc: "111111/22",
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
            nrc: "928821/22",
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
            nrc: "4234920/11",
            phone: "260 9261914 82",
            sex: "M",
            dateOfBirth: "1966-05-02",
            marketing: "Word of mouth",
        },
    ],
};


// helperForPatients.createTablePatients();
// helperForPatients.dropTable();
// helperForPatients.alterTablePatients();
// helperForPatients.deleteAllPatients();
// helperForPatients.addNewPatientsFromArray(helperForPatients.examplePatientsArray)
// helperForPatients.getAllPatients();
// helperForPatients.describePatientsTable()

