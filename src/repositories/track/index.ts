import dayjs, { Dayjs } from "dayjs"
import { getAccount } from "../web3"
import { contract } from "./abi"


export const fetchTitle = async (): Promise<string> => {
  const result = await contract.methods.title().call()
  return result
}

export const fetchQuizEntryPrize = async (): Promise<string> => {
  const result = await contract.methods.quizEntryPrize().call()
  return result
}

export const fetchArticleEntryPrize = async (): Promise<string> => {
  const prize = await contract.methods.writeArticleEntryPrize().call()
  return prize
}

export const fetchQuizStartDay = async (): Promise<Dayjs> => {
  const rawDay = await contract.methods.quizStartTime().call()
  const day = dayjs(rawDay * 1000)
  return day
}

export const fetchQuizEndDay = async (): Promise<Dayjs> => {
  const rawDay = await contract.methods.quizEndTime().call()
  const day = dayjs(rawDay * 1000)
  return day
}

export const fetchArticleStartDay = async (): Promise<Dayjs> => {
  const rawDay = await contract.methods.articleEntryStartTime().call()
  const day = dayjs(rawDay * 1000)
  return day
}

export const fetchArticleEndDay = async (): Promise<Dayjs> => {
  const rawDay = await contract.methods.articleEntryEndTime().call()
  const day = dayjs(rawDay * 1000)
  return day
}

export type Article = {
  title: string,
  url: string,
  favorites: number,
}

export const fetchArticles = async (): Promise<Article[]> => {
  const articleCount = (await contract.methods.getArticles().call()).length
  const articles = await Promise.all(Array.from({length: articleCount}).map(async (dummy, index) => {
    const rawArticle = await contract.methods.getArticle(index).call()
    const article = {title: rawArticle[0], url: rawArticle[1], favorites: +rawArticle[2]}
    return article 
  }))
  console.log(articles)
  return articles
}

export type Quiz = {
  question: string,
  choices: string[],
  correctIndex: number,
}
const dummyQuestion = "Abji ifeoaho iegh ei aojfe afjoeifj fh rhuao ghoav, si dhgra hugigraih gua uhfea. Shrg, e feu auefaj haufea rh huifarhi?"

export const fetchQuizzes = async (): Promise<any> => {
  const addresses = await contract.methods.quizs().call()
  console.log(addresses)
}

export const fetchQuiz = async (index: number): Promise<Quiz> => {
  const rawQuiz = await contract.methods.getQuiz(index).call()
  return {question: rawQuiz[0] || dummyQuestion, choices: rawQuiz[1], correctIndex: 0}
}

export const answerQuiz = async (choiceIndices: number[], time: number): Promise<void> => {
  console.log("answerQuiz", {choiceIndices, time})
  const from = await getAccount()
  await contract.methods.answerQuestion(choiceIndices, time).send({from})
}

export const createQuiz = async (question: string, choices: string[], correctIndex: number): Promise<void> => {
  console.log("createQuiz", {question, choices, correctIndex})
  const from = await getAccount()
  await contract.methods.createQuiz(question, choices, correctIndex).send({from})
}