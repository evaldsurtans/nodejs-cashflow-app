const express = require('express');
const bodyParser = require('body-parser');
const jsonfile = require('jsonfile');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

function process(request, response) {
	// body...
}

//app.get('/', process);

var users = [
	{
		"id": 1,
		"transactions": []
	},
	{
		"id": 2,
		"transactions": []
	}
];

var data_path = './data.json';
if(fs.existsSync(data_path)) 
{
	users = jsonfile.readFileSync(data_path);
}

//app.post
//app.get
//app.all = app.get + app.post
app.all('/', (request, response) => {

	var transactions = []; //JS array

	var jResponse = {
		'success': false
	};
	var jRequest = request.body;
	if(jRequest.message != undefined)
	{
		var current_user = null;
		for(var user of users)
		{
			if(user.id == jRequest.user_id)
			{
				current_user = user;
				transactions = user.transactions;
				break;
			}
		}

		if(jRequest.message == 'transaction')
		{
			current_user.transactions.push(jRequest.transaction); 
			//JS array add single element
			jResponse['success'] = true;
		}
		if(jRequest.message == 'transactions')
		{
			current_user.transactions = 
				current_user.transactions.concat(jRequest.transactions);
			// JS array combine 2 arrays
			jResponse['success'] = true;
		}
		else if(jRequest.message == 'showall')
		{
			jResponse['transactions'] = current_user.transactions;
			jResponse['success'] = true;
		}

	}

	if(jResponse.success)
	{
		jsonfile.writeFileSync(data_path, users);
	}

	console.dir(jRequest);
	console.log('request recieved');
	response.send(jResponse);
});

app.on('error', (error) => {
	console.log(error);
});

app.listen(8080);


