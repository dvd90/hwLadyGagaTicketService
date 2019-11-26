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
            let id = 1;
            if (this.orders.length != 0) {
                id = this.orders[this.orders.length - 1].getId() + 1;
            }
            let ord = new order(id, date, tickets, user);
            this.orders.push(ord);
            this.availableTickets -= tickets;
            this.soldTickets += tickets;
            return true;
        }
        return false;
    }

    findOrder(id) {
        return this.orders.find((order) => order.getId() === id);
    }

    deleteOrder(id) {
        const order = this.findOrder(id);
        if (order) {
            this.orders = this.orders.filter((order) => order.getId() != id);
            return true;
        } else {
            return false;
        }
    }

    changeOrder(id, date, tickets) {
        const order = this.findOrder(id);
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
        return true;
    }

}