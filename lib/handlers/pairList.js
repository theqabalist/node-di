const {curry, pipe} = require("ramda");
const slackPreformatted = s => ["```", s, "```"].join("");

//Factory factory.
//Instance :: Record => {id: String, name: String}
//instanceProvider :: () -> [Instance]
//Table a :: String
//tableFormatter :: (Record a) => [a] -> Table a
module.exports = curry((instanceProvider, format, respond) => instanceProvider()
        .then(pipe(format, slackPreformatted))
        .then(respond)
        .catch(err => respond(`${err.name}: ${err.cause.message}`)));

/*
    class PairListHandler implements Handler {
        construct(provider, formatter) {
            this.provider = provider
            this.formatter = formatter
        }

        handle(responder) {
            provider.provide()
                .then(this.formatter.format)
                .then(responder.respond);
        }
    }
 */
