const shortid = require("shortid");
const moment = require("moment");
const { fetchTransactionFromDB } = require("./src/helpers/db-helper");

const date = Date.now();
console.log(moment().format("LLLL"));

const dinero = require("dinero.js");
const cash = dinero({ amount: 0, currency: "NGN" }).setLocale("en-NG");
console.log(cash.toObject());

const config = {
  host: "localhost",
  user: "root",
  password: "",
  database: "monidb"
};

(async () => {
  try {
    const result = await fetchTransactionFromDB(config, "1572297596218-1-9134");
    console.log(result);
  } catch (error) {
    console.log("Caught", error.message);
  }
})();
