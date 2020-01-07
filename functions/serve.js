const dotenv = require('dotenv');

dotenv.config();

const app = require('./app');
const port = process.env.PORT || 3000;  // express needs this to open a door to the world

app.listen(port, () => {
  console.log(`Listening on port ${port}`);  // this turns the server on to "listen" for requests
});
