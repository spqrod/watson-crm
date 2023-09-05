const mysql = require("mysql2");
const dayjs = require("dayjs");
const csvtojson = require("csvtojson");
const bcrypt = require("bcrypt");
const { Logger } = require("winston");

const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE_NAME,
}).promise();

const dateFormatForDB = "YYYY-MM-DD";

const database = {

    getTakenTimeSlotsForDate: function(date) {
        const query = "select time from appointments where date=?"
        return pool.query(query, date).then(res => res[0]);
    },

    patients: {
        search(searchString) {
            const query = `select * from patients where concat(firstName, lastName, file, nrc, phone, insuranceId) like "%${searchString}%"`;
            return pool.query(query)
                .then(res => res[0])
        },
        addNew: function(patient) {
            const query = "insert into patients (firstName, lastName, file, nrc, phone, insuranceId, dateOfBirth, sex, marketing) values (?, ?, ?, ?, ?, ?, ?, ?, ?);";
            const array = [patient.firstName, patient.lastName, patient.file, patient.nrc, patient.phone, patient.insuranceId, patient.dateOfBirth, patient.sex, patient.marketing];
            return pool.query(query, array);
        },
        update: function(patient) {
            const query = "UPDATE patients SET firstName=?, lastName=?, file=?, nrc=?, phone=?, insuranceId=?, dateOfBirth=?, sex=?, marketing=? WHERE id = ?";
            const array = [patient.firstName, patient.lastName, patient.file, patient.nrc, patient.phone, patient.insuranceId, patient.dateOfBirth, patient.sex, patient.marketing, patient.id];
            return pool.query(query, array);
        },
        delete: function(id) {
            return pool.query("delete from patients where id=?", id);
        },
        getLastInserted() {
            const query = "select * from patients where id = (select last_insert_id())";
            return pool.query(query)
                .then(res => res[0][0]);
        }, 
    },
    
    appointments: {
        getForDate: function(date) {
            const query = "select id, date, time, firstName, lastName, doctor, treatment, payment, cost, patientFile, phone, comments, noshow from appointments where date=? order by time";
            return pool.query(query, date).then(res => res[0]);
        },
        search(searchString) {
            const query = `select * from appointments where concat(firstName, lastName, patientFile, doctor, treatment, phone) like "%${searchString}%" order by date, time`;
            return pool.query(query, [searchString])
                .then(res => res[0])
        },
        getForPatient(patientFile) {
            const query  = "select id, date, time, firstName, lastName, doctor, treatment, payment, cost, patientFile, phone, comments, noshow from appointments where patientFile = ? order by date, time";
            return pool.query(query, [patientFile]).then(res => res[0]);
        },
        addNew: function(appointment) {
            return pool.query("insert into appointments (date, time, firstName, lastName, doctor, treatment, payment, cost, patientFile, phone, comments) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", 
                [appointment.date, appointment.time, appointment.firstName, appointment.lastName, appointment.doctor, appointment.treatment, appointment.payment, appointment.cost, appointment.patientFile, appointment.phone, appointment.comments]);
        },
        update: function(appointment) {
            return pool.query("UPDATE appointments SET date=?, time=?, firstName=?, lastName=?, doctor=?, treatment=?, payment=?, cost=?, patientFile=?, phone=?, comments=?, noshow=? WHERE id = ?", 
                [appointment.date, appointment.time, appointment.firstName, appointment.lastName, appointment.doctor, appointment.treatment, appointment.payment, appointment.cost, appointment.patientFile, appointment.phone, appointment.comments, appointment.noshow, appointment.id]);
        },
        delete: function(id) {
            return pool.query("delete from appointments where id=?", id);
        },

    },

    users: {

        addNew(username, password) {
            bcrypt.hash(password, 10)
                .then(hashedPassword => {
                    const query = "insert into users (username, password) values (?, ?)";
                    pool.query(query, [username, hashedPassword]);
                })
                .catch(() => logger.info("Password was not hashed successfully"));
            },

        find(username) {
            const query = `select * from users where username=?`;
            return pool.query(query, [username]).then(res => res[0][0]);
        }

    },

    analytics: {
        countTreatment(treatment, month, year) {
            const query = "select count(treatment) from appointments where treatment=? and month(date)=? and year(date)=?";
            const params = [treatment, month, year];
            pool.query(query, params)
                .then(res => {
                    const key = Object.keys(res[0][0])[0];
                    const value = res[0][0][key];
                    console.log(`Number of treatments "${treatment}" for month ${month} of year ${year} is ${value}`);
                });
        },
        sum(payment, month, year) {
            const query = "select sum(cost) from appointments where payment=? and month(date)=? and year(date)=?"
            pool.query(query, [payment, month, year])
                .then(res => {
                    const key = Object.keys(res[0][0])[0];
                    const value = res[0][0][key];
                    console.log(`Total sum for ${payment} in month ${month} of ${year} is \n${Math.round(value)}`)
                });
        },
        countPatients(month, year) {
            // Need to count unique patientFile, so that if the same patient came 2 during the month, we will count it as 1
            const query = "select count(patientFile) from appointments where month(date)=? and year(date)=?";
            pool.query(query, [month, year]);
        },
        countPatientsForAge(minAge, maxAge, month, year) {
            // Need to make a join with patients on birthDate
            const query = "select * from appointments where month(date)=? and year(date)=?";
            const params = [minAge, maxAge, month, year];
            pool.query(query, params);
        },
    }
}

