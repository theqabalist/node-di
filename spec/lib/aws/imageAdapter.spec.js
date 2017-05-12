const Promise = require("bluebird");
const chai = require("chai");
chai.use(require("chai-as-promised"));
chai.should();

const imageAdapter = require("../../../lib/aws/imageAdapter");

describe("ImageAdapter", () => {
    context("Correct response is received from fetch.", () => {
        const ImageId = 5;
        const Value = "garbage";
        const adapter = imageAdapter(() => Promise.resolve({
            Images: [{
                ImageId,
                Tags: [{Key: "Type", Value}]
            }]
        }));

        it("Reformats response into simple record.", () =>
          adapter().should.eventually.deep.equal([{
              id: ImageId,
              type: "garbage"
          }])
        );
    });

    context("Response is missing name of type.", () => {
        const ImageId = 5;
        const adapter = imageAdapter(() => Promise.resolve({
            Images: [{
                ImageId,
                Tags: []
            }]
        }));

        it("Reformats response into record, but with empty name.", () =>
            adapter().should.eventually.deep.equal([{
                id: ImageId,
                type: ""
            }])
        );
    });

    context("Fetch fails.", () => {
        const adapter = imageAdapter(() => Promise.reject(new Error("AWS DONE FUCKED")));

        it("Converts a random AWS error to a meaningful error.", () =>
            adapter().catch(err => {
                err.name.should.equal("AWSCommunicationError");
            })
        );
    });
});
