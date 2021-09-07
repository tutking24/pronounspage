const dotenv = require('dotenv');

module.exports = () => {
    dotenv.config({ path:__dirname + '/../.env' });
    if (process.env.__INCLUDE) {
        dotenv.config({ path:__dirname + '/../' + process.env.__INCLUDE });
    }
}
