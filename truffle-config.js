const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = "";

// module.exports = {
//   // See <http://truffleframework.com/docs/advanced/configuration>
//   // for more about customizing your Truffle configuration!
//   networks: {
//     development: {
//       host: "127.0.0.1",
//       port: 7545,
//       network_id: "*" // Match any network id
//     },
//     develop: {
//       port: 8545
//     },
//     compilers: {
//       solc: {
//         version: "^0.5.12" // replace w/ the solc version you need
//       }
//     }
//   }
// };

module.exports = {
  networks: {
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "")
      },
      network_id: 3
    }
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: ''
  }
};