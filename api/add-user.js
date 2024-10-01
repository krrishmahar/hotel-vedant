const express = require('express');
const cors = require('cors');
const { addBooking } = require('./appwrite');
const { default: mongoose } = require('mongoose');
const Bookings = require('./booking_db');


let conn = async () => {

    await mongoose.connect('mongodb://localhost:27017/Bookings').then(() => {
        console.log("Connected to MongoDB!");
    }).catch((err) => {
        console.error("Failed to connect to MongoDB:", err);
    });
}
conn()
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
    next();
});

app.get('/send', (req, res) => {
    // Create a new booking instance with the correct object structure
    const Booking = new Bookings({
        FirstName: "Krrish",
        LastName: "Mahar",
        Email: "krrishmahar@gmail.com",
        PhoneNo: 8454066177,
        RoomType: "deluxe",
        NumberOfGuests: 2,
        ArrivalDateTime: "5225-05-25T05:04",
        DepartureDateTime: "5225-05-25T05:04",
        IsAndraMahasabhaMember: false,
        AndraMahasabhaID: null,
        AndraMahasabhaPhoneNo: null,
        SpecialRequest: "good"
    });

    // Save the booking
    Booking.save()
        .then(() => {
            console.log(`Data has been stored for ${Booking.FirstName}`);
            res.send(`Booking stored for ${Booking.FirstName}`);
        })
        .catch((err) => {
            console.error("Error saving booking: ", err);
            res.status(500).send("Error saving booking.");
        });
});


app.get('/api/check', async (req, res) => {
    try {
        // Fetch all bookings
        let data = await Bookings.find();

        // If there's at least one booking, return the details of all bookings
        if (data.length > 0) {
            // Accumulate all booking details in an array
            const bookingDetails = data.map(booking => ({
                FirstName: booking.FirstName,
                LastName: booking.LastName,
                Email: booking.Email
            }));

            // Send all booking details as a response
            res.json(bookingDetails);
        } else {
            // If no bookings found, return a default response
            res.json({ message: "No bookings found" });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error });
    }
});

app.post('/api/add-user', async (req, res) => {
    // Extract data from request body
    const { 
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
    } = req.body;

    // Format the data to match Appwrite's requirements
    const bookingData = {
        FirstName: String(FirstName), // Ensure FirstName is a string
        LastName: String(LastName),   // Ensure LastName is a string
        Email: String(Email),         // Ensure Email is a string
        PhoneNo: String(PhoneNo),     // Ensure PhoneNo is a string
        RoomType: String(RoomType),   // Ensure RoomType is a string
        NumberOfGuests: Number(NumberOfGuests), // Ensure NumberOfGuests is a number
        ArrivalDateTime: String(ArrivalDateTime), // Ensure ArrivalDateTime is a string in the required format
        DepartureDateTime: String(DepartureDateTime), // Ensure DepartureDateTime is a string in the required format
        IsAndraMahasabhaMember: Boolean(IsAndraMahasabhaMember), // Ensure IsAndraMahasabhaMember is a boolean
        AndraMahasabhaID: AndraMahasabhaID === '' ? null : String(AndraMahasabhaID), // Ensure AndraMahasabhaID is a string or null
        AndraMahasabhaPhoneNo: AndraMahasabhaPhoneNo === '' ? null : String(AndraMahasabhaPhoneNo), // Ensure AndraMahasabhaPhoneNo is a string or null
        SpecialRequest: String(SpecialRequest) // Ensure SpecialRequest is a string
    };

    try {
        // Add the booking to Appwrite
        const response = await addBooking(bookingData);

        res.status(201).json({ bookingId: response.$id });
    } catch (error) {
        console.error('Error adding booking:', error);
        res.status(500).json({ message: 'Error adding booking', error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
