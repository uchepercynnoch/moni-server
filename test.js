const shortid = require("shortid");
const moment = require("moment");

const date = Date.now();
console.log(moment().format('LLLL'));

// const a = {
//     ref: "1572180900993-1-7493",
//     userid: "1",
//     devid: "1",
//     locid: "1",
//     custid: "0",
//     custemail: "admin",
//     notes: "",
//     discount: "0",
//     rounding: "0.00",
//     cost: "150000.00",
//     subtotal: "150000.00",
//     total: "150000.00",
//     numitems: 3,
//     processdt: 1572180900993,
//     items: [
//         {
//             ref: "5a3fc880",
//             sitemid: "2",
//             qty: 3,
//             name: "Luxury Room",
//             unit: "50000.00",
//             taxid: "1",
//             tax: { total: 0, values: {}, inclusive: true },
//             price: "150000.00",
//             desc: "A luxurious spacious room",
//             cost: "50000",
//             unit_original: "50000",
//             alt_name: "Delux",
//             id: "97"
//         }
//     ],
//     payments: [
//         {
//             method: "cash",
//             amount: "150000.00",
//             tender: "150000.00",
//             change: "0.00",
//             id: "97",
//             processdt: 1572180900993
//         }
//     ],
//     tax: "0.00",
//     taxdata: {},
//     id: "97",
//     dt: "2019-10-27 23:55:01",
//     balance: 0,
//     status: 1
// };

// const useraccount = {
//     membershipCounter: 6000000,
//     membershipType: "regular",
// }

// function MembershipLevelCheck(useraccount) {
//     if (useraccount.membershipCounter >= 100000 && useraccount.membershipCounter < 1000000) {
//         useraccount.membershipType = "blue";
//     } else if (useraccount.membershipCounter >= 1000000 && useraccount.membershipCounter < 6000000) {
//         useraccount.membershipType = "gold";
//     } else if (useraccount.membershipCounter >= 6000000) {
//         useraccount.membershipType = "platinum";
//     }
// }

// MembershipLevelCheck(useraccount);
// console.log(useraccount);