module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "minty",
      port: 7545,
      network_id: "*" // Match any network id
    }
  }
};
