const express = require("express");
const cors = require("cors");
const app = express();
const { logger } = require("./logger.js");
require("dotenv").config();

const dayjs = require("dayjs");
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const { database } = require("./database.js");

app.use(express.static("build"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const port = 80;    

const timeSlotsForAppointments = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
];

app.use((req, res, next) => {
    logger.info(`Received a ${req.method} request for ${req.url}`);
    next();
});

app.get("/appointments/:selectedDate", (req, res) => {
    const { selectedDate } = req.params;
    database.getAppointmentsForDate(selectedDate).then(appointments => {
        converTimeFormatFromHHMMSSToHHMM(appointments);
        res.json(appointments);
    });

    function converTimeFormatFromHHMMSSToHHMM(appointments) {
        appointments.forEach(appointment => appointment.time = appointment.time.substring(0, 5));
    }
});

app.get("/time-slots/:selectedDate", (req, res) => {
    let { selectedDate } = req.params;
    selectedDate = dayjs(selectedDate).format(dateFormatForDB);

    function testIfDateEqualsSelectedDate(appointment) {
        return (appointment.date === selectedDate);
    }

    const appointments = exampleAppointmentsArray.filter(testIfDateEqualsSelectedDate);
    const takenTimeSlots = [];
    appointments.forEach(appointment => takenTimeSlots.push(appointment.time));
    let availableTimeSlots = [...timeSlotsForAppointments];
    takenTimeSlots.forEach(takenTimeSlot => {
        const index = availableTimeSlots.findIndex((timeSlot) => timeSlot == takenTimeSlot);
        availableTimeSlots.splice(index, 1);
    });
    res.json(availableTimeSlots);
});

// database.getAllAppointments().then(res => console.log(res[0]));










app.listen(port, () => console.log(`Listening to port ${port}`));














// TEMP
// const dateFormatForDB = "DD-MM-YYYY";
// const dateToday = dayjs().format(dateFormatForDB);
// const dateTomorrow = dayjs().add(1, "day").format(dateFormatForDB);
// const date1 = dayjs().add(2, "day").format(dateFormatForDB);
// const date2 = dayjs().add(3, "day").format(dateFormatForDB);
// const date3 = dayjs().add(4, "day").format(dateFormatForDB);

// const exampleAppointmentsArray = [
//     {
//         id: 0,
//         date: dateToday,
//         time: "10:30",
//         firstName: "John",
//         lastName: "Watson",
//         doctor: "Dr Watson",
//         procedure: "Scaling",
//         payment: "Nhima"
//     },
//     {
//         id: 1,
//         date: dateToday,
//         time: "11:30",
//         firstName: "Mark",
//         lastName: "Brown",
//         doctor: "Dr Watson",
//         procedure: "Extraction",
//         payment: "Cash"
//     },
//     {
//         id: 2,
//         date: dateToday,
//         time: "12:30",
//         firstName: "Leeroy",
//         lastName: "Hawking",
//         doctor: "Dr Watson",
//         procedure: "Scaling",
//         payment: "Cash"
//     },
//     {
//         id: 3,
//         date: dateTomorrow,
//         time: "13:30",
//         firstName: "Stephen",
//         lastName: "Jenkins",
//         doctor: "Dr Watson",
//         procedure: "Scaling",
//         payment: "Cash"
//     },
//     {
//         id: 4,
//         date: dateTomorrow,
//         time: "14:00",
//         firstName: "Lark",
//         lastName: "Hawking",
//         doctor: "Dr Watson",
//         procedure: "Scaling",
//         payment: "Cash"
//     },
//     {
//         id: 5,
//         date: dateTomorrow,
//         time: "15:00",
//         firstName: "Stephen",
//         lastName: "Downing",
//         doctor: "Dr Watson",
//         procedure: "Scaling",
//         payment: "Cash"
//     },
//     {
//         id: 6,
//         date: date1,
//         time: "15:30",
//         firstName: "Jessica",
//         lastName: "Hawking",
//         doctor: "Dr Watson",
//         procedure: "Scaling",
//         payment: "Cash"
//     },
//     {
//         id: 7,
//         date: date1,
//         time: "16:00",
//         firstName: "Chris",
//         lastName: "Brown",
//         doctor: "Dr Watson",
//         procedure: "Scaling",
//         payment: "Cash"
//     },
//     {
//         id: 8,
//         date: date1,
//         time: "16:30",
//         firstName: "Mark",
//         lastName: "Hawking",
//         doctor: "Dr Watson",
//         procedure: "Scaling",
//         payment: "Cash"
//     },
//     {
//         id: 9,
//         date: date2,
//         time: "16:30",
//         firstName: "Stephen",
//         lastName: "Hawking",
//         doctor: "Dr Watson",
//         procedure: "Scaling",
//         payment: "Cash"
//     },
//     {
//         id: 10,
//         date: date2,
//         time: "16:30",
//         firstName: "Facundo",
//         lastName: "Montana",
//         doctor: "Dr Watson",
//         procedure: "Scaling",
//         payment: "Nhima"
//     },
//     {
//         id: 11,
//         date: date2,
//         time: "16:30",
//         firstName: "Sergey",
//         lastName: "Brin",
//         doctor: "Dr Watson",
//         procedure: "Scaling",
//         payment: "Cash"
//     },
//     {
//         id: 12,
//         date: date3,
//         time: "16:30",
//         firstName: "Nikola",
//         lastName: "Tesla",
//         doctor: "Dr Watson",
//         procedure: "Whitening",
//         payment: "Cash"
//     },
//     {
//         id: 13,
//         date: date3,
//         time: "16:30",
//         firstName: "John",
//         lastName: "Kennedy",
//         doctor: "Dr Watson",
//         procedure: "Scaling",
//         payment: "Nhima"
//     },
//     {
//         id: 14,
//         date: date3,
//         time: "16:30",
//         firstName: "Donald",
//         lastName: "Ceasar",
//         doctor: "Dr Watson",
//         procedure: "Scaling",
//         payment: "Cash"
//     },

// ];