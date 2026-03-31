# Parking Reviewer — Term Project To-Do List
**Class:** CIS 4004 | **Due:** Monday, April 5, 2026

---

## About
A MERN-stack localhost app where users submit and review badly-parked cars. The public can browse all submissions without logging in. Logged-in users can submit cars, comment on others' submissions, and upvote/downvote. Admins have full CRUD over everything.

---

## Data Model (6 Entities)

| Entity | Key Fields |
|---|---|
| **User** | `username`, `password`, `role (admin\|user)` |
| **CarSubmission** | `licensePlate` , `make` , `model`, `image`, `submittedBy (→ User)`|
| **Comment** | `userId (→ User)`, `carId (→ CarSubmission)`, `text`|
| **Violation** | `name` (e.g. "Double Parked", "Blocking Hydrant") |
| **CarViolation** *(Many-to-Many: CarSubmissions <-> Tags)* | `carId`, `violationId` |
| **Vote** *(Many-to-Many: Users <-> CarSubmissions)* | `userId`, `carId` |

---

# TODO:

### General & Setup
- [X] Figure out whos doing what
- [x] Database Setup: Create the MongoDB database and collections.
- [x] Data Modeling: Implement the 6 entities (User, CarSubmission, Comment, Violation, CarViolation, Vote).

### Backend 
- [x] Server Setup: Web server utilizing Express.js on Node.js started (`server.js`), but needs full implementation.
- [x] Routing: Set up API routes to handle data requests for the 6 entities.
- [x] Authentication Logic: Build the backend logic to create users with username/password and prevent duplicates.
- [x] Database CRUD Integration: Facilitate Create, Read, Update, and Delete operations for MongoDB through the Express server.
- [ ] Authorization/Permissions:
  - Grant Admins full CRUD operations on all data.
  - Restrict Standard Users to updating/deleting only their own data. Block them from altering others' data.

### Frontend 
- [x] Basic Structure: `App.jsx`, `main.jsx`, and core components (`header.jsx`, `main.jsx`, `sidebar.jsx`) have been initialized.
- [x] Login & Registration: Build the auth screen. The login page **MUST** be the first screen the user sees.
- [ ] Role-Based Routing: Implement conditional rendering (e.g., using React Router) so users only see screens appropriate for their role.
- [ ] Admin Dashboard: Create a separate area/functionality for Administrators to manage the platform.
- [x] Standard User Interface: Build views for users to read data, and forms to create, update, and delete their own submissions and comments.
- [x] Full-Stack Connection: Connect the React front-end to the Express back-end to trigger database CRUD operations from the UI.

### Presentation Preparation
- [ ] Slide Deck: Create a presentation covering the team introduction, topic choice, technologies used, work distribution, and technical descriptions (routing, collections, components, entities, relationships).

### Final Submission (Due: Monday, April 5)
- [ ] Documentation: Write a `README.txt` detailing how to start the server(s), the port/URL to navigate to, and the required MongoDB collections.
- [ ] Upload: only one person needs to do this  
    - [ ] Packaging: Compress the entire project into a single `.zip` file.
- [ ] Individual Reflections
