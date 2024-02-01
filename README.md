# Divisin Assessment - Image Management System
David Yang

This project builds a web application for simple image management. It allows users to register, log in, and manage image uploads. The project utilizes React to build the user interface, Flask to build the web and API services, and MySQL as the database.

### Demo
Demo Link: [http://54.188.35.169:4000](http://54.188.35.169:4000)

### Screenshots
<p float="left">
<img src="https://i.ibb.co/3cnyPX7/divisin-signin.jpg" alt="divisin-signin" width="400">
<img src="https://i.ibb.co/pv5gsW2/divisin-manage.jpg" alt="divisin-manage" width="400">
</p>

### Instruction for Running App Locally
Step 0: Install `Python3` and `MySQL` on your local machine.

Step 1: Clone the repository:
`git clone https://github.com/yzyly1992/divisin-assessment.git`
`cd divisin-assessment`

Step 2: Initial the MySQL database with Schema script:
`mysql -u root -p  < divisin-database/divisin-schema.sql`

Step 3: Install the required Python libraries (recommand use `conda` or `pyenv`):
`conda create -n divisin python=3.8`
`conda activate divisin`
`pip install -r divisin-server/requirements.txt`

Step 4: Start the web and api servers:
`cd divisin-server`
`python3 divisin-server/api_server.py & python3 divisin-server/web_server.py &`

Step 5: Your local app is all set! Test at:
`http://localhost:4000`

### Instruction for Deployment (E.g. AWS EC2)
Step 0: Connect EC2 through SSH, and Install `MySQL`, `miniconda`, and `Node/npm` on the instance.

Step 1: Clone the repository:
`git clone https://github.com/yzyly1992/divisin-assessment.git`
`cd divisin-assessment`

Step 2: Change the api server address to instance's public IP in `divisin-app/src/api.js`. Then rebuild the React app:
`cd divisin-app`
`npm run build`
`cd ..`

Step 3: Initial the MySQL database with Schema script:
`mysql -u root -p  < divisin-database/divisin-schema.sql`

Step 4: Install the required Python libraries (recommand use `conda` or `pyenv`):
`conda create -n divisin python=3.8`
`conda activate divisin`
`pip install -r divisin-server/requirements.txt`

Step 5: Start the web and api servers:
`cd divisin-server`
`python3 divisin-server/api_server.py & python3 divisin-server/web_server.py &`

Step 6: Edit the security group of the EC2 instance to allow inbound traffic on port 4000 and port 5000.

Step 7: Your deployment is all set! Test at:
`http://<your-ec2-public-ip>:4000`

### Design and Implementation
#### Frontend
The frontend is built with React. It is designed through pages and components, which are reusable and modular. The app has the following pages: App, Login, Register, and ImageManager.
#### Backend
The backend is built with Flask. It provides the following API services: user registration, user login, image upload, image retrieval, and image deletion. The backend also connects to the MySQL database to store user information and image metadata. We host the static web app on one server, and the API server on another server. The two servers communicate through HTTP requests. This design allows for better scalability and security, and avoid coupling between the frontend and backend. The API server utilizes flask-session to manage user sessions.
#### Database
The database is built with MySQL. It stores user information and image metadata. The user table stores user id, email, and password. The image table stores image id, user id, and image url. The user id is a foreign key in the image table, which establishes a one-to-many relationship between users and images.

### Challenges
- CORS issue: The frontend and backend are hosted on different servers. We need to handle the CORS issue to allow the frontend to make requests to the backend. We solve this issue by use `flask_cors` library to set the CORS policy in the API server.
- Session management: We need to manage user sessions to keep track of user login status. We solve this issue by using `flask-session` library to manage user sessions in the API server.
- Create proper authorization rules: We need to create proper authorization rules to ensure that users can only access their own images. We solve this issue by adding a user id field to the image table, and checking the user id when retrieving or deleting images.