module.exports = { database };

// database.users.addNew("admin", "1234");

// database.analytics.countTreatment("Filling", 7, 2023);
// database.analytics.sum("Nhima", 8, 2023);



















let importedAppointmentsArray = [];

const databaseHelper = {
    appointments: {
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
            const csvFilePath = "./backupFromGoogleSheets/appointments.csv";
            csvtojson()
                .fromFile(csvFilePath)
                .then(appointmentsArray => appointmentsArray.forEach(appointment => {
                    if (appointment.date)
                        database.appointments.addNew(appointment);
                }));
        }
    },
    patients: {
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
            const csvFilePath = "./backupFromGoogleSheets/patients.csv";
            csvtojson()
                .fromFile(csvFilePath)
                .then(patientsArray => patientsArray.forEach(patient => {
                    if (patient.firstName)
                        if ((patient.dateOfBirth == "") || !dayjs(patient.dateOfBirth).isValid())
                            patient.dateOfBirth = "1000-01-01";
                        patient.dateOfBirth = dayjs(patient.dateOfBirth).format(dateFormatForDB);
                        database.patients.addNew(patient);
                }));
        }
    },
    users: {
        createTable() {
            const query = "create table users (id mediumint auto_increment not null primary key, username varchar(255) unique, password varchar(255) unique)";
            pool.query(query);
        },
        describeTable() {
            const query = "describe users";
            pool.query(query).then((res) => console.log(res[0]));
        },
        getAll() {
            const query = "select * from users";
            pool.query(query).then((res) => console.log(res[0]));
        },
        deleteAll() {
            const query = "delete from users";
            pool.query(query).then((res) => console.log(res[0]));
        }
    }
};

// databaseHelper.users.createTable();
// databaseHelper.users.describeTable();
// databaseHelper.users.getAll();
// databaseHelper.users.deleteAll();

// databaseHelper.appointments.importAppointmentsFromCSVFile()
// databaseHelper.appointments.createTable();
// databaseHelper.appointments.dropTable();
// databaseHelper.appointments.getAllAppointments();
// databaseHelper.appointments.deleteAllAppointments();
// databaseHelper.appointments.describeAppointmentsTable();
// databaseHelper.appointments.alterTableAppointments();

// databaseHelper.patients.createTablePatients();
// databaseHelper.patients.dropTable();
// databaseHelper.patients.alterTablePatients();
// databaseHelper.patients.deleteAllPatients();
// databaseHelper.patients.getAllPatients();
// databaseHelper.patients.describePatientsTable()
// databaseHelper.patients.importPatientsFromCSVFile();
