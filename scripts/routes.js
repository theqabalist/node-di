const AWS = require("aws-sdk");
const ec2 = new AWS.EC2({region: "us-east-1"});
const instanceAdapter = require("../lib/aws/instanceAdapter");
const imageAdapter = require("../lib/aws/imageAdapter");
const responderDecorator = require("../lib/hubot/responderDecorator");

const reservationFetch = () => ec2.describeInstances({Filters: [{Name: "tag:Type", Values: ["pairing"]}]}).promise();
const imageFetch = () => ec2.describeImages({Owners: ["self"]}).promise();

const acknowledgingTableListHandler = require("../lib/components/acknowledgingTableListHandler");

const pairHandler = acknowledgingTableListHandler("Querying for instances", "Pairing Instances",
    instanceAdapter(
        reservationFetch
    )
);

const imageHandler = acknowledgingTableListHandler("Querying for images", "Image List",
    imageAdapter(
        imageFetch
    )
);

/*
<ResponseInjector>
    <Acknowledge message="Querying for instances">
        <PairListHandler>
            <InstanceAdapter>
                <ReservationFetch />
            </InstanceAdapter>
            <TableFormatter name="Pairing Instances" />
        </PairListHandler>
    </Acknowledge>
</ResponseInjector>
 */



module.exports = responderDecorator(robot => {
    robot.respond(/pair list$/i, pairHandler);
    robot.respond(/image list$/i, imageHandler);
});

// (UI) <-> (formatting concerns) <-> (business logic) <-> (extraction/normalization) <-> (backing truth)
