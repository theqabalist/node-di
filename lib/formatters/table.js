const AsciiTable = require("ascii-table");
const {curry, head, keys, values, map} = require("ramda");

//Title :: String
//Records :: (Record a) => [a]
module.exports = curry((title, records) => {
    const heading = keys(head(records));
    const rows = map(values, records);
    return AsciiTable.factory({title, heading, rows});
});
