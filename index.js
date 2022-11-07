const express = require('express')
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
require('dotenv').config();
const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('api is running')
})

app.listen(port, () => { 
    console.log('server is running on port',port);
})
