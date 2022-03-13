import { getAccount } from "../web3"
import { contract } from "../token/abi"
import { getContract } from "./abi"


export type Quiz = {
  question: string,
  choices: string[],
  correctIndex: number,
}
const dummyQuestion = "This is a dummy question which has no meaning at first glance, but in fact, this has a hidden meaning that changes the world."

export const fetchQuiz = async (address: string): Promise<Quiz> => {
  const contract = getContract(address)
  const rawQuiz = await contract.methods.getQuiz().call()
  const quiz = {question: rawQuiz[0] || dummyQuestion, choices: rawQuiz[1], correctIndex: +rawQuiz[2]}
  return quiz
}