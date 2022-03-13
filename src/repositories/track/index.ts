import axios from "axios"
import dayjs, { Dayjs } from "dayjs"
import { fetchQuiz, Quiz } from "../quiz"
import { toDisplay, toInternal } from "../token"
import { getAccount } from "../web3"
import { contract } from "./abi"


export const fetchTitle = async (): Promise<string> => {
  const result = await contract.methods.title().call()
  return result
}

// クイズコンペティション参加者への支払額
export const fetchQuizEntryPrize = async (): Promise<number> => {
  const prize = toDisplay(await contract.methods.quizEntryPrize().call())
  return prize
}

// クイズコンペティション上位者への支払額
export const fetchQuizWinPrize = async (): Promise<number> => {
  const prize = toDisplay(await contract.methods.quizWinPrize().call())
  return prize
}

export const fetchCreateQuizStartDay = async (): Promise<Dayjs> => {
  const rawDay = await contract.methods.quizCreateEntryStartTime().call()
  const day = dayjs(rawDay * 1000)
  return day
}

export const fetchCreateQuizEndDay = async (): Promise<Dayjs> => {
  const rawDay = await contract.methods.quizCreateEntryEndTime().call()
  const day = dayjs(rawDay * 1000)
  return day
}

export const fetchAnswerQuizStartDay = async (): Promise<Dayjs> => {
  const rawDay = await contract.methods.quizStartTime().call()
  const day = dayjs(rawDay * 1000)
  return day
}

export const fetchAnswerQuizEndDay = async (): Promise<Dayjs> => {
  const rawDay = await contract.methods.quizEndTime().call()
  const day = dayjs(rawDay * 1000)
  return day
}

export const fetchTokenEarnAmount = async (): Promise<number> => {
  const from = await getAccount()
  const amount = toDisplay(await contract.methods.earnAmountOf(from).call())
  return amount
}

// 投稿された全てのクイズ
export const fetchQuizzes = async (): Promise<Quiz[]> => {
  const addresses = await contract.methods.getQuizzes().call() as string[]
  console.log("fetchQuizzes/response", addresses)
  const quizzes = await Promise.all(addresses.map(async (address) => {
    const quiz = await fetchQuiz(address)
    return quiz
  }))
  return quizzes
}

// クイズコンペティションで出題する選ばれたクイズ
export const fetchSelectedQuiz = async (index: number): Promise<Omit<Quiz, "correctIndex">> => {
  const rawQuiz = await contract.methods.getSelectedQuizzes(index).call()
  const quiz = {question: rawQuiz[0], choices: rawQuiz[1]}
  return quiz
}

// クイズコンペティションに参加するときに呼ぶ
// TODO: これは暫定的な方法です
export const startQuiz = async (): Promise<void> => {
  const from = await getAccount()
  await contract.methods.startQuiz().send({from})
}

export const answerQuiz = async (choiceIndices: number[], time: number): Promise<void> => {
  console.log("answerQuiz/request", {choiceIndices, time})
  const from = await getAccount()
  await contract.methods.answerQuestion(choiceIndices, time).send({from})
}

export const createQuiz = async (question: string, choices: string[], correctIndex: number): Promise<void> => {
  console.log("createQuiz/request", {question, choices, correctIndex})
  const from = await getAccount()
  await contract.methods.createQuiz(question, choices, correctIndex).send({from})
}

export const createTrack = async (title: string, description: string, prize: number): Promise<void> => {
  const internalPrize = toInternal(prize)
  console.log("createTrack/request", {title, description, internalPrize})
  const from = await getAccount()
  await contract.methods.restartTrack(title, description).send({from})
}

export const fetchDealtAnimalSpecs = async (): Promise<any[]> => {
  const urls = await contract.methods.earnNfts().call() as string[]
  const specs = await Promise.all(urls.map(async (url) => {
    return axios.get(url).then((res) => res.data)
  }))
  console.log("fetchDealtAnimalSpecs/response", specs)
  return specs
}

export const withdrawTokens = async (): Promise<void> => {
  const from = await getAccount()
  await contract.methods.withdraw().send({from})
}

export const withdrawAnimals = async (): Promise<void> => {
  const from = await getAccount()
  await contract.methods.transferNft().send({from})
}

// TODO: テスト用なので本番では使わないで
export const createTestTrack = async (): Promise<void> => {
  const from = await getAccount()
  await contract.methods.restartTrack("Dive into Web3 with IPFS", "Description").send({from})
}

// TODO: テスト用なので本番では使わないで
export const createTestQuizzes = async (): Promise<void> => {
  const from = await getAccount()
  await Promise.all(Array.from({length: 5}).map(async (dummy, index) => {
    if (index === 0) {
      await contract.methods.createQuiz(
        "Which is the unabbreviated name of IPFS?",
        ["InterPlanetary File System", "Internet File System", "InterPlanetary Folder System", "InterPlanetary Full System"],
        0
      ).send({from})
    } else if (index === 1) {
      await contract.methods.createQuiz(
        "Which is the developer of IPFS?",
        ["Ethereum", "Protocol Labs", "Bitcoin", "Alphabet"],
        1
      ).send({from})      
    } else if (index === 2) {
      await contract.methods.createQuiz(
        "Which is the virtual currency used on IPFS that is given according to the time and amount of storage provided?",
        ["Chainlink", "Ethereum", "Filecoin", "Bitcoin"],
        2
      ).send({from})  
    } else {
      await contract.methods.createQuiz(
        "Which is the unabbreviate term for P2P?",
        ["Pay to Pay", "Peer to Peer", "Person to Person", "Pot to Pot"],
        1
      ).send({from})  
    }
  }))
}