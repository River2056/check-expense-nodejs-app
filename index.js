const express = require('express');
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars');
const helpers = require('./helpers');
const path = require('path');

const app = express();

// set middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));

// set view engine
app.engine('handlebars', exphbs({
    extname: 'handlebars',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}));
app.set('view engine', 'handlebars');

// routes
app.get('/', (req, res) => {
    const [total, allExp] = helpers.getAllExpense();
    const tableContent = allExp.map(e => {
        contentDetl = e.split('=');
        return { name: contentDetl[0], cost: contentDetl[1] }
    });
    res.render('home', { total, allExp: tableContent })
});

app.post('/calculate', (req, res) => {
    let jsonMsg = {};
    const income = req.body.income;
    const currentDate = req.body.currentDate;
    if(income == null || income == undefined || income.length === 0) {
        jsonMsg.msg = 'income required!';
    }

    const [nextYear, nextMonth, nextDay] = helpers.getNextDateOfMonth(currentDate);
    const [year, month, day] = helpers.getDateStrArray(currentDate);
    const date = new Date(year, parseInt(month) - 1, day);
    const nextDate = new Date(nextYear, parseInt(nextMonth) - 1, nextDay);
    const diff = nextDate.getTime() - date.getTime();
    const diffInDays = diff / 1000 / 60 / 60 / 24;
    const [total, allExp] = helpers.getAllExpense();
    const dailyAverage = (parseInt(income) - total) / diffInDays;
    jsonMsg.daily = dailyAverage;
    jsonMsg.balance = parseInt(income) - total;

    res.json(jsonMsg);
});

// listen to port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server listening to ${port}...`))