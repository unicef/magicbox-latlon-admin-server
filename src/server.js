import express from 'express'
const app = express();
import bodyParser from 'body-parser'
import router from './router'

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port = process.env.PORT || 8082;        // set our port

app.use('/api', router);

var thing = 'asdf'
app.listen(port);
console.log('Magic happens on port ' + port);
