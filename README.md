# CA 2 College API Project

### Live Demo:
https://college.connormattless.com/

### Description

This project is a web application created for Front End Development CA 2. It's built using React, React-Router, DaisyUI, Tailwind CSS, Jest, Node, and Vite for efficient project bundling and development.

## Features

- **Course Management:** Manage courses, including creation, editing, and deletion of course details.
- **Enrollment Management:** Manage enrollments, including creation, editing, and deletion of enrollment details.
- **Lecturer Profiles:** Manage lecturer profiles, including their personal details and associated courses.
- **Responsive Design:** Created with DaisyUI and Tailwind, the UI is responsive, scaling to accommodate different screen sizes.
- **Error Handling:** If a user encounters an error with the application, the error is handled elegantly and with good, visual user feedback.
- **Sorting:** Enrollments can be sorted by the alphabetical order of the associated lecturer
- **Pagination:** Lecturer and Enrollment indexes have pagination for improved user experience 
- **Dynamic Interaction:** Interactive components for a smooth and dynamic user experience.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following tools installed:

- [Node.js](https://nodejs.org/en/) (which comes with [npm](http://npmjs.com))
- [Git](https://git-scm.com)

### Installation

Follow these simple steps to get your development environment running:

1. **Clone the GitHub Repository**

   ```bash
   git clone https://github.com/ConnaaaaR/FE_CA2_COLLEGE
   cd CA2-College-API-Project
   ```

2. **Install Dependencies**

   While in the project directory, run the following command to install the necessary dependencies:

   ```bash
   npm i
   ```

3. **Start the Development Server**

   To start the development server and view the project in your browser, run:

   ```bash
   npm run dev
   ```

   Once the server is running, open your browser and navigate to `http://localhost:3000`.

### Building for Production

To build the application for production, run the following command:

```bash
npm run build
```

This will create a `dist` folder with all the assets compiled and optimized for deployment.

### Running Tests
To run the tests included in this application, run the following command in the terminal

```bash
npm run test
```
This will run jest and begin the test suites.
