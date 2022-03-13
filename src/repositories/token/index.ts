import { getAccount } from "../web3"
import { contract } from "../token/abi"


export const fetchBalance = async (): Promise<number> => {
  const from = await getAccount()
  const balance = await contract.methods.balanceOf(from).call()
  return balance
}