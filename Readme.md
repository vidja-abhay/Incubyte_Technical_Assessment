# Library Management System - TDD

The Library Management System is a comprehensive application built using Node.js, Express.js, and MongoDB. This system manages the operations of a library by providing functionality to add users, manage book inventory, issue books to users, and handle the return of borrowed books. The project also includes thorough unit testing using the Vitest framework to ensure the robustness of the application.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
  - [Add User](#add-user)
  - [Add Book](#add-book)
  - [Borrow/Issue Book](#borrowissue-book)
  - [Return Book](#return-book)
- [Testing](#testing)
- [Contributing](#contributing)

## Features

- **User Management**: 
  - Add new users to the system.
  - Maintain user records, including user details and borrowed book history.
  
- **Book Management**: 
  - Add new books to the library collection by authorized personnel (librarian or others).
  - Maintain records of all books in the library, including details such as title, author, ISBN, and availability status.

- **Borrow/Issue Books**:
  - Issue books to users, updating the book's availability status and logging the transaction in the user's borrowing history.
  
- **Return Books**:
  - Process the return of books, updating the book's availability status and closing the transaction in the user's borrowing history.

## Tech Stack

- **Node.js**: JavaScript runtime environment that executes JavaScript code outside a web browser.
- **Express.js**: A fast, unopinionated, minimalist web framework for Node.js, used to build the API endpoints.
- **MongoDB**: A NoSQL database program that uses JSON-like documents with optional schemas to store user and book data.
- **Vitest**: A blazing-fast unit testing framework used for testing the functionalities of the system.

## Installation

To run this project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vidja-abhay/Incubyte_Technical_Assessment.git

2. **Navigate to the project directory**:

  ```bash
  cd library-management-system
  ```

3. **Install dependencies**:
```bash
npm install
```
4. **Set up the environment variables**:

  - Create a .env file in the root directory of the project.
  - Add your MongoDB connection string and any other required environment variables:
  ```bash
  MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

## API Endpoints

The Library Management System provides several RESTful API endpoints to interact with the system. Below is a detailed list of available endpoints:

### Add User

- **Endpoint**: POST /api/user/addUser
- **Description**: Adds a new user to the library system.
- **Request Body**:
```bash
{
  "user_id" : 1,
  "user_name" : "Abhay Vidja"
}
```

### Add Book

- **Endpoint**: POST /api/books/add-book
- **Description**: Adds a new book to the library collection by a librarian or authorized person.
- **Request Body**:
```bash
{
  "ISBN" : "001",
  "title" : "Ramcharitmanas",
  "author" : "Tulsi Shyam",
  "publication_year" : 1900,
  "person_id" : "66d2969e4c5b11fb171463eb"
}
```

### Borrow/Issue Book
- **Endpoint**: POST /api/user/issued-book
- **Description**: Issues a book to a user, marking it as borrowed.
- **Request Body**:
```bash
{
 "userId" : "66d2a78981026106f3782270",
 "bookId" : "66d295419736a2aaa9be4cdb"
}
```

### Return Book
- **Endpoint**: POST /api/user/return-book
- **Description**: Processes the return of a borrowed book.
- **Request Body**:
```bash
{
 "userId" : "66d2a78981026106f3782270",
 "bookId" : "66d295419736a2aaa9be4cdb"
}
```

## Testing

Unit tests for the Library Management System are written using the Vitest framework. These tests ensure that the various features of the system work as expected.

To run the tests, use the following command:

```bash
npm test
```

**Test coverage includes**:

- User management functions (e.g., adding users).
- Book management functions (e.g., adding books, issuing books, returning books).
- Error handling and validation.

## Testing Summary

### User Management Tests

#### Add User
- **Scenario:** Verify that a new user can be added successfully.
- **Test Case:** When a valid user ID and name are provided, the user should be added to the system, and the response should indicate success.
- **Edge Case:** Test for duplicate user ID to ensure the system prevents adding users with the same ID.

### Book Management Tests

#### Add Book
- **Scenario:** Ensure that authorized personnel can add new books to the system.
- **Test Case:** When a valid ISBN, title, author, and person ID are provided, the book should be added to the library, and the response should indicate success.
- **Edge Case:** Test for duplicate ISBN to ensure the system does not allow adding the same book multiple times.

### Borrow/Issue Book Tests

#### Issue Book
- **Scenario:** Validate that a book can be issued to a user.
- **Test Case:** When a valid user ID and book ID are provided, the book's availability status should change to borrowed, and the transaction should be logged in the user's borrowing history.
- **Edge Case:** Test issuing a book that is already borrowed to ensure the system prevents double issuance.

### Return Book Tests

#### Return Book
- **Scenario:** Confirm that the system processes the return of a borrowed book.
- **Test Case:** When a valid user ID and book ID are provided, the book's availability status should change to available, and the transaction should be closed in the user's borrowing history.
- **Edge Case:** Test returning a book that was not borrowed by the user to ensure the system handles this error correctly.

### Error Handling & Validation Tests
- **Scenario:** Ensure that the system handles invalid inputs and other errors correctly.
- **Test Case:** Test various scenarios with missing or incorrect data (e.g., missing user ID, invalid book ID) to verify that the system returns appropriate error messages and does not process the request.

## Tools & Frameworks

- **Vitest:** All tests are written and executed using the Vitest testing framework, which is known for its speed and simplicity.


### Test Code Example

![incubyte](https://github.com/user-attachments/assets/a3522e5e-be12-4223-a995-2513716e975c)

## Contributing

Contributions to the project are welcome! If you have any suggestions, find a bug, or want to contribute code, please open an issue or submit a pull request. Contributions will be reviewed and merged if they meet the project’s standards.