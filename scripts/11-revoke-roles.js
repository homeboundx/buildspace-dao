import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    const token = await sdk.getContract("0xC7E49578F2BbD8Cfd9ed35F426051A080c59827C", "token");
    const allRoles = await token.roles.getAll();

    console.log("👀 Roles that exist right now:", allRoles);

    await token.roles.setAll({ admin: [], minter: [] });
    console.log(
      "🎉 Roles after revoking ourselves",
      await token.roles.getAll()
    );
    console.log("✅ Successfully revoked our superpowers from the ERC-20 contract");

  } catch (error) {
    console.error("Failed to revoke ourselves from the DAO treasury", error);
  }
})();