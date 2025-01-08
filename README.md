# Install nodejs and npm
<pre>
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
source ~/.bashrc
nvm install stable
nvm use <version>
sudo npm install -g webpack
sudo npm install -g npm@latest
</pre>

# Camunda TaskList Microservice

    ## Overview ##
    This Node.js application serves as a microservice to integrate with Camunda, providing a common interface for seamless interaction with the TaskList Application. This microservice is designed to enhance workflow management by exposing new REST APIs.

    ## Features ##
    Camunda Integration: Seamlessly interacts with Camunda to manage workflow tasks.
    TaskList API: Provides a set of REST APIs specifically designed for the TaskList Application.
    Microservice Architecture: Built with a microservices architecture to enhance scalability and maintainability.

# How to install and configure

/_ for developement _/
## Over Docker ##
1. build the docker
<pre>
docker-compose up -d
</pre>
## Direct Setup ##
1. npm install
2. create a .env file from copying ne of the existing env files (example : .env.dev)
3. npm start

/_ To use docker _/
Run storage microservice on your local machine:

    Steps to run Tasklist with Docker:

       * You have to install Docker Engine for windows N|Solid

       * Open Ubuntu and clone project

       *Run this command :
         cd storage/

       *Please checkout the "develop" branch:
         git checkout develop

       *Run the following command to build and create the containers:
         docker-compose up -d

       *docker exec -it tasklist-service npm install

# List Of API's .

To know all api routes you can open server.js

# Tasks List API

http://localhost:3001/api/v1.0/task : get All Tasks (POST)
http://localhost:3001/api/v1.0/task/assign : assign task to user (POST)
http://localhost:3001/api/v1.0/task/unassign : unassign task (POST)
http://localhost:3001/api/v1.0/task/search : search task by queries (POST)
http://localhost:3001/api/v1.0/task/renderTaskForm : get task form (GET)
http://localhost:3001/api/v1.0/task/complete : complete a task (POST)
http://localhost:3001/api/v1.0/task/getCurrentUser : Get currently logged in user (GET).
http://localhost:3001/api/v1.0/task/getTask : get task by id (GET).
http://localhost:3001/api/v1.0/task/getVariable : get Variable by id (GET).
http://localhost:3001/api/v1.0/task/getVariables : get all variables (GET).
http://localhost:3001/api/v1.0/task/deleteProcessInstance : delete a process instance by id (GET).

# Process API

http://localhost:3001/api/v1.0/process : get all processes
http://localhost:3001/api/v1.0/process/getXml : get process form xml
http://localhost:3001/api/v1.0/process/getProcessDefinitions : get all processes definitions
http://localhost:3001/api/v1.0/process/createProcessInstanceWithResult : create an instance of a process
http://localhost:3001/api/v1.0/process/getVariablesforProcess : get process instance variables

# Testing Camunda Microservices #
For testing the camunda microservice for POST request, you can use the following command that should return the task list in JSON format:
<pre>
curl -v --request POST https://camunda.selectbest.net/api/v1.0/task/search
</pre>
