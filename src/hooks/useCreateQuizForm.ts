import { useToast } from "@chakra-ui/react"
import { BaseSyntheticEvent, useState } from "react"
import { useForm, UseFormReturn } from "react-hook-form"
import { createQuiz } from "src/repositories/track"


type FormValue = {
  question: string,
  choices: string[],
}

const shuffle = <T>([...array]: T[]): T[] => {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

export const useCreateQuizForm = (): {
  handleSubmitValid: (event?: BaseSyntheticEvent) => Promise<void>,
  isLoading: boolean
} & UseFormReturn<FormValue> => {
  const defaultValue = {
    question: "",
    choices: ["", "", "", ""]
  }
  const [isLoading, setIsLoading] = useState(false)

  const toast = useToast()
  const form = useForm<FormValue>({defaultValues: defaultValue})
  const {handleSubmit} = form

  const onValid = async (formValue: FormValue) => {
    setIsLoading(true)
    try {
      const question = formValue.question
      const augedChoices = shuffle(formValue.choices.map((choice, index) => ({choice, index})))
      const choices = augedChoices.map((augedChoice) => augedChoice.choice)
      const correctIndex = augedChoices.findIndex((augedChoice) => augedChoice.index === 0)
      if (correctIndex >= 0) {
        await createQuiz(question, choices, correctIndex)
        toast({title: "Your quiz is successfully submitted", status: "success"})
      } else {
        throw new Error("cannot happen")
      }
    } catch (e) {
      console.error(e)
      toast({title: "Failed to submit your quiz", status: "error"})
    } finally {
      setIsLoading(false)
    }
  }
  const handleSubmitValid = handleSubmit(onValid)

  return {
    handleSubmitValid,
    isLoading,
    ...form
  }
}