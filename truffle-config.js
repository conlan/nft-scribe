const HDWalletProvider = require("@truffle/hdwallet-provider");

const mnemonic = "";

module.exports = {
  networks: {
    "live": {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://mainnet.infura.io/v3/")
      },
      network_id: 1
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/")
      },
      network_id: 3
    },
    goerli: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://goerli.infura.io/v3/")
      },
      network_id: '5', // eslint-disable-line camelcase
      gas: 4465030,
      gasPrice: 10000000000,
    },
    compilers: {
      solc: {
        version: "^0.5.12+commit.7709ece9.Emscripten.clang" // replace w/ the solc version you need
      }
    }
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  verify: {
    preamble: "Author: Conlan Rios.\nVersion: 1.0\nSource: https://github.com/conlan/nft-scribe"
  },
  api_keys: {
    etherscan: ''
  }
};
