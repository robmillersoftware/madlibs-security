const accounts = require('./accounts.json');
const billPay = require('./billpay.json');
const payments = require('./payments.json');
const transactions302 = require('./transactions-302.json');
const transactions303 = require('./transactions-303.json');

module.exports = {
	accounts: JSON.parse(accounts),
	billPay: JSON.parse(billPay),
	payments: JSON.parse(payments),
	transactions: {
		302: JSON.parse(transactions302),
		303: JSON.parse(transactions303)
	}
};