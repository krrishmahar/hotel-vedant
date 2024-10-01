require('dotenv').config();
const sdk = require('node-appwrite');

// Initialize Appwrite client
const client = new sdk.Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('66ef090300323d46d84d')
    .setKey(process.env.APPWRITE_API_KEY);
const databaseId = '66ef09870009d9ec5ccd'; // Replace with your actual Database ID
const collectionId = '66ef0bdc0008f7a24c18'; // Replace with your actual Collection ID

const databases = new sdk.Databases(client);

// Function to add a new booking
async function addBooking(data) {
    try {
        const response = await databases.createDocument(
            databaseId,
            collectionId,
            'unique()', // Document ID
            data
        );
        return response;
    } catch (error) {
        console.error('Error adding booking:', error);
        throw error;
    }
}

module.exports = { addBooking };
