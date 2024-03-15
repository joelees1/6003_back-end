/** Starts the Koa server on a specified port.
 * @function startServer
 * @memberof index
 * @param {number} [port=3000] - The port to listen on.
 */

const app = require('./app');
let port = process.env.PORT || 3030;
app.listen(port);
console.log(`API server running on port ${port}`)
