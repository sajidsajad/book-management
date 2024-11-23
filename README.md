# 📚 Book Management Backend Application

This is the backend API for the **Book Management Application**, built with **Node.js** and **Express**. It provides endpoints for managing books, user authentication, and reviews, along with search functionalities.

---

## 🚀 **Features**
- **User Authentication**: Secure sign-up and login using **JWT**.
- **CRUD for Books**: Add, update, delete, and search books.
- **Book Reviews**: Add, edit, and delete reviews for books.
- **Image Upload Support**: Easily integrate **Cloudinary** for book cover uploads.
- **Testing**: Unit and integration tests using **Jest** and **Supertest**.

---

## 🛠️ **Installation**
### 1. **Clone the Repository**
```bash
git clone https://github.com/sajidsajad/book-management.git
cd book-management
```

### 2. **Install Dependencies**
```bash
Make sure npm and node is installed and then run 
npm install

and that will install following packages:
express: Web framework for building the API.
sequelize: ORM for interacting with the database.
pg and pg-hstore: PostgreSQL driver and utility for Sequelize.
bcrypt: Library for hashing passwords.
jsonwebtoken: For generating JWT tokens for authentication.
body-parser: Middleware for parsing incoming request bodies.
cors: Middleware for enabling Cross-Origin Request Sharing.
dotenv: For loading environment variables from a .env file.
multer, multer-storage-cloudinary, and cloudinary: Libraries for handling file uploads and storing them on Cloudinary.
jest, supertest, and sequelize-test-helpers: Libraries for unit and integration testing.
sequelize-cli: Command-line tool for managing Sequelize migrations and models.

#you can also install manually:-
npm install express sequelize pg pg-hstore bcrypt jsonwebtoken body-parser cors dotenv multer multer-storage-cloudinary cloudinary --save-dev 
npm install jest supertest sequelize-test-helpers sequelize-cli --save-dev

```

### 3. **your .env file**
```bash
Your env file must be like this:
PORT=5000
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_secret_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

Replace it with your values
```
### 4. **Start the application**
```bash
use Node: Run node app.js
node: Starts the server but does not watch for file changes.

Or

use Nodemon: Run nodemon app.js
nodemon: Starts the server and watches for changes in the source code, automatically restarting the server when necessary.
```

### 4. **Endpoints Summary**


| Method | Endpoint                     | Description                               |
|--------|------------------------------|-------------------------------------------|
| POST   | `/api/users/register`          | Sign up a new user                       |
| POST   | `/api/users/login`           | Log in and get a token                   |
| POST   | `/api/books`                 | Add a new book (Authenticated)           |
| PUT    | `/api/books/:id`             | Update a book (Authenticated)            |
| DELETE | `/api/books/:id`             | Delete a book (Authenticated)            |
| GET    | `/api/books/search`          | Search for books by title, author, or ISBN|
| POST   | `/api/reviews`               | Add a review for a book (Authenticated)  |
| PUT    | `/api/reviews/:id`           | Edit a review (Authenticated)            |
| DELETE | `/api/reviews/:id`           | Delete a review (Authenticated)          |
| GET    | `/api/reviews/book/:bookId`  | Get all reviews for a book               |
| GET    | `/api/reviews/:bookId`       | Get all reviews for book by User (Authenticated) |


