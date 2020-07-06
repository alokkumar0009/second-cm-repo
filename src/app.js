const path = require("path")
const http = require('http')
const express = require('express')
const SSH = require('simple-ssh')
const socketio = require('socket.io')
const passport = require('passport')
const session = require('express-session')
var LocalStrategy = require('passport-local').Strategy
var uniqid = require('uniqid')
const {dbConnection} = require('./dbConnFun.js')
const timestamp = require('log-timestamp')
const dbRunSQL = require('./dbRunSQL.js')


const app = express()
const server = http.createServer(app)
const io =socketio(server)

const pathname = path.join(__dirname,'../public')
app.use(express.static(pathname))

app.use(function(req, res,next){
	if(!req.user)
		{
		res.header('Cache-Control','private, no-cache, no-store, must-revalidate')
		}
		next()
	})	
app.set('view engine', 'hbs')

app.use(express.urlencoded({extended:false}))
app.use(session({
	secret: 'test',
	resave: false,
	cookie:{maxAge: 900000},
	saveUninitialized: false
	}))
app.use(passport.initialize())
app.use(passport.session())


//---------------------DB connection starts here--------------------


passport.use(new LocalStrategy({
		usernameField: 'loginid',
		passwordField: 'password'
		},
		function(username, password, done) {
		
			dbConnection({userName : username, password},function(user,err) {
					if(user) 
					{
						console.log('user is '+ user)
						return done(null, user)
					}
				return done(err)
				}
			)
		}	
	)	
)

passport.serializeUser((user, done)=> {
	console.log('SerializeUser : ' + user)
	done(null, user)
})

passport.deserializeUser((user, done)=> {
	console.log('DeserializeUser : ' + user)
	done(null, user)
 })


app.get('',checkNotAuthenticated,(req,res)=>{
	res.render('index.hbs')
})

app.post('/', checkNotAuthenticated, passport.authenticate('local',{
successRedirect: '/main',
failureRedirect: '/'
}))

app.get('/main',checkAuthenticated,(req,res)=>{
console.log(global.a)
res.render('main.hbs',{name:global.a})
})
 
app.get('/logout', function(req, res){
	req.logOut()
	req.session.destroy(function (err) {
        res.redirect('/')
    })
})

 
io.on('connection', (socket)=>{
		const uniqueId= uniqid.process() 
		console.log('Socket Io'+ uniqueId)
		console.log("Main connection")	
		
		socket.on('sendComponent', (component, operation)=>{
		  console.log('Component is '+ component)
		  console.log('Operation is '+ operation)
		
			if(operation === 'List')
			{
				ssh = new SSH({
				host: '10.30.17.22',
				user: 'siebel',
				pass: 'password@123',
				});
				ssh.exec('sh restartList.sh ' + component,{
						out: function output(stdout1){ 
							console.log(stdout1)
							socket.emit('Firstemit', stdout1)},
						err: function output(stderr){console.log(stderr)}
				}).start();
			}
			
			else if (operation === 'Restart')
			{
				ssh = new SSH({
				host: '10.30.17.22',
				user: 'siebel',
				pass: 'password@123',
				});
				ssh.exec('sh restart.sh ' + 5 + ' ' + component,{
						out: function output(stdout1){ 
							console.log(stdout1)
							socket.emit('Firstemit', stdout1)},
						err: function output(stderr){
						
							console.log(stderr)}
				}).start();
			}
			else if (operation === 'Start')
			{
				ssh = new SSH({
				host: '10.30.17.22',
				user: 'siebel',
				pass: 'password@123',
				});
				ssh.exec('sh start.sh ' + component,{
						out: function output(stdout1){ 
							console.log(stdout1)
							socket.emit('Firstemit', stdout1)},
						err: function output(stderr){console.log(stderr)}
				}).start();
			}
			else if (operation === 'RunScript')
			{
				ssh = new SSH({
				host: '10.30.17.22',
				user: 'siebel',
				pass: 'password@123',
				});
				console.log('sh runcommand.sh ' + ("\""+ component +"\""))
				ssh.exec('sh runcommand.sh ' + ("\""+ component +"\""),{
						out: function output(stdout1){ 
							socket.emit('Firstemit', stdout1)},
						err: function output(stderr){console.log(stderr)}
				}).start();
			}
			else if (operation === 'runSQL')
			{
				ssh = new SSH({
				host: '10.30.17.22',
				user: 'siebel',
				pass: 'password@123',
				});

				(async() => {
				const resultofSQL = await dbRunSQL(component)
				console.log('Result returned is '+ resultofSQL)
				socket.emit('Firstemit', resultofSQL)
				})()
				
								
			}			
			else 
			{	
				ssh = new SSH({
				host: '10.30.17.22',
				user: 'siebel',
				pass: 'password@123',
				});
				ssh.exec('sh listtaskforsession.sh ' + component,{
						out: function output(stdout1){ 
							console.log(stdout1)
							socket.emit('Firstemit', stdout1)},
						err: function output(stderr){console.log(stderr)}
				}).start();
			}
				
				/*
				.exec('cat /siebel/siebsrvr/filename.txt', {out: function output(stdout2){

						//if(stdout2.includes(compname))
						 //  {
						//		const i = stdout2.indexOf(compname)
						//		const j = stdout2.indexOf(compname, i+1)
						//		console.log(i)
						//		console.log(j)
						//		const substring = stdout2.substr(j,36)
								
								console.log('times of logging22')
								socket.emit('compstatus', stdout2)
								
						//   }
						//else
						//   {
						//		socket.emit('compstatus', 'Connection Error')
						//  }
						}
					})
				.exec('rm /siebel/siebsrvr/filename.txt', {
							out: function output(stdout3){console.log(stdout3)},
							err: function output(stderr) {console.log(stderr)},
							exit: function output(code) {console.log('Completed successfully')}
					})				
					*/
				
		})
   
	}) 

function checkAuthenticated(req, res, next){
if(req.isAuthenticated()){
return next()
}
res.redirect("/")
}

function checkNotAuthenticated(req, res, next){
if(req.isAuthenticated()){
res.redirect("/main")
}
next()
}

console.log(timestamp)
server.listen(3000,()=>{
console.log('Server is up and running.')
})


