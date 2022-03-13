import { getAccount } from "../web3"
import { contract } from "../token/abi"
import { getContract } from "./abi"


export type Quiz = {
  question: string,
  choices: string[],
  correctIndex: number,
}
const dummyQuestion = "Abji ifeoaho iegh ei aojfe afjoeifj fh rhuao ghoav, si dhgra hugigraih gua uhfea. Shrg, e feu auefaj haufea rh huifarhi?"

export const fetchQuiz = async (address: string): Promise<Quiz> => {
  const contract = getContract(address)
  const rawQuiz = await contract.methods.getQuiz().call()
  const quiz = {question: rawQuiz[0] || dummyQuestion, choices: rawQuiz[1], correctIndex: +rawQuiz[2]}
  return quiz
}