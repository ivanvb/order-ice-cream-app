# Ice Cream Ordering App 



This project tries to satisfy the requirements of a company, which are:

> You were contacted by a company, which is one of the largest local Software Development companies. The company has noticed that their employees like to eat ice cream together, however, due to the large amount of employees that the company has, coordinating this task has become complex.
>
> The company would like you to build an application to solve this issue.

## Requirements 

1. As an employee I must be able to log in to create my orders.
2. As an employee I must be able to register in the system.
3. As an employee I must be able to create an order's list. To do so I must specify a name for my list and the time it will be available for other employees to put their order in.
4. As an employee I must be able to modify my order's list. I can remove other employees from my list or extend its duration.
5. As an employee I must be able to delete my order's list.
6. As an employee I must be able to add an order to any active list. Each employee is limited to one order per list. At the moment of adding an order the employee must provide: name of the product, size and type.
7. As an employee I must not be able to modify an order once the list which hosts it is no longer active.
8. As an employee I must be able to design who will put the order in the ice cream's store. The selected person will be notified via email.
9. As an employee I must be able to delete my order from the order's list.
10. As an employee I must be able to edit my order from the order's list.
11. As an employee I must be able to identify who created the lsit.

As of now only the API is required. In future iterations of the product you may be asked to also develop a UI.

Note: this is a class project.

### Before Setting Up

This project requires an installation of [Node.js](https://nodejs.org/es/download/) and an instance of [MongoDB](https://docs.mongodb.com/manual/installation/).

Also, this project uses Typescript.

### Set up

```
git clone https://github.com/ivb98/order-ice-cream-app.git
```

Once you have a copy of the repository, run
```
npm install
```
from the root directory, this should create the `node_modules` folder with the dependencies of the project.

Next go to the `./server` folder and create the `.env` file, this file should have 

```
DATABASE_URL = url/to/database

TEST_DATABASE_URL = url/to/testdatabase    #Url of the database to run the tests
EMAIL = myemail@email.com    #Email to send the notifications

PASSWORD = mypassword    #Password for the email
```

Once done, you can run the following command from the root of the project:
```
npm run server
```

## Running the tests

Move to the `./server` directory and run

```
npm run test
```
Or from the project's root
```
npm run server-test
```

Note: the tests were written in [Mocha](https://mochajs.org/) 