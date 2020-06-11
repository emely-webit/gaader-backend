require('dotenv').config();

const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT;

/** CONNECTION TIL MONGO DB*/
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log("Connected to database"));

/** APP */
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

/** HER SKAL SESSION VÆRE */


/** ROUTER */

// GÅDER http://localhost:5024/gaader
const gaaderRouter = require('./routes/gaader.routes');
app.use('/gaader', gaaderRouter);

// BRUGER http://localhost:5024/bruger
const brugerRouter = require('./routes/bruger.routes');
app.use('/bruger', brugerRouter);


/**STARTER SERVEREN */
app.listen(PORT, () => console.log("server started on port http://localhost:"+PORT));