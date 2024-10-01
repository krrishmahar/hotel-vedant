const express = require('express');
const cors = require('cors');
const mysql = require('mysql2')
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(cors())
app.use(bodyParser.json());

const conn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'krrishmahar',
    database: 'Bookings',
    port: 3306
});

conn.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL');
});

// Middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
    next();
});

app.get('/api/send', (req, res) => {
    // Redirect the request to /api/add-user
    res.redirect(307, '/api/add-user');
});



// Fetch all users
app.get('/api/check', (req, res) => {
    const query = `select id, concat_ws(' ', FirstName, LastName) as 'full name', Email from bookings`;

    conn.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data from MySQL:', err);
            return res.status(500).json({ message: 'Error fetching users', error: err });
        }
        res.json(results);
    });
});

app.post('/api/add-user', async (req, res) => {
    // Extract data from request body
    const FirstName = req.headers['firstname'] || req.body.FirstName;
    const LastName = req.headers['lastname'] || req.body.LastName;
    const Email = req.headers['email'] || req.body.Email;
    const PhoneNo = req.headers['phoneno'] || req.body.PhoneNo;
    const RoomType = req.headers['roomtype'] || req.body.RoomType;
    const NumberOfGuests = req.headers['numberofguests'] || req.body.NumberOfGuests;
    const ArrivalDateTime = req.headers['arrivaldatetime'] || req.body.ArrivalDateTime;
    const DepartureDateTime = req.headers['departuredatetime'] || req.body.DepartureDateTime;
    const IsAndraMahasabhaMember = req.headers['isandramahasabhamember'] || req.body.IsAndraMahasabhaMember;
    const AndraMahasabhaID = req.headers['andramahasabhaid'] || req.body.AndraMahasabhaID;
    const AndraMahasabhaPhoneNo = req.headers['andramahasabhaphoneno'] || req.body.AndraMahasabhaPhoneNo;
    const SpecialRequest = req.headers['specialrequest'] || req.body.SpecialRequest;


    const insertQuery = `
    INSERT INTO Bookings 
    (FirstName, LastName, Email, PhoneNo, RoomType, NumberOfGuests, ArrivalDateTime, DepartureDateTime, IsAndraMahasabhaMember, AndraMahasabhaID, AndraMahasabhaPhoneNo, SpecialRequest)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`;

    const values = [
        FirstName,
        LastName,
        Email,
        PhoneNo,
        RoomType,
        NumberOfGuests,
        ArrivalDateTime,
        DepartureDateTime,
        IsAndraMahasabhaMember,
        AndraMahasabhaID,
        AndraMahasabhaPhoneNo,
        SpecialRequest
    ];


    conn.query(insertQuery, values, (err, results) => {
        if (err) {
            console.error('Error inserting booking:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        console.log('Booking inserted successfully with ID:', results.insertId);
        res.status(201).json({ bookingId: results.insertId });
    });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
