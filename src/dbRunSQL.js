const oracledb = require('oracledb')
const fs = require('fs')
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT
const dbConfig = require('./dbconfig.js')

// Number of rows to return from each call to getRows()
const numRows = 100;

async function run(finalSQLtoRun) {
  let connection;
  const SQLtoRun = finalSQLtoRun
  console.log("Final sql to run is " + SQLtoRun)
	
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(SQLtoRun, [], 
      {
        resultSet: true // return a ResultSet (default is false)
      })
   
    const rs = result.resultSet;
    let rows;

    do {
      rows = await rs.getRows(numRows); // get numRows rows at a time
      if (rows.length > 0) {
        console.log("Total row count is: " + rows.length);
		const parseData = JSON.stringify(rows)
		//console.log(parseData);
		return parseData
      }
	  
    } while (rows.length === numRows);

     await rs.close(); // always close the ResultSet
    }

   catch (err) 
   {
     console.error(err);
   } 
	finally 
	 {
		if (connection) {
		  try {
			await connection.close();
		  } catch (err) {
			console.error(err);
		  }
		}
	 }
}

module.exports = run

