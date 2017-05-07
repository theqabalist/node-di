const {chain, prop, map, find} = require("ramda");
const VError = require("verror").VError;

//AWSReservation :: http://www.amazon.com/...
//reservationFetch :: () -> [AWSReservation]
module.exports = reservationFetch => () => reservationFetch()
    .catch(err => Promise.reject(new VError({
        name: "AWSCommunicationError",
        cause: err
    })))
    .then(prop("Reservations"))
    .then(chain(prop("Instances")))
    .then(map(({InstanceId, Tags}) => ({
        id: InstanceId,
        name: (find(v => v.Key === "Name", Tags) || {Value: ""}).Value
    })));
