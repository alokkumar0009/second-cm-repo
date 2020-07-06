module.exports = {
user : process.env.NODE_ORACLEDB_USER || "Siebel",

password : process.env.NODE_ORACLEDB_PASSWORD || "Oxf0rd34",

connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || "(DESCRIPTION =(ADDRESS = (PROTOCOL = tcp)(HOST = 10.30.17.8)(PORT = 1521)) (CONNECT_DATA =(SERVER = DEDICATED)(SERVICE_NAME = sblbld)))"
};