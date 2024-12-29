# Innovators Marketplace

## Overview
Innovators Marketplace is a web application that allows innovators to upload and sell their projects, and buyers to browse and purchase these projects.

## Features
- Upload projects with photos, videos, and detailed descriptions
- Browse projects on the home page
- View project details
- Responsive design

## Tech Stack
- Backend: Node.js, Express.js
- Database: MongoDB Atlas (Cloud Database)
- Frontend: HTML, CSS, JavaScript

## Prerequisites
- Node.js (v14 or later)
- MongoDB Atlas account

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/innovators-marketplace.git
cd innovators-marketplace
```

2. Install dependencies
```bash
npm install
```

3. Set up MongoDB Atlas
- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a new cluster
- Create a database user
- Get your connection string
- Whitelist your IP address in the Network Access section

4. Set up environment variables
- Create a `.env` file in the root directory
- Add the following variables:
  ```
  MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/innovators_marketplace?retryWrites=true&w=majority
  PORT=3000
  ```
- Replace `your_username`, `your_password`, and `your_cluster` with your MongoDB Atlas credentials

5. Start the application
```bash
# For development
npm run dev

# For production
npm start
```

## Project Structure
- `public/`: Frontend assets (HTML, CSS, JS)
- `src/`: Backend source code
  - `models/`: Database models
  - `routes/`: API routes
- `uploads/`: User-uploaded files
- `server.js`: Main server file

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is open-source. Please check the LICENSE file for details.
