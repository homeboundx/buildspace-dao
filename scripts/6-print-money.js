import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    const token = await sdk.getContract("0xE64667D0e3721C0b35A73070c9De317F9A18533d", "token");
    const amount = 1_000_000;
    await token.mint(amount);
    const totalSupply = await token.totalSupply();

    console.log("✅ There now is", totalSupply.displayValue, "$DIPLOMAS in circulation");
  } catch (error) {
    console.error("Failed to print money", error);
  }
})();