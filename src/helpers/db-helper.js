const mysql = require("mysql");

function transformData(data) {
  const { ref: refId, total } = data;
  const products = data.items.map(item => item.name);
  return { refId, total, products };
}

function fetchTransactionFromDB(config, transactionId) {
  return new Promise((resolve, reject) => {
    if (!transactionId) reject(new Error("Invalid transaction ref"));

    var connection = mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
      database: config.database
    });

    const processResult = (error, results) => {
      try {
        if (error) throw error;

        if (results[0] && results[0].data) {
          const result = transformData(JSON.parse(results[0].data));
          /* close the connection to the daatabase to avoid memory leaks */
          connection.end();
          return resolve(result);
        }

        /* mysql didn't return anything :\ */
        throw new Error("Unable to pull transaction with that ref");
      } catch (error) {
        connection.end();
        reject(error);
      }
    };

    try {
      connection.connect();
      const QUERY = `SELECT * FROM ${config.database}.sales WHERE ref = "${transactionId}"`;
      connection.query(QUERY, processResult);
    } catch (error) {
      connection.end();
      reject(new Error("Database Error", error.message));
    }
  });
}

module.exports = { fetchTransactionFromDB };
