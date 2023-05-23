# CaffeineKeeper

CaffeineKeeper is a coffee inventory management system inspired by the YouTube video [link to video](https://www.youtube.com/watch?v=Qh5Yug5paEs). It allows your guests to see the variety of coffee you have in your freezer and track the remaining quantity by clicking on the coffee name or scanning the QR code.

## Features

- Display a visual representation of your coffee collection stored in the freezer.
- Track the remaining quantity of each coffee by clicking on the coffee name or scanning the QR code.
- Manage and update the details of each coffee, such as roast date, storage date, roastery link, roast level, roast type, and tasting notes.
- Add new coffee entries to your inventory.
- Generate QR codes for each coffee for easy scanning.
- Responsive and user-friendly interface.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- EJS (Embedded JavaScript) Templating
- Bootstrap
- Canvas.js (for visual representation)
- Multer (for file uploads)
- qrcode (for generating QR codes)

## Getting Started

### Prerequisites

- Node.js

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Zlywilk/CaffeineKeeper.git
```
2. Install the dependencies:
```bash
cd CaffeineKeeper
npm install
```
3. Set up the environment variables:

- Rename the `.env.example` file to `.env`.
- Update the values in the `.env` file with your own configuration.

4. Start the server:
```bash
npm start
```
5. Access the application in your browser:
```
http://localhost:3000
```
## Usage

1. Open the application in your browser.
2. Add new coffee entries to your inventory by clicking on the "Add New Coffee" button.
3. Fill in the details of the coffee, including the name, roast date, storage date, roastery link, roast level, roast type, and tasting notes.
4. Submit the form to add the coffee to your inventory.
5. The coffee will be displayed in the inventory table with its visual representation.
6. To track the remaining quantity of a coffee, click on its name in the table or scan the QR code.
7. Update the remaining quantity as needed.
8. Manage and update the details of each coffee by clicking on the "Update" button next to the coffee entry.

Demo

Check out the live demo of CaffeineKeeper [here](https://caffeinekeeper.onrender.com/).

## TODO

- Implement Niimbot thermal printer integration for printing coffee details and QR codes.
- Enhance user experience (UX) by improving the user interface, adding search functionality, and implementing user authentication.

## License

This project is licensed under the [MIT License](LICENSE).
