const express = require("express");
const cors = require("cors");
const app = express();
const { logger } = require("./logger.js");

const dayjs = require("dayjs");
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

app.use(express.static("build"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const port = 80;    

app.use((req, res, next) => {
    logger.info(`Received a ${req.method} request for ${req.url}`);
    next();
});

app.get("/appointments/:selectedDate", (req, res) => {
    const { selectedDate } = req.params;
    function testIfDateEqualsSelectedDate(appointment) {
        return (appointment.date === selectedDate);
    }
    const appointments = exampleAppointmentsArray.filter(testIfDateEqualsSelectedDate);
    res.json(appointments);
});

app.listen(port, () => console.log(`Listening to port ${port}`));

// TEMP
const dateFormat = "DD-MM-YYYY";
const dateToday = dayjs().format(dateFormat);
const dateTomorrow = dayjs("20-08-2023", dateFormat).format(dateFormat);
const date1 = dayjs("20-08-2023", dateFormat).format(dateFormat);
const date2 = dayjs("21-08-2023", dateFormat).format(dateFormat);
console.log(date1);

const exampleAppointmentsArray = [
    {
        id: 0,
        date: dateToday,
        time: "10:30",
        firstName: "John",
        lastName: "Watson",
        doctor: "Dr Watson",
        procedure: "Scaling",
        payment: "Nhima"
    },
    {
        id: 1,
        date: dateToday,
        time: "11:30",
        firstName: "Mark",
        lastName: "Brown",
        doctor: "Dr Watson",
        procedure: "Extraction",
        payment: "Cash"
    },
    {
        id: 2,
        date: date1,
        time: "12:30",
        firstName: "Leeroy",
        lastName: "Hawking",
        doctor: "Dr Watson",
        procedure: "Scaling",
        payment: "Cash"
    },
    {
        id: 3,
        date: date1,
        time: "13:30",
        firstName: "Stephen",
        lastName: "Jenkins",
        doctor: "Dr Watson",
        procedure: "Scaling",
        payment: "Cash"
    },
    {
        id: 4,
        date: date1,
        time: "14:00",
        firstName: "Lark",
        lastName: "Hawking",
        doctor: "Dr Watson",
        procedure: "Scaling",
        payment: "Cash"
    },
    {
        id: 5,
        date: date1,
        time: "15:00",
        firstName: "Stephen",
        lastName: "Downing",
        doctor: "Dr Watson",
        procedure: "Scaling",
        payment: "Cash"
    },
    {
        id: 6,
        date: date1,
        time: "15:30",
        firstName: "Jessica",
        lastName: "Hawking",
        doctor: "Dr Watson",
        procedure: "Scaling",
        payment: "Cash"
    },
    {
        id: 7,
        date: date1,
        time: "16:00",
        firstName: "Chris",
        lastName: "Brown",
        doctor: "Dr Watson",
        procedure: "Scaling",
        payment: "Cash"
    },
    {
        id: 8,
        date: date2,
        time: "16:30",
        firstName: "Mark",
        lastName: "Hawking",
        doctor: "Dr Watson",
        procedure: "Scaling",
        payment: "Cash"
    },
    {
        id: 9,
        date: date2,
        time: "16:30",
        firstName: "Stephen",
        lastName: "Hawking",
        doctor: "Dr Watson",
        procedure: "Scaling",
        payment: "Cash"
    },
    {
        id: 10,
        date: date2,
        time: "16:30",
        firstName: "Facundo",
        lastName: "Montana",
        doctor: "Dr Watson",
        procedure: "Scaling",
        payment: "Nhima"
    },
    {
        id: 11,
        date: date2,
        time: "16:30",
        firstName: "Sergey",
        lastName: "Brin",
        doctor: "Dr Watson",
        procedure: "Scaling",
        payment: "Cash"
    },
    {
        id: 12,
        date: date2,
        time: "16:30",
        firstName: "Nikola",
        lastName: "Tesla",
        doctor: "Dr Watson",
        procedure: "Whitening",
        payment: "Cash"
    },
    {
        id: 13,
        date: date2,
        time: "16:30",
        firstName: "John",
        lastName: "Kennedy",
        doctor: "Dr Watson",
        procedure: "Scaling",
        payment: "Nhima"
    },
    {
        id: 14,
        date: date2,
        time: "16:30",
        firstName: "Donald",
        lastName: "Ceasar",
        doctor: "Dr Watson",
        procedure: "Scaling",
        payment: "Cash"
    },

];