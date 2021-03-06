import { useToast } from "@chakra-ui/react"
import { BaseSyntheticEvent, useState } from "react"
import { useForm, UseFormReturn } from "react-hook-form"
import { createTrack } from "src/repositories/track"


type FormValue = {
  title: string,
  description: string,
  prize: number
}

export const useCreateTrackForm = (): {
  handleSubmitValid: (event?: BaseSyntheticEvent) => Promise<void>,
  isLoading: boolean
} & UseFormReturn<FormValue> => {
  const defaultValue = {
    title: "",
    description: "",
    prize: 10
  }
  const [isLoading, setIsLoading] = useState(false)

  const toast = useToast()
  const form = useForm<FormValue>({defaultValues: defaultValue})
  const {handleSubmit} = form

  const onValid = async (formValue: FormValue) => {
    setIsLoading(true)
    try {
      await createTrack(formValue.title, formValue.description, formValue.prize)
      toast({title: "The track is successfully created", status: "success"})
    } catch (e) {
      console.error(e)
      toast({title: "Failed to create the track", status: "error"})
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