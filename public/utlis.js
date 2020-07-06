console.log("Javascript is loadeddddd")	
const socket = io()
socket.heartbeatTimeout = 20000;


function show1()
{
	document.getElementById("comp_operation").style.display = "none";
	document.getElementById("comp_select").style.display = "none";
	document.getElementById("server_operation").style.display = "none";
	document.getElementById("Enterprise_operation").style.display = "block";
	document.getElementById("button_click").style.display = "block"
	document.getElementById("result").style.display = "none"
}
function show2()
{
	document.getElementById("comp_operation").style.display = "none";
	document.getElementById("comp_select").style.display = "none";
	document.getElementById("server_operation").style.display = "block";
	document.getElementById("Enterprise_operation").style.display = "none";
	document.getElementById("result").style.display = "none"
}

function show3()
{
	document.getElementById("comp_operation").style.display = "block";
	document.getElementById("server_operation").style.display = "none";
	document.getElementById("Enterprise_operation").style.display = "none";
	document.getElementById("result").style.display = "none"
}

function show4()
{
	
	const e = document.getElementById("operation_id");
	const result = e.options[e.selectedIndex].value;
    window.result = e.options[e.selectedIndex].value;
	console.log(window.result);
	
	document.getElementById("comp_select").style.display = "block";
	document.getElementById("comp_select_id").selectedIndex = "0";
}


function show5()
{
	console.log('show5')
	document.getElementById("button_click").style.display = "block"
	
	if(document.getElementById("1").selected)
	  {
		const comp = document.getElementById("1").value
		window.comp = document.getElementById("1").value
		console.log('globalvariable ' + window.comp)
	  }
	else if(document.getElementById("2").selected)
	{
		const comp = document.getElementById("2").value
		window.comp = document.getElementById("2").value
		console.log('globalvariable ' + window.comp)
	 }
	else if(document.getElementById("3").selected)
	{
		const comp = document.getElementById("3").value
		window.comp = document.getElementById("3").value
		console.log('globalvariable ' + window.comp)
	}
	 else
	{
		const comp = document.getElementById("4").value
		window.comp = document.getElementById("4").value
		console.log('globalvariable ' + window.comp)
	}
}

function show6()
{
	console.log('show6')
	document.getElementById("button_click").style.display = "block"
	const e = document.getElementById("server_operation_id");
	const comp = e.options[e.selectedIndex].value;
    window.comp = e.options[e.selectedIndex].value;
	
	if(window.comp == "runCommand" || window.comp == "FindPId" || window.comp == "runSQL")
	{
	 document.getElementById("formId").style.display = "block"
	 }
	else
	{
	console.log(window.comp)
	}
}

//button click starts---------------

document.getElementById("button_click").addEventListener('click', () => {
if(document.getElementById("time_id").value)
{
	var getUserTime = new Date(document.getElementById("time_id").value)
	var getCurrentTime = new Date()
	var timeDiff= getUserTime.getTime() - getCurrentTime.getTime()
	alert(timeDiff)
	socket.emit('sendComponent',timeDiff, "RunScript")
}
else if (window.comp == "runCommand")
{
	const content = document.getElementById("ScriptContent").value
	window.content = document.getElementById("ScriptContent").value
	console.log(window.content)
	socket.emit('sendComponent',window.content, "RunScript")
}
else if (window.comp == "FindPId")
{
	const content = document.getElementById("ScriptContent").value
	window.content = document.getElementById("ScriptContent").value
	console.log(window.content)
	socket.emit('sendComponent',window.content, "FindPId")
}
else if (window.comp == "runSQL")
{
	const content = document.getElementById("ScriptContent").value
	window.content = document.getElementById("ScriptContent").value
	console.log(window.content)
	socket.emit('sendComponent',window.content, "runSQL")
}
else
{
	socket.emit('sendComponent',window.comp, window.result)	
}

})
//button click ends---------------	
	

socket.on('Firstemit', (stdout1)=>{

	console.log(stdout1)
	document.getElementById("result").innerHTML = stdout1
	document.getElementById("result").style.display = "block"
})





	 