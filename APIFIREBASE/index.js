const express = require('express');
const cors = require('cors');
const app = express();
const driverController = require('./controllers/driverController')
const fleteController = require('./controllers/fleteController')
const pagoController = require('./controllers/pagoController.js')
const userController = require('./controllers/usercontroller.js');



app.use(express.json());
app.use(cors());


app.use(express.json());
app.use(cors());

app.use('/api', userController);
app.use('/api', driverController);
app.use('/api', fleteController);
app.use('/api', pagoController);


app.listen(4000, () => console.log('Up and Running port 4000'));
