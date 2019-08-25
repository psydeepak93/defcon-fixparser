const express = require('express');

const app = express();
const port = 8000;
app.use(express.static('build'));
app.listen(port, () =>
    console.log(`FIXParserDashboard listening on port ${port}.`),
);
