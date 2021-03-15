# ABC Bank Customer Management System

[Live version here](https://abcbank-customer-management.herokuapp.com/)

_- Ida M. R. Gjeitsund_

---

## How to install and run the project locally

### Install

1. Run `npm install` or `yarn install` in the terminal
2. When install has finished, run `npm run devstart` or `yarn devstart` in the terminal
3. Go to [localhost:3000](http://localhost:3000) to see the application

### Example tests

(The four tabs in the app should be self-explanatory, I will write more details about them before final delivery. )

---

## Technologies used

| Name       | Usage                          | Location examples                                                                                                                                                     |
| ---------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Express.js | API / backend                  | Main functionality [here](./server.js) / routes is in [customers.js](./routes/customers.js)                                                                           |
| mongoose   | Connecting/interacting with DB | Schema can be found [here](./models/customer.js)                                                                                                                      |
| EJS        | Templating engine for Express  | All ejs files are in the [views](./views) folder                                                                                                                      |
| Heroku     | Deploying to web               | [Live version](https://abcbank-customer-management.herokuapp.com/)                                                                                                    |
| MongoDB    | DB for live version            | If you [search for customer](https://abcbank-customer-management.herokuapp.com/customers) `123` in the Heroku version, you can see that it is connected to a database |

---

## Assumptions & things done for simplicity

### Creating customer

-   Customers can have only one account each
-   Personal number, account number and customer ID should be unique in the database
-   Personal number is based on the Norwegian standard, 11 digits, where the first 6 are the birthdate
-   Bank account number and customer ID (CID) is based on [the Norwegian standard](https://no.wikipedia.org/wiki/Kontonummer)
    -   ABC Bank has the 'Bank register number' 1234

### Updating customer

-   If customer changes account type, a new account number will be generated
-   Customer ID can not be updated, even when the account type (and therefore account number) is changed
