const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 3000;
const handlebars = require('express-handlebars').engine;;
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

//template engine
app.engine('hbs', handlebars({extname: ".hbs"}));
app.set('view engine','hbs');
app.set("views", path.join(__dirname, "resources\\views"));

//http logger
app.use(morgan('combined'));

app.get('/',(req,res)=>{
    res.render('home');
})

app.get('/news',(req,res)=>{
    res.render('news');
})
app.listen(port, ()=> console.log("Server is running on port: ", port));