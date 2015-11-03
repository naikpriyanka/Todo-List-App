// set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mysql = require('mysql');                     // mysql for mariadb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

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

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

	// define model =================
//     var Todo = mysql.model('Todo', {
//         text : String
//     });
    
    // routes ======================================================================

    // api ---------------------------------------------------------------------
    // get all todos
    app.get("/api/todos",function(req,res){
		connection.query('SELECT * from todo', function(err, todos, fields) {
			//connection.end();
  			if (err)
  				console.log(err);
  				//res.send(err);
    		res.json(todos);	
  		});
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
            connection.query('SELECT * from todo', function(err, todos, fields) {
            	//connection.end();
                if (err)
                    console.log(err);
                res.json(todos);
            });
        });

    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function(req, res) {
        var id = req.params.todo_id;
        connection.query('DELETE from todo where id = ' + id , function(err, todo) {
            if (err)
                console.log(err);

            // get and return all the todos after you create another
            connection.query('SELECT * from todo', function(err, todos, fields) {
            	//connection.end();
                if (err)
                    console.log(err);
                res.json(todos);
            });
        });
    });

	// application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
	
    // listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");
    
    
