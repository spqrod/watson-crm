const express = require("express");
const cors = require("cors");
const app = express();
const { logger } = require("./logger.js");
require("dotenv").config();

const dayjs = require("dayjs");
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const { database } = require("./database.js");
const { sanitizeString } = require("./sanitizeString.js");

app.use(express.static("build"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const port = 80;    

const dateFormatForDB = "YYYY-MM-DD";

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

function convertTimeFormatFromHHMMSSToHHMM(time) {
    return time.substring(0, 5);
};

function convertDateFormatToDDMMYYYY(date) {
    return dayjs(date).format("DD.MM.YYYY");
};

app.use((req, res, next) => {
    logger.info(`Received a ${req.method} request for ${req.url}`);
    next();
});




app.get("/appointments/", (req, res) => {
    if (req.query.date) {
        const date = sanitizeString(req.query.date);
        database.getAppointmentsForDate(date)
            .then(appointments => {
                appointments.forEach(appointment => appointment.time = convertTimeFormatFromHHMMSSToHHMM(appointment.time));
                res.json(appointments);
            });
    } else if (req.query.patientFile) {
        const patientFile = decodeURIComponent(req.query.patientFile);
        database.getAppointmentsForPatient(patientFile)
            .then(appointments => {
                appointments.forEach(appointment => {
                    appointment.time = convertTimeFormatFromHHMMSSToHHMM(appointment.time);
                    // appointment.date = convertDateFormatToDDMMYYYY(appointment.date);
                });
                res.json(appointments);
            });        
    }
    else {
        res.json(req.query.searchString);
    }
});

app.post("/appointments", (req, res) => {
    for (const [key, value] of Object.entries(req.body)) {
        if (typeof req.body[key] != "boolean")
            req.body[key] = sanitizeString(String(value));    
        }
    const appointment = req.body;
    database.addNewAppointment(appointment)
        .then((result) => res.json({ success: true }))
        .catch(error => {
            logger.info(error);
            res.json({success: false});
        });
});

app.put("/appointments/", (req, res) => {
    for (const [key, value] of Object.entries(req.body)) {
        if (typeof req.body[key] !== "boolean")
            req.body[key] = sanitizeString(String(value));
    }
    const appointment = req.body;
    database.updateAppointment(appointment)
        .then(() => {
            res.json({success: true});
        })
        .catch(error => {
            logger.info(error);
            res.json({success: false});
        });
});

app.delete("/appointments/:id", (req, res) => {
    let { id } = req.params;
    id = sanitizeString(id);
    database.deleteAppointment(id)
        .then(() => res.json({ success: true }))
        .catch((error) => {
            logger.info(error);
            res.json({ success: false });
        });
});
    





app.get("/taken-time-slots/:selectedDate", (req, res) => {
    let { selectedDate } = req.params;
    selectedDate = dayjs(selectedDate).format(dateFormatForDB);
    let takenTimeSlots = [];

    database.getTakenTimeSlotsForDate(selectedDate).then(timeSlots => {
        timeSlots.forEach(item => takenTimeSlots.push(convertTimeFormatFromHHMMSSToHHMM(item.time)))
        let availableTimeSlots = [...timeSlotsForAppointments];

        takenTimeSlots.forEach(takenTimeSlot => {
            const index = availableTimeSlots.findIndex((availableTimeSlot) => availableTimeSlot == takenTimeSlot);
            availableTimeSlots.splice(index, 1);
        });

        res.json(availableTimeSlots);
    });
});



app.get("/patients/:searchString", (req, res) => {
    let { searchString } = req.params;
    searchString = sanitizeString(searchString);
    database.getPatients(searchString)
        .then(response => {
            const patients = response;
            res.json(patients);
        })
        .catch(error => logger.info(error));
});

app.post("/patients", (req, res) => {
    for (const [key, value] of Object.entries(req.body)) {
        if ((typeof req.body[key] != "boolean") && (typeof req.body[key] != "number") && (req.body[key] != null))
            req.body[key] = sanitizeString(String(value));    
        }
    const patient = req.body;
    database.addNewPatient(patient)
        .then(() => database.getLastInsertedPatient())
        .then((lastInsertedPatient) => res.json(lastInsertedPatient))
        .catch(error => {
            logger.info(error);
            res.json({success: false});
        });
});

app.put("/patients/", (req, res) => {
    for (const [key, value] of Object.entries(req.body)) {
        if (value !== null)
            req.body[key] = sanitizeString(String(value));
    }
    const patient = req.body;
    database.updatePatient(patient)
        .then(() => {
            res.json({success: true});
        })
        .catch(error => {
            logger.info(error);
            res.json({success: false});
        });
});

app.delete("/patients/:id", (req, res) => {
    let id = req.params.id;
    id = sanitizeString(id);
    database.deletePatient(id)
        .then(() => res.json({ success: true }))
        .catch(error => {
            logger.info(error);
            res.json({ success: false });
        });
});










app.listen(port, () => logger.info(`Listening to port ${port}`));














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