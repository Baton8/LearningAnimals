import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea
} from "@chakra-ui/react"
import { useCreateTrackForm } from "src/hooks/useCreateTrackForm"


type Props = {
  isOpen: boolean,
  onClose: () => void,
}

export const TrackCreator: React.FC<Props> = ({
  isOpen,
  onClose
}) => {
  const {isLoading, register, handleSubmitValid} = useCreateTrackForm()

  return (
    <Modal size="3xl" isOpen={isOpen} onClose={onClose} isCentered={true} variant="box">
      <ModalOverlay/>
      <ModalContent as="form" onSubmit={handleSubmitValid}>
        <ModalHeader>
          <Text fontSize="4xl" fontWeight="bold" align="center">
            Become the next quiz organizer!
          </Text>
        </ModalHeader>
        <ModalBody>
          <Box>
            <FormControl>
              <FormLabel fontSize="lg" fontWeight="bold">
                Track title
              </FormLabel>
              <Input variant="box" {...register("title")}/>
            </FormControl>
            <FormControl mt={6}>
              <FormLabel fontSize="lg" fontWeight="bold">
                Track description
              </FormLabel>
              <Textarea h={28} variant="box" {...register("description")}/>
            </FormControl>
            <FormControl mt={6}>
              <FormLabel fontSize="lg" fontWeight="bold">
                Total prize pool
              </FormLabel>
              <Flex align="baseline">
                <Input type="number" step="0.01" variant="box" {...register("prize")}/>
                <Box ml={2}>LAC</Box>
              </Flex>
            </FormControl>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            w={48}
            color="text.white" background="blue.main"
            variant="box" type="submit"
            isLoading={isLoading}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
