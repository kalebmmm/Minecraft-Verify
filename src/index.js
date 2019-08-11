const express = require('express'),
    bodyParser = require("body-parser"),
    cors = require("cors"),
    helmet = require("helmet"),
    exphbs = require("express-handlebars"),
    logurl = require("express-log-url");

const app = express();
const port = 8080;

// Plugins and shit we're using
app.use(helmet());
app.use(cors());
app.use(logurl);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('handlebars', exphbs({defaultLayout: "main"}));
app.set('view engine', 'handlebars');

// Routers
app.use('/static', express.static("static"));
app.use('/api', require("./routers/api"));

app.listen(port, () => {
    console.log(`Verification server listening on port ${port}!`)
});