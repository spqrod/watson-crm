const mysql = require("mysql2");
const dayjs = require("dayjs");
const csvtojson = require("csvtojson");

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
        const query = `select * from appointments where concat(firstName, lastName, patientFile, doctor, treatment, phone) like "%${searchString}%" order by date, time`;
        return pool.query(query, [searchString])
            .then(res => res[0])
    },
    getAppointmentsForPatient(patientFile) {
        const query  = "select id, date, time, firstName, lastName, doctor, treatment, payment, cost, patientFile, phone, comments, noshow from appointments where patientFile = ? order by date, time";
        return pool.query(query, [patientFile]).then(res => res[0]);
    },
    addNewAppointment: function(appointment) {
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


    getTakenTimeSlotsForDate: function(date) {
        const query = "select time from appointments where date=?"
        return pool.query(query, date).then(res => res[0]);
    },

    getPatients(searchString) {
        const query = `select * from patients where concat(firstName, lastName, file, nrc, phone, insuranceId) like "%${searchString}%"`;
        return pool.query(query)
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














let importedAppointmentsArray = [];

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
    dropTable() {
        const query = "drop table appointments";
        pool.query(query);
    },
    importAppointmentsFromCSVFile() {
        const csvFilePath = "appointments.csv";
        csvtojson()
            .fromFile(csvFilePath)
            .then(appointmentsArray => appointmentsArray.forEach(appointment => {
                if (appointment.date)
                    database.addNewAppointment(appointment);
            }));
    }
};

// helperForAppointments.importAppointmentsFromCSVFile()
// helperForAppointments.createTable();
// helperForAppointments.dropTable();
// helperForAppointments.getAllAppointments();
// helperForAppointments.deleteAllAppointments();
// helperForAppointments.describeAppointmentsTable();
// helperForAppointments.alterTableAppointments();







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
    importPatientsFromCSVFile() {
        const csvFilePath = "patients.csv";
        csvtojson()
            .fromFile(csvFilePath)
            .then(patientsArray => patientsArray.forEach(patient => {
                if (patient.firstName)
                    if ((patient.dateOfBirth == "") || !dayjs(patient.dateOfBirth).isValid())
                        patient.dateOfBirth = "1000-01-01";
                    patient.dateOfBirth = dayjs(patient.dateOfBirth).format(dateFormatForDB);
                    database.addNewPatient(patient);
            }));
    }
};

// helperForPatients.createTablePatients();
// helperForPatients.dropTable();
// helperForPatients.alterTablePatients();
// helperForPatients.deleteAllPatients();
// helperForPatients.getAllPatients();
// helperForPatients.describePatientsTable()
// helperForPatients.importPatientsFromCSVFile();


