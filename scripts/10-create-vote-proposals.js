import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

(async () => {
  try {
    const vote = await sdk.getContract("0xcA77b5B6AE2EEd8E7DE7620d571a6271fE073F6c", "vote");
    const token = await sdk.getContract("0xC7E49578F2BbD8Cfd9ed35F426051A080c59827C", "token");
    const amount = 420_000;
    const description = "Должна ли ДАО произвести эмиссию " + amount + " токенов в пул?";
    const executions = [
      {
        toAddress: token.getAddress(),
        nativeTokenValue: 0,
        transactionData: token.encoder.encode(
          "mintTo", [
          vote.getAddress(),
          ethers.utils.parseUnits(amount.toString(), 18),
        ]
        ),
      }
    ];

    await vote.propose(description, executions);

    console.log("✅ Successfully created proposal to mint tokens");
  } catch (error) {
    console.error("failed to create first proposal", error);
    process.exit(1);
  }

  try {
    const vote = await sdk.getContract("0xcA77b5B6AE2EEd8E7DE7620d571a6271fE073F6c", "vote");
    const token = await sdk.getContract("0xC7E49578F2BbD8Cfd9ed35F426051A080c59827C", "token");
    const amount = 6_900;
    const description = "Должна ли ДАО перевести " + amount + " токенов из пула в " +
      process.env.WALLET_ADDRESS + " за выдающиеся усилия по развитию ДАО?";
    const executions = [
      {
        nativeTokenValue: 0,
        transactionData: token.encoder.encode(
          "transfer",
          [
            process.env.WALLET_ADDRESS,
            ethers.utils.parseUnits(amount.toString(), 18),
          ]
        ),
        toAddress: token.getAddress(),
      },
    ];

    await vote.propose(description, executions);

    console.log(
      "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
    );
  } catch (error) {
    console.error("failed to create second proposal", error);
  }
})();