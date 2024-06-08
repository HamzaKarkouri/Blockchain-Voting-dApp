/**
* @type import('hardhat/config').HardhatUserConfig
*/

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");



module.exports = {
  solidity: "0.8.11",
 
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {chainId: 1337},
    
  },
};