const ts = require('./models/ticket_service.js');
const user = require('./models/user.js');
const admin = require('./models/admin.js');
const http = require('http');
const url = require('url');
const port = 3031;
const tickets = require('./config').tickets;
const moment = require('moment');
const chalk = require('chalk');
// moment().format('DD-MM-YYYY')

// Initialize Ticket Service
const ticketService = new ts(tickets.nbTickets);

// Array of Users (buffer db)
const users = [new user("David"), new user("Joy"), new user("Admin")];
const checkUsers = (name, users) => {
    const found = users.find((user) => user.getName() === name);
    return found ? found : false;
}

// console.log(checkUsers("Davd", users));
// checkUsers("David", users)
// console.log(admin.checkAdminPassword("crazyPassword"));

// ticketService.addOrder(moment().format('DD-MM-YYYY'), 2, users[0]);
// ticketService.addOrder(moment().format('DD-MM-YYYY'), 3, users[1]);


// ticketService.changeOrder(1, moment().format('DD-MM-YYYY'), 8, joy)
// console.log(ticketService.getAllOrders());
// console.log(ticketService);

// if (req.headers.apikey === 'crazyPassword') {
// } else {
//     res.writeHeader(401);
//     res.end("Sorry but you don't have the authorisation ✋");
// }

console.log(chalk.underline.blue("Welcome to Shenkar wonderful Ticket Service for the Lady Gaga live show 🔥"));
console.log(chalk.yellow("\nWaiting for API calls..."));
http.createServer((req, res) => {
    const urlObj = url.parse(req.url, true, false);
    switch (req.method) {
        case 'GET':
            if (urlObj.path === '/getAllOrders') {
                console.log('/getAllOrder  called!');
                res.writeHeader(200);
                res.end(JSON.stringify(ticketService.getAllOrders()));
            } else if (urlObj.pathname === '/resetAllOrders') {
                console.log('/resetAllOrders  called!');
                ticketService.destroyAllOrders();
                res.end("All the Orders are destroyed ☠️");
                console.log(ticketService.getAllOrders());
            } else {
                console.log(`url ${urlObj.path} not exists!`);
                res.writeHeader(404);
                res.write('Bad request');
                res.end();
            }
            break;
        case 'POST':
            if (urlObj.pathname === '/addNewOrder') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk.toString(); // convert Buffer to string
                });
                req.on('end', () => {
                    const payload = JSON.parse(body);
                    const order_user = checkUsers(payload.user_name, users);
                    if (order_user) {
                        const done = ticketService.addOrder(moment().format('DD-MM-YYYY'), payload.nbtickets, order_user);
                        if (done) {
                            res.writeHeader(200);
                            res.end(`Your order is confirmed 🎉\nYour Id is: ${ticketService.getAllOrders()[ticketService.getAllOrders().length - 1].getId()}`);
                        } else {
                            res.end(`Unfortunately we can't confirm you order 😒`);
                        }
                    } else {
                        users.push(new user(payload.user_name));
                        const done = ticketService.addOrder(moment().format('DD-MM-YYYY'), payload.nbtickets, users[users.length - 1]);
                        if (done) {
                            console.log(users);
                            res.writeHeader(200);
                            res.end(`Your order is confirmed 🎉\nYour Id is: ${ticketService.getAllOrders()[ticketService.getAllOrders().length - 1].getId()}`);
                        } else {
                            res.end(`Unfortunately we can't confirm you order 😒`);
                        }
                    }
                });
            } else {
                console.log(`url ${urlObj.path} not exist!`);
                res.writeHeader(404);
                res.write('Bad request');
                res.end();
            }

            break;
    }
}).listen(port, () => `listening on port ${port}`);