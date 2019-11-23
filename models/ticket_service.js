const order = require('./order.js');

module.exports = class TicketService {
    constructor(availableTickets) {
        this.orders = [];
        this.availableTickets = availableTickets;
        this.soldTickets = 0;
    }

    storeOpen() {
        if (this.availableTickets > 0) {
            return true;
        }
        return false;
    }

    addOrder(date, tickets, user) {
        if (tickets <= this.availableTickets) {
            const id = this.orders.length + 1;
            let ord = new order(id, date, tickets, user);
            this.orders.push(ord);
            this.availableTickets -= tickets;
            this.soldTickets += tickets;
            return true;
        }
        return false;
    }

    changeOrder(id, date, tickets, user) {
        const order = this.orders.find((order) => order.getId() === id);
        if (order) {
            if (tickets <= this.availableTickets + order.nbTickets) {
                if (order.nbTickets != tickets) {
                    this.availableTickets += order.nbTickets;
                    this.soldTickets -= order.nbTickets;
                    this.availableTickets -= tickets;
                    this.soldTickets += tickets;
                    order.setNbTickets(tickets);
                }
                order.setDate(date);
                order.setUser(user);
                return true;
            }
        }
        return false;
    }

    getAllOrders() {
        return this.orders;
    }

    destroyAllOrders() {
        this.orders = [];
        this.availableTickets += this.soldTickets;
        this.soldTickets = 0;
    }
}