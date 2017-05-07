const {curry} = require("ramda");
const responseInjector = curry((handler, res) => handler(res.send.bind(res)));

module.exports = spec => robot => {
    const decoratedRobot = {respond: (path, handler) => robot.respond(path, responseInjector(handler))};
    spec(decoratedRobot);
};
