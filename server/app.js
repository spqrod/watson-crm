const express = require("express");
const cors = require("cors");
const app = express();
const { logger } = require("./logger.js");

app.use(express.static("build"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const port = 80;    

app.use((req, res, next) => {
    logger.info(`Received a ${req.method} request for ${req.url}`);
    next();
});

app.get("/appointments", (req, res) => {
    const appointments = exampleAppointmentsArray;
    res.json(appointments);
});

app.listen(port, () => console.log(`Listening to port ${port}`));

// TEMP

const date1 = new Date();

const exampleAppointmentsArray = [
    {
        id: 0,
        date: "02.03.2023",
        time: "10:30",
        firstName: "John",
        lastName: "Watson",
        doctor: "Dr Watson",
        procedure: "Scaling",
        payment: "Nhima"
    },
    {
        id: 1,
        date: "02.03.2023",
        time: "11:30",
        firstName: "Mark",
        lastName: "Brown",
        doctor: "Dr Watson",
        procedure: "Extraction",
        payment: "Cash"
    },
    {
        id: 2,
        date: "02.03.2023",
        time: "12:30",
        firstName: "Leeroy",
        lastName: "Hawking",
        doctor: "Dr Watson",
        procedure: "Scaling",
        payment: "Cash"
    },
    {
        id: 3,
        date: "02.03.2023",
        time: "13:30",
        firstName: "Stephen",
        lastName: "Jenkins",
        doctor: "Dr Watson",
        procedure: "Scaling",
        payment: "Cash"
    },
    {
        id: 4,
        date: "02.03.2023",
        time: "14:00",
        firstName: "Lark",
        lastName: "Hawking",
        doctor: "Dr Watson",
        procedure: "Scaling",
        payment: "Cash"
    },
    {
        id: 5,
        date: "02.03.2023",
        time: "15:00",
        firstName: "Stephen",
        lastName: "Downing",
        doctor: "Dr Watson",
        procedure: "Scaling",
        payment: "Cash"
    },
    {
        id: 6,
        date: "02.03.2023",
        time: "15:30",
        firstName: "Jessica",
        lastName: "Hawking",
        doctor: "Dr Watson",
        procedure: "Scaling",
        payment: "Cash"
    },
    {
        id: 7,
        date: "02.03.2023",
        time: "16:00",
        firstName: "Chris",
        lastName: "Brown",
        doctor: "Dr Watson",
        procedure: "Scaling",
        payment: "Cash"
    },
    {
        id: 8,
        date: "02.03.2023",
        time: "16:30",
        firstName: "Mark",
        lastName: "Hawking",
        doctor: "Dr Watson",
        procedure: "Scaling",
        payment: "Cash"
    },
    {
        id: 9,
        date: "02.03.2023",
        time: "16:30",
        firstName: "Stephen",
        lastName: "Hawking",
        doctor: "Dr Watson",
        procedure: "Scaling",
        payment: "Cash"
    },
    {
        id: 10,
        date: "02.03.2023",
        time: "16:30",
        firstName: "Facundo",
        lastName: "Montana",
        doctor: "Dr Watson",
        procedure: "Scaling",
        payment: "Nhima"
    },
    {
        id: 11,
        date: "02.03.2023",
        time: "16:30",
        firstName: "Sergey",
        lastName: "Brin",
        doctor: "Dr Watson",
        procedure: "Scaling",
        payment: "Cash"
    },
    {
        id: 12,
        date: "02.03.2023",
        time: "16:30",
        firstName: "Nikola",
        lastName: "Tesla",
        doctor: "Dr Watson",
        procedure: "Whitening",
        payment: "Cash"
    },
    {
        id: 13,
        date: "02.03.2023",
        time: "16:30",
        firstName: "John",
        lastName: "Kennedy",
        doctor: "Dr Watson",
        procedure: "Scaling",
        payment: "Nhima"
    },
    {
        id: 14,
        date: "02.03.2023",
        time: "16:30",
        firstName: "Donald",
        lastName: "Ceasar",
        doctor: "Dr Watson",
        procedure: "Scaling",
        payment: "Cash"
    },

];