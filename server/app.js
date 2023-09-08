const express = require("express");
const cors = require("cors");
const app = express();
const { logger } = require("./logger.js");
require("dotenv").config();
const dayjs = require("dayjs");
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { database } = require("./database.js");
const { sanitizeString } = require("./sanitizeString.js");
const authorizeToken = require("./authorizeToken.js");

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
        database.appointments.getForDate(date)
            .then(appointments => {
                appointments.forEach(appointment => appointment.time = convertTimeFormatFromHHMMSSToHHMM(appointment.time));
                res.json(appointments);
            });
    } else if (req.query.patientFile) {
        const patientFile = decodeURIComponent(req.query.patientFile);
        database.appointments.getForPatient(patientFile)
            .then(appointments => {
                appointments.forEach(appointment => {
                    appointment.time = convertTimeFormatFromHHMMSSToHHMM(appointment.time);
                });
                res.json(appointments);
            });        
    }
    else {
        const searchString = sanitizeString(req.query.searchString);
        database.appointments.search(searchString)
            .then(appointments => {
                appointments.forEach(appointment => {
                    appointment.time = convertTimeFormatFromHHMMSSToHHMM(appointment.time);
                });
                res.json(appointments)
            })
            .catch(error => logger.info(error));
    }
});

app.post("/appointments", (req, res) => {
    for (const [key, value] of Object.entries(req.body)) {
        if (typeof req.body[key] != "boolean")
            req.body[key] = sanitizeString(String(value));    
        }
    const appointment = req.body;
    database.appointments.addNew(appointment)
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
    database.appointments.update(appointment)
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
    database.appointments.delete(id)
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
        timeSlots.forEach(item => takenTimeSlots.push(convertTimeFormatFromHHMMSSToHHMM(item.time)));
        res.json(takenTimeSlots);
    });
});

app.get("/patients/:searchString", (req, res) => {
    let searchString = req.params.searchString;
    searchString = decodeURIComponent(searchString);
    searchString = sanitizeString(searchString);
    database.patients.search(searchString)
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
        .then(() => database.patients.getLastInserted())
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
    database.patients.update(patient)
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
    database.patients.delete(id)
        .then(() => res.json({ success: true }))
        .catch(error => {
            logger.info(error);
            res.json({ success: false });
        });
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    database.users.find(username)
        .then(response => {
            if (response)
                return bcrypt.compare(password, response.password);
            else 
                res.send("User does not exist");
        })
        .then(passwordCheck => {
            if (passwordCheck) {
                const token = jwt.sign(username, process.env.ACCESS_TOKEN_SECRET);
                res.send({ token: token });
            }
            else 
                res.sendStatus(403);
        })
        .catch(response => res.send("SOMETHING WENT WRONG"));
});

app.post("/test", authorizeToken, (req, res) => {
    res.send(req.username);
});

app.listen(port, () => logger.info(`Listening to port ${port}`));