import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
    try {
        const editionDropAddress = await sdk.deployer.deployEditionDrop({
            name: "ThisDAO Membership",
            description: "A DAO for people who read this",
            image: readFileSync("scripts/assets/DAOlogo.svg"),
            primary_sale_recipient: AddressZero,
        });

        const editionDrop = sdk.getEditionDrop(editionDropAddress);
        const metadata = await editionDrop.metadata.get();

        console.log("✅ Successfully deployed editionDrop contract, address:", editionDropAddress);
        console.log("✅ editionDrop metadata:", metadata);
    } catch (e) {
        console.log("Failed to deploy editionDrop contract", error);
    }
})();