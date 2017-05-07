const {curry} = require("ramda");
const listHandler = require("../handlers/pairList");
const tableFormatter = require("../formatters/table");

const acknowledge = curry((message, handler, respond) => {
    respond(message);
    return handler(respond);
});

module.exports = curry((acknowledgement, tableName, provider) =>
    acknowledge(acknowledgement,
        listHandler(
            provider,
            tableFormatter(tableName)
        )
    )
);
