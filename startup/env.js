const config = require("config")


module.exports = () => {
  if (!config.get("tokenPrivKey")) throw new Error("Please provide tokenPrivKey")
}