const Promise = require("bluebird");
const chai = require("chai");
chai.use(require("chai-as-promised"));
chai.should();

const imageAdapter = require("../../../lib/aws/instanceAdapter");

describe("InstanceAdapter", () => {
    context("Correct response is received from fetch.", () => {
        const InstanceId = 5;
        const Value = "garbage";
        const adapter = imageAdapter(() => Promise.resolve({
            Reservations: [{
                Instances: [{
                    InstanceId,
                    Tags: [{Key: "Name", Value}]
                }]
            }]
        }));

        it("Reformats response into simple record.", () => adapter().should.eventually.deep.equal([{
            id: InstanceId,
            name: "garbage"
        }]));
    });

    context("Response is missing name of type.", () => {
        const InstanceId = 5;
        const adapter = imageAdapter(() => Promise.resolve({
            Reservations: [{
                Instances: [{
                    InstanceId,
                    Tags: []
                }]
            }]
        }));

        it("Reformats response into record, but with empty name.", () => adapter().should.eventually.deep.equal([{
            id: InstanceId,
            name: ""
        }]));
    });

    context("Fetch fails.", () => {
        const adapter = imageAdapter(() => Promise.reject(new Error("AWS DONE FUCKED")));

        it("Converts a random AWS error to a meaningful error.", () =>
            adapter()
                .catch(err => {
                    err.name.should.equal("AWSCommunicationError");
                }));
    });
});
