import { useToast } from "@chakra-ui/react"
import { useRouter } from "next/dist/client/router"
import { BaseSyntheticEvent, useState } from "react"
import { useForm, UseFormReturn } from "react-hook-form"
import { createQuiz } from "src/repositories/track"


type FormValue = {
  question: string,
  choices: string[],
  correctIndex: string
}

export const useCreateQuizForm = (): {
  handleSubmitValid: (event?: BaseSyntheticEvent) => Promise<void>,
  isLoading: boolean
} & UseFormReturn<FormValue> => {
  const defaultValue = {
    question: "",
    choices: ["", "", "", ""],
    correctIndex: "0"
  }
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const toast = useToast()
  const form = useForm<FormValue>({defaultValues: defaultValue})
  const {handleSubmit} = form

  const onValid = async (formValue: FormValue) => {
    setIsLoading(true)
    try {
      await createQuiz(formValue.question, formValue.choices, +formValue.correctIndex)
      toast({title: "Your quiz is successfully submitted", status: "success"})
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