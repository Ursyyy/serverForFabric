var bodyParser = require('body-parser')
const express = require('express'),
	app = express(),
	port = process.env.PORT || 3000;

	routes = require('./routes')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.listen(port, () => {
	console.log("Server has been started on port " + port)
})

routes(app)
//Залить на гит, + подробная интсрукцияЗалить на гит, + подробная интсрукция + баш скрипт + эндпоинты 