import {
  loadFixture,
  mineUpTo
} from '@nomicfoundation/hardhat-toolbox-viem/network-helpers'
import { expect } from 'chai'
import hre from 'hardhat'
import { getAddress, parseEther } from 'viem'

describe('Lucid Token', () => {
  async function deploy() {
    const [ owner, alice, bob, charls ] = await hre.viem.getWalletClients()
    const publicClient = await hre.viem.getPublicClient()
    const lucidToken = await hre.viem.deployContract('LucidToken')
    const aliceLucidToken = await hre.viem.getContractAt(
      'LucidToken',
      lucidToken.address,
      { client: { wallet: alice } }
    )

    return {
      owner, alice, bob, charls,
      publicClient,
      lucidToken,
      aliceLucidToken
    }
  }

  describe('Deployment', () => {
    it('Mints total supply to deployer', async () => {
      const { lucidToken, owner } = await loadFixture(deploy)
  
      const totalSupply = await lucidToken.read.totalSupply()
      const ownerBalance = await lucidToken.read.balanceOf(
        [ owner.account.address ]
      )

      expect(ownerBalance).to.equal(totalSupply)
    })
  })

  describe('Burning', () => {
    it('Updates total supply when tokens burned', async () => {
      const { lucidToken } = await loadFixture(deploy)
      const burnedTokens = BigInt(1000 * 10**18)

      const supplyBefore = await lucidToken.read.totalSupply() as bigint
      await lucidToken.write.burn([ burnedTokens ])
      const supplyAfter = await lucidToken.read.totalSupply() as bigint

      expect(supplyAfter).to.equal(supplyBefore - burnedTokens)
    })

    it('Updates total supply when tokens burned from allowance', async () => {
      const {
        lucidToken,
        owner,
        alice,
        aliceLucidToken
      } = await loadFixture(deploy)
      const burnedTokens = BigInt(1000 * 10**18)

      const supplyBefore = await lucidToken.read.totalSupply() as bigint
      await lucidToken.write.approve([ alice.account.address, burnedTokens ])
      await aliceLucidToken.write.burnFrom([
        owner.account.address,
        burnedTokens
      ])
      const supplyAfter = await lucidToken.read.totalSupply() as bigint

      expect(supplyAfter).to.equal(supplyBefore - burnedTokens)
    })

    it('Records total tokens burned by address', async () => {
      const { lucidToken, owner } = await loadFixture(deploy)
      const burnedTokens = BigInt(1000 * 10**18)

      await lucidToken.write.burn([ burnedTokens ])
      const ownerBurnedTokens = await lucidToken.read.getBurnedTokens(
        [ owner.account.address ]
      )

      expect(ownerBurnedTokens).to.equal(burnedTokens)
    })

    it('Records total tokens burned by address from allowance', async () => {
      const {
        lucidToken,
        owner,
        alice,
        aliceLucidToken
      } = await loadFixture(deploy)
      const burnedTokens = BigInt(1000 * 10**18)

      await lucidToken.write.approve([ alice.account.address, burnedTokens ])
      await aliceLucidToken.write.burnFrom([
        owner.account.address,
        burnedTokens
      ])
      const ownerBurnedTokens = await lucidToken.read.getBurnedTokens(
        [ owner.account.address ]
      )

      expect(ownerBurnedTokens).to.equal(burnedTokens)
    })
  })
})
