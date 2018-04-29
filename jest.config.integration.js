const config = require("./jest.config")

module.exports = {
  ...config,
  testMatch: ["**/__tests__/**/*.integration.{t,j}s?(x)"]
}
if (!process.env.AUTH_TOKEN) {
  try {
    const fs = require("fs")
    const path = require("path")
    process.env.AUTH_TOKEN = fs
      .readFileSync(path.join(__dirname, "./.test_token"))
      .toString()
      .trim()
  } catch (e) {
    console.log(
      "auth token not found in ./test_token, make that file and put a google token in it to avoid having to input it now"
    )
    const prompt = require("prompt-sync")()
    process.env.AUTH_TOKEN = prompt.hide(
      "Google auth token (https://developers.google.com/oauthplayground/):"
    )
  }
}
