# ABC Bank Customer Management System

<!-- [Heroku live version here!](https://abcbank-customer-management.herokuapp.com/) -->

---

## Content

1. [How to install and run the project locally](#how-to-install-and-run-the-project-locally)
2. [Technologies used](#technologies-used)
3. [Functionality](#functionality)
    - [Find customer](#find-customer)
    - [Add new customer](#add-new-customer)
    - [Update customer details](#update-customer-details)
    - [Delete customer](#delete-customer)
    - [Latency calculation](#latency-calculation)
4. [Assumptions & things done for simplicity](#assumptions-&-things-done-for-simplicity)

---

## How to install and run the project locally

### Install

1. Run `npm install` or `yarn install` in the terminal
2. [_Optional_] Change mongoDB connection string in the [.env](./.env) file to connect to your own database
3. When install has finished, run `npm run devstart` or `yarn devstart` in the terminal
4. Go to [localhost:3000](http://localhost:3000) to see the application
5. Read about [functionality here](#functionality) if needed

---

## Technologies used

| Name            | Usage                                         | Location examples                                                                                                                                                                      |
| --------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Express.js      | API / backend                                 | Main functionality [here](./server.js) / routes are in [customers.js](./routes/customers.js)                                                                                           |
| mongoose        | Connecting/interacting with DB                | Schema can be found [here](./models/customer.js)                                                                                                                                       |
| EJS             | Templating engine for Express                 | All ejs files are in the [views](./views) folder                                                                                                                                       |
| Heroku          | Deploying to web                              | [Live version](https://abcbank-customer-management.herokuapp.com/)                                                                                                                     |
| MongoDB         | DB for live version                           | If you [search for customer](https://abcbank-customer-management.herokuapp.com/customers) `123` in the site that is deployed on Heroku, you can see that it is connected to a database |
| dotenv          | Setting environment variables                 | [.env](./.env)                                                                                                                                                                         |
| morgan          | Loggin end-to-end latency                     | Setup is found in [server.js](./server.js). Logs are found in [endtoend.log](./logs/endtoend.log)                                                                                      |
| nodemon         | Automatic refresh of server                   | [package.json](./package.json)                                                                                                                                                         |
| method-override | Sending more than GET/POST requests via forms | [package.json](./package.json)                                                                                                                                                         |

---

## Functionality

### Find customer

-   Search for customer by personal number
-   Requires at least 3 numbers from the personal number, will not accept more than 11
-   If no customers are found, a button will show an option to create the customer
-   The _Create new customer_-button will redirect to **Add new customer** and automatically insert the customer number into the form

### Add new customer

-   Requires all fields to be filled out correctly
    -   Personal number is Norwegian standard, 11 digits where the first 6 digits represent a birthdate
    -   First name, last name and city require at least two characters
    -   You are required to choose an account type
-   The customer birthdate is set based on the personal number
-   The customer bank account number is generated based on [the Norwegian standard](https://no.wikipedia.org/wiki/Kontonummer)
    -   First 4 digits are the bank register number
    -   Next 2 digits are based on the account type
    -   The 4 digits after that are a randomly generated number
    -   And the last digit is a control number being calculated by the [mod11 algorithm](./public/javascripts/generateAccountNumber.js)
    -   The customer ID is the last 7 digits of the bank account number
-   After successfully creating a new customer, you are redirected to the **Find customer** page and the personal number you used will be filled into the form so you can easily display the customer

### Update customer details

-   You first have to search for a customer (all 11 digits, for security)
-   The form will then be filled in with all the details of the customer, and you can choose which you want to change
-   When submitting, you get a success message as long as nothing went wrong

### Delete customer

-   You first have to search for a customer (all 11 digits, for security)
-   The customer will then display with a _Delete_-button which will delete the customer and display a success message as long as nothing went wrong

### Latency calculation

#### Information

-   Latency will be logged to the terminal whenever you do something on the site that includes a mongoDB query
-   The log includes the HTTP status code, method used to send, the endpoint and the mongoDB query type that was used

#### How it works

-   The end-to-end latency is logged by **morgan** and saved in a log file
-   The cloud processing latency is logged by **mongoose pre/post-middleware** that can be found in the [customer schema](./models/customer.js)
-   The post-middleware also calls on **[a function](./scripts/latency.js)** which takes the last line from the end-to-end log and compares it to the current cloud processing latency calculation to get the communication latency, and finally logs everything out to the terminal in a neat form

---

## Assumptions & things done for simplicity

### Creating customer

-   Customers can have only one account each
-   Personal number, account number and customer ID should be unique in the database
-   ABC Bank has the 'Bank register number' 1234

### Updating customer

-   If customer changes account type, a new account number will be generated
-   Customer ID can not be updated, even when the account type (and therefore account number) is changed
