import * as mysql from 'mysql';
export class Database {
  node = {
    properties: [
      {
        value: '',
      },
    ],
  };
  constructor(node) {
    this.node = node;
  }

  mysqlDB() {
    return new Promise((resolve, reject) => {
      let properties = this.node.properties;
      let hostName = properties[0].value;
      let databaseName = properties[1].value;
      let port = properties[2].value;
      let username = properties[3].value;
      let password = properties[4].value;
      let tableName = properties[5].value;
      let fields = properties[6].value;
      let filterBy = properties[7].value;
      let sqlQuery = properties[8].value;

      try {
        // create a connection to the database
        const connection = mysql.createConnection({
          host: hostName,
          user: username,
          password: password,
          database: databaseName,
          port: Number(port),
        });

        // connect to the database
        connection.connect((error) => {
          if (error) {
            console.error('Error connecting to database: ', error);
          } else {
            console.log('Connected to database.');

            connection.query(
              sqlQuery === ''
                ? filterBy === ''
                  ? `SELECT ${fields} FROM ${tableName}`
                  : `SELECT ${fields} FROM ${tableName} ORDER BY  ${filterBy}`
                : sqlQuery,

              (error, results, fields) => {
                if (error) {
                  console.error('Error running query: ', error);
                  reject(error);
                } else {
                  console.log('Query results: ', results);
                  resolve(results);
                }
              }
            );

            // close the connection
            connection.end();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
