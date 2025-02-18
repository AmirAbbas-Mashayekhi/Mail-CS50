# CS50W Mail Project

A comprehensive single-page mail client application developed as part of Harvard’s CS50 Web Programming (CS50W) course. This project simulates a full-featured email system where users register, log in, compose, and manage emails entirely through a dynamic, JavaScript-powered interface. All email data is stored locally in the database, and interactions are handled through a pre-built API.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Understanding the Project](#understanding-the-project)
- [API Overview](#api-overview)
- [Project Specification](#project-specification)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Repository](#repository)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Overview

The CS50W Mail Project is a single-page web application that replicates an email client. It allows users to register, log in, and access a mail dashboard where they can view their Inbox, Sent, and Archive mailboxes. Users can compose new emails, view detailed email content, reply to messages, and manage their emails—all without reloading the page.

## Getting Started

1. **Download and Unzip:**
   - Download the distribution code from:  
     [CS50W Mail Distribution](https://cdn.cs50.net/web/2020/spring/projects/3/mail.zip)
   - Unzip the file to extract the project.

2. **Navigate to the Project Directory:**
   ```bash
   cd mail
   ```

3. **Apply Migrations:**
   - Create migrations for the mail app:
     ```bash
     python manage.py makemigrations mail
     ```
   - Apply migrations to update your database:
     ```bash
     python manage.py migrate
     ```

4. **Run the Development Server:**
   ```bash
   python manage.py runserver
   ```
   - Open your browser and visit `http://localhost:8000`.

## Understanding the Project

This project is built as a single-page application where all interactions—navigating between mailboxes, composing emails, and viewing email details—are controlled via JavaScript. The default route loads the Inbox view, which includes sections for displaying emails and a form for composing new messages. Navigation buttons dynamically show or hide different views, ensuring that users experience seamless transitions without full page reloads.

## API Overview

The project uses a set of pre-built API routes to manage emails:
- **GET /emails/<mailbox>:**  
  Retrieves a list of emails in the specified mailbox (inbox, sent, or archive) in reverse chronological order.
- **GET /emails/<email_id>:**  
  Returns detailed information for a specific email.
- **POST /emails:**  
  Sends an email by accepting a JSON payload with recipients, subject, and body.
- **PUT /emails/<email_id>:**  
  Updates an email’s status (e.g., marking it as read or archived).

These endpoints are integrated with the JavaScript code to provide a dynamic, responsive user interface.

## Project Specification

The project requirements include:
- Building a single-page application using HTML, CSS, and JavaScript.
- Implementing dynamic view switching between Inbox, Sent, and Archive mailboxes.
- Enabling users to compose, send, and view emails via API interactions.
- Providing functionality for archiving/unarchiving emails and replying with pre-filled email fields.
- Ensuring all email operations are handled using the provided API routes.

## Usage

- **Registration & Login:**  
  Create a new account using the “Register” link. Credentials need not be real.
- **Navigating Mailboxes:**  
  Upon logging in, users are directed to the Inbox. Use navigation buttons to switch between Inbox, Sent, and Archive.
- **Composing Emails:**  
  Click “Compose” to open a blank email form. After filling in recipient(s), subject, and body, submit the form to send an email.
- **Viewing & Managing Emails:**  
  Click on any email to view its details. Options to mark as read, archive, or reply are provided for managing emails.

## Troubleshooting

- **Server Issues:**  
  If the application isn’t running as expected, ensure all migrations have been applied and verify your database settings.
- **JavaScript Errors:**  
  Check your browser’s console for errors if dynamic view switching or API calls do not function correctly.
- **Docker (if applicable):**  
  If using Docker, try restarting containers:
  ```bash
  docker-compose down
  docker-compose up --build
  ```

## Repository

View the complete source code at:  
[CS50W Mail Project Repository](https://github.com/AmirAbbas-Mashayekhi/Mail-CS50)

## Contributing

Contributions are welcome! Fork the repository and submit pull requests for enhancements or bug fixes. For significant changes, please open an issue first to discuss your proposed modifications.

## License

This project is open-source and available under the [MIT License](LICENSE).

## Acknowledgments

- **CS50 Web Programming Course:**  
  Thanks to Harvard’s CS50 for providing the project framework and guidelines.
- **Django Community:**  
  Appreciation for the tools and libraries that made this project possible.
- **Project Mentors and Peers:**  
  Special thanks to everyone who provided feedback and support during development.
