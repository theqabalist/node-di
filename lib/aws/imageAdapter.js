const {prop, map, find} = require("ramda");
const VError = require("verror").VError;

//AWSReservation :: http://www.amazon.com/...
//reservationFetch :: () -> [AWSReservation]
//fetch :: () -> [AWSReponse]
module.exports = fetch => () => fetch()
    .catch(err => Promise.reject(new VError({
        name: "AWSCommunicationError",
        cause: err
    })))
    .then(prop("Images"))
    .then(map(({ImageId, Tags}) => ({
        id: ImageId,
        type: (find(v => v.Key === "Type", Tags) || {Value: ""}).Value
    })));
