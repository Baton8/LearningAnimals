import type { NextPage } from "next";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { QuizPageAvantLayout, QuizPageFinishedLayout, QuizPageMainLayout } from "src/components/quizPageLayout";
import { answerQuiz, fetchSelectedQuiz } from "src/repositories/track";


const QuizPage: NextPage = () => {
  const [mode, setMode] = useState<"avant" | "main" | "finished">("avant")

  const [quizIndex, setQuizIndex] = useState(0)
  const [quizCount] = useState(5)
  const [question, setQuestion] = useState("")
  const [choices, setChoices] = useState(["", "", "", ""])

  const [avantReady, setAvantReady] = useState(false)
  const [quizReady, setQuizReady] = useState(false)

  const choiceIndicesRef = useRef<number[]>([])
  const timeRef = useRef(0)

  useEffect(() => {
    const updateQuiz = async () => {
      const {question, choices} = await fetchSelectedQuiz(quizIndex)
      setQuestion(question)
      setChoices(choices)
      setQuizReady(true)
    }
    updateQuiz()
  }, [quizIndex])

  const handleAvantNext = useCallback(() => {
    setAvantReady(true)
  }, [])

  useEffect(() => {
    if (avantReady && quizReady) {
      setMode("main")
    }
  }, [quizReady, avantReady])

  const handleMainNext = useCallback((choiceIndex: number, elapsedTime: number) => {
    choiceIndicesRef.current[quizIndex] = choiceIndex
    timeRef.current += elapsedTime
    if (quizIndex >= quizCount - 1) {
      answerQuiz(choiceIndicesRef.current, timeRef.current)
      setMode("finished")
    } else {
      setQuizIndex(quizIndex + 1)
      setAvantReady(false)
      setQuizReady(false)
      setMode("avant")
    }
  }, [quizIndex, quizCount])

  return (
    mode === "avant" ? (
      <QuizPageAvantLayout
        quizIndex={quizIndex}
        quizCount={quizCount}
        onNext={handleAvantNext}
      />
    ) : mode === "main" ? (
      <QuizPageMainLayout
        quizIndex={quizIndex}
        quizCount={quizCount}
        question={question}
        choices={choices}
        time={timeRef.current}
        onNext={handleMainNext}
      />
    ) : (
      <QuizPageFinishedLayout
        time={timeRef.current}
      />
    )
  )
}

export default QuizPage;
