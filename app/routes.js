var mysql = require('mysql');
var path = require('path');

// configuration =================

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    database : 'todolist'
});

connection.connect(function(err){
	if(!err) {
    	console.log("Database is connected ... \n\n");  
	} else {
    	console.log("Error connecting database ... \n\n");  
	}
});


function getTodos(res) {
	connection.query('SELECT * from todo', function(err, todos, fields) {
		//connection.end();
  		if (err)
  			console.log(err);
    	res.json(todos);	
  	});
}

module.exports = function(app) {

	// api ---------------------------------------------------------------------
    // get all todos
    app.get("/api/todos",function(req,res){
		getTodos(res,connection);
	});

    // create todo and send back all todos after creation
    app.post('/api/todos', function(req, res) {

        // create a todo, information comes from AJAX request from Angular
        var post = req.body.text;
        
        connection.query('INSERT into todo(text) values("' + post + '")', function(err, todos, fields) {
            if (err)
            	console.log(err);
                // res.send(err);

            // get and return all the todos after you create another
            getTodos(res);
        });

    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function(req, res) {
        var id = req.params.todo_id;
        connection.query('DELETE from todo where id = ' + id , function(err, todo) {
            if (err)
                console.log(err);

            // get and return all the todos after you create another
            getTodos(res);
        });
    });

	// application -------------------------------------------------------------
    app.get('*', function(req, res) {
    	res.sendFile(path.resolve('public/index.html'));
        //res.sendFile('index.html', { root: path.join( __dirname, '../public') }); // load the single view file (angular will handle the page changes on the front-end)
    });
    
};	