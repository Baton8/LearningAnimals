import { getAccount } from "../web3"
import { contract } from "../token/abi"


export const fetchBalance = async (): Promise<number> => {
  const from = await getAccount()
  const balance = toDisplay(await contract.methods.balanceOf(from).call())
  return balance
}

export const fetchDecimals = async (): Promise<number> => {
  const decimals = await contract.methods.decimals().call()
  return decimals
}

export const toDisplay = (amount: number): number => {
  return amount / (10 ** 18)
}
export const toInternal = (amount: number): number => {
  return amount * (10 ** 18)
}