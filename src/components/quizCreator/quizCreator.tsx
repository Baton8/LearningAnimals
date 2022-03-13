import {
  Box,
  Button,
  Flex,
  FlexProps,
  FormControl,
  FormLabel,
  GridItem,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  RadioGroup,
  SimpleGrid,
  Stack,
  Text,
  Textarea
} from "@chakra-ui/react"
import { Fragment, ReactNode } from "react"
import { Controller } from "react-hook-form"
import NextLink from "next/link"
import { useCreateQuizForm } from "src/hooks/useCreateQuizForm"


type Props = {
  isOpen: boolean,
  onClose: () => void,
}

export const QuizCreator: React.FC<Props> = ({
  isOpen,
  onClose
}) => {
  const {isLoading, register, handleSubmitValid} = useCreateQuizForm()

  return (
    <Modal size="3xl" isOpen={isOpen} onClose={onClose} isCentered={true} variant="box">
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>
          <Text fontSize="4xl" fontWeight="bold" align="center">
            Everyone is waiting for your quiz!
          </Text>
        </ModalHeader>
        <ModalBody>
          <Box as="form" onSubmit={handleSubmitValid}>
            <FormControl>
              <FormLabel fontSize="lg" fontWeight="bold">
                Question
              </FormLabel>
              <Textarea h={28} variant="box" {...register("question")}/>
            </FormControl>
            <FormControl mt={6}>
              <FormLabel fontSize="lg" fontWeight="bold">
                Correct answer
              </FormLabel>
              <Input variant="box" {...register("choices.0")}/>
            </FormControl>
            <Box mt={6}>
              <FormLabel fontSize="lg" fontWeight="bold">
                Wrong answers
              </FormLabel>
              <Stack spacing={3}>
                {Array.from({length: 3}).map((dummy, index) => (
                  <FormControl key={index}>
                    <Input variant="box" {...register(`choices.${index + 1}`)}/>
                  </FormControl>
                ))}
              </Stack>
            </Box>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button w={48} color="text.white" background="blue.main" variant="box" type="submit" isLoading={isLoading}>
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
