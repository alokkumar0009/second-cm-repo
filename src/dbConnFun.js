const oracledb = require('oracledb')
const dbConfig = require('./dbConfig.js')
oracledb.autoCommit = true;
oracledb.outFormat = oracledb.ARRAY
var uniqid = require('uniqid');


const dbConnection = ({userName,password}, callback) => {

oracledb.getConnection({
	user : dbConfig.user,
	password : dbConfig.password,
	connectString : dbConfig.connectString
	},
	function(err, connection)
	{
		if (err) 
		{
		  console.log(err)	  
		  const error = 'page 404. Service not available'
		  return callback(null, error);
		}
		else
		{
			console.log("DB connection successful")
			//const findUserSQL = `select count(*) from siebel.S_USER where LOGIN=  ${"\'"+ userName +"\'"}`
			const newSQL = `select con.FST_NAME from S_CONTACT con, S_USER usr, S_PARTY part where 
							part.row_id = usr.PAR_ROW_ID and con.PAR_ROW_ID = part.row_id and usr.LOGIN 							= ${"\'"+ userName +"\'"}`
							
			connection.execute(newSQL , (error,result)=>{
				if (error) 
				{
				  console.log(error)
				  //return {error: 'Could not validate the user'}
				  return callback(null, error);
				}
				else
				{
					const deptRow = result.rows[0]
					global.a = deptRow
					if(!deptRow)
					{
					const err = "Login Id or Password is incorrect."
					return callback(null, err)
					}
					const uniqueId= uniqid.process() 
					const auditSQL = `insert into CX_TAM_DTL (X_CONTACT_ID, X_INTERFACE_NAME, ROW_ID, CREATED_BY, 										CREATED,LAST_UPD,LAST_UPD_BY) 
									  values (${"\'"+ userName +"\'"},'Login', ${"\'"+ uniqueId +"\'"} ,${"\'"+ 											userName +"\'"},'14-MAY-2020','14-MAY-2020','Alok')`
					
					connection.execute(auditSQL , (error,result)=>{
					if (error) 
					{
					console.log(error)
					//return {error : 'Audit operation failed to execute' }
					return callback('Audit operation failed to execute');
					}
					})
					
					const users = {userName, password}
					
					console.log('return user is:' + users.userName)
					console.log('return pwd is:' + users.password)
					callback(users.userName, null)
					
				}
			})
		}
	}
)
}

//dbConnection({userName : '54611900', password: 'aa'},function(user,err) {
// if(user) return console.log('user is'+ user)
//  console.log('Error is ' + err)
//})


module.exports = {dbConnection}