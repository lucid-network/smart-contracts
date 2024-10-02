import type { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox-viem'
import 'solidity-coverage'

const config: HardhatUserConfig = {
  paths: {
    sources: 'src'
  },
  solidity: "0.8.20"
}

export default config
