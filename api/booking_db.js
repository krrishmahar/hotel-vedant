const mongoose = require('mongoose');

// Define schema
const bookingSchema = new mongoose.Schema({
    FirstName: String,
    LastName: String,
    Email: String,
    PhoneNo: Number,
    RoomType: String,
    NumberOfGuests: Number,
    ArrivalDateTime: String,
    DepartureDateTime: String,
    IsAndraMahasabhaMember: Boolean,
    AndraMahasabhaID: Number,
    AndraMahasabhaPhoneNo: Number,
    SpecialRequest: String
});

// Correct mongoose.model call
const Bookings = mongoose.model('Bookings', bookingSchema);

module.exports = Bookings;
