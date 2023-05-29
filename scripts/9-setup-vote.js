import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    const vote = await sdk.getContract("0xcA77b5B6AE2EEd8E7DE7620d571a6271fE073F6c", "vote");
    const token = await sdk.getContract("0xC7E49578F2BbD8Cfd9ed35F426051A080c59827C", "token");
    await token.roles.grant("minter", vote.getAddress());

    console.log(
      "Successfully gave vote contract permissions to act on token contract"
    );
  } catch (error) {
    console.error(
      "failed to grant vote contract permissions on token contract",
      error
    );
    process.exit(1);
  }

  try {
    const vote = await sdk.getContract("0xcA77b5B6AE2EEd8E7DE7620d571a6271fE073F6c", "vote");
    const token = await sdk.getContract("0xC7E49578F2BbD8Cfd9ed35F426051A080c59827C", "token");
    const ownedTokenBalance = await token.balanceOf(
      process.env.WALLET_ADDRESS
    );

    const ownedAmount = ownedTokenBalance.displayValue;
    const percent90 = Number(ownedAmount) / 100 * 90;

    await token.transfer(
      vote.getAddress(),
      percent90
    ); 

    console.log("✅ Successfully transferred " + percent90 + " tokens to vote contract");
  } catch (err) {
    console.error("failed to transfer tokens to vote contract", err);
  }
})();