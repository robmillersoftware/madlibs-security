const accounts = require('./accounts.json');
const billPay = require('./billpay.json');
const customersRetail = require('./customersretail.json');
const payments = require('./payments.json');
const transactions301 = require('./transactions-301.json');
const transactions302 = require('./transactions-302.json');
const transactions303 = require('./transactions-303.json');
const transactions304 = require('./transactions-304.json');
const transactions305 = require('./transactions-305.json');
const transactions306 = require('./transactions-306.json');
const virtualWallet = require('./virtualwallet.json');

module.exports = {
	accounts: JSON.parse(accounts),
	billPay: JSON.parse(billPay),
	customersRetail: JSON.parse(customersRetail),
	payments: JSON.parse(payments),
	transactions: {
		301: JSON.parse(transactions301),
		302: JSON.parse(transactions302),
		303: JSON.parse(transactions303),
		304: JSON.parse(transactions304),
		305: JSON.parse(transactions305),
		306: JSON.parse(transactions306),
	}
	virtualWallet: JSON.parse(virtualWallet)
};