import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
  try {
    console.log ('0')
    const editionDropAddress = await sdk.deployer.deployEditionDrop({
      name: "DiplomaDAO Membership",
      description: "A DAO for my diploma",
      image: readFileSync("scripts/assets/DAOlogo.svg"),
      primary_sale_recipient: AddressZero
    });
    console.log ('1')
    const editionDrop = await sdk.getContract(editionDropAddress, "edition-drop");
    console.log ('2')
    const metadata = await editionDrop.metadata.get();

    console.log("✅ Successfully deployed editionDrop contract, address:", editionDropAddress);
    console.log("✅ editionDrop metadata:", metadata);
  } catch (error) {
    console.log("failed to deploy editionDrop contract", error);
  }
})();