const accounts = require('./accounts.json');
const billPay = require('./billpay.json');
const customersRetail = require('./customersretail.json');
const payments = require('./payments.json');
const transactions = require('./transactions.json');
const virtualWallet = require('./virtualwallet.json');

module.exports = {
	accounts: JSON.parse(accounts),
	billPay: JSON.parse(billPay),
	customersRetail: JSON.parse(customersRetail),
	payments: JSON.parse(payments),
	transactions: JSON.parse(transactions),
	virtualWallet: JSON.parse(virtualWallet)
};