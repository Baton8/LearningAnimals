import { Box, Button, Flex, Icon, Stack, Text } from "@chakra-ui/react"
import { useState } from "react"
import { FaStar } from "react-icons/fa"
import { Quiz } from "src/repositories/track"


type Props = {
  quiz: Quiz,
  phase: string,
}

export const QuizPane: React.FC<Props> = ({
  quiz,
  phase,
}) => {
  const [showAnswer, setShowAnswer] = useState(false)

  return (
    <Button
      w="full" h="full" px={4} py={4}
      whiteSpace="normal" textAlign="left"
      flexDirection="column" alignItems="flex-start" justifyContent="space-between"
      variant={phase === "answering" ? "invBox" : "box"}
      onClick={() => setShowAnswer((answer) => !answer)}
    >
      <Box w="full">
        <Text fontWeight="bold" lineHeight="shorter">
          {quiz.question || "[Question text unspecified]"}
        </Text>
      </Box>
      <Stack mt={2} spacing={1}>
        {quiz.choices.map((choice, index) => (
          <Text
            key={index}
            lineHeight="shorter"
            fontWeight={showAnswer && quiz.correctIndex === index ? "bold" : undefined}
            color={showAnswer ? (
              quiz.correctIndex === index ? "green.main" : (phase === "answering" ? "text.invLightgray" : "text.lightgray")
            ) : (
              "text.gray"
            )}
          >
            {choice}
          </Text>
        ))}
      </Stack>
      <Flex w="full" mt={3} align="center" justify="space-between">
        <Box
          px={2} py={1}
          fontSize="sm"
          color={phase === "answering" ? "background.black" : "background.white"}
          background={phase === "answering" ? "text.white" : "text.black"}
          rounded="full"
        >
          Click to {showAnswer ? "hide" : "show"} answer
        </Box>
        <Flex fontWeight="bold" align="center">
          {0}
          <Icon
            w={5} h={5} ml={1}
            as={FaStar}
            color="star.off"
            sx={{"& path": {stroke: phase === "answering" ? "text.white" : "text.black", strokeWidth: 50}}}
          />
        </Flex>
      </Flex>
    </Button>
  )
}
