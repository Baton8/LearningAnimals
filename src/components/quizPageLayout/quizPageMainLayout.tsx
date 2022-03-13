import { Box, Button, Flex, GridItem, SimpleGrid, Text } from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ProgressIndicator } from "src/components/progressIndicator";
import { Tnum } from "../tnum";


type Props = {
  quizIndex: number,
  quizCount: number,
  question: string,
  choices: string[],
  time: number,
  onNext?: (choiceIndex: number, elapsedTime: number) => void
}

export const QuizPageMainLayout: React.FC<Props> = ({
  quizIndex,
  quizCount,
  question,
  choices,
  time,
  onNext,
}) => {
  const [questionLength, setQuestionLength] = useState(0)
  const [currentTime, setCurrentTime] = useState(time)
  
  const startDateRef = useRef<Date | null>(null)
  const tickRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current ++
      if (tickRef.current >= 80) {
        if (tickRef.current === 80) {
          startDateRef.current = new Date()
        }
        if (tickRef.current % 8 === 0) {
          setQuestionLength((length) => length + 1)
        }
      }
    }, 10)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsedTime = startDateRef.current ? new Date().getTime() - startDateRef.current.getTime() : 0
      const currentTime = time + elapsedTime
      setCurrentTime(currentTime)
    }, 17)
    return () => clearInterval(interval)
  })

  const handleChoiceClick = useCallback((choiceIndex: number) => {
    const elapsedTime = startDateRef.current ? new Date().getTime() - startDateRef.current.getTime() : 0
    onNext?.(choiceIndex, elapsedTime)
  }, [onNext])

  const currentMinutes = Math.floor(currentTime / 10 / 100 / 60)
  const currentSeconds = Math.floor(currentTime / 10 / 100 % 60)
  const currentMillis = Math.floor(currentTime / 10 % 100)

  return (
    <Flex
      w="full" h="100vh" px={24} py={12}
      direction="column"
      align="center" justify="center"
      bgGradient="linear(to-br, background.blue.start, background.blue.end)"
    >
      <Box w="full" maxW="800px">
        <Flex color="text.white" direction="column" align="center">
          <ProgressIndicator index={quizIndex} count={quizCount}/>
          <Box fontSize="5xl" fontWeight="bold">
            {quizIndex + 1}
            {quizIndex === 0 ? "st" : quizIndex === 1 ? "nd" : quizIndex === 2 ? "rd" : "th"}{" "}
            Question
          </Box>
          <Box fontSize="2xl">
            <Tnum number={currentMinutes} length={2}/>:
            <Tnum number={currentSeconds} length={2}/>.
            <Tnum number={currentMillis} length={2}/>
          </Box>
        </Flex>
        <Flex mt={20} h={32} color="text.white" fontSize="2xl" lineHeight="tall" align="center">
          {question.slice(0, questionLength)}
        </Flex>
        <SimpleGrid mt={20} mx={20} columnGap={10} rowGap={8} templateColumns="repeat(2, 1fr)">
          {choices.map((choice, index) => (
            <GridItem key={index}>
              <Button
                w="full"
                h={20}
                fontSize="2xl"
                background={`choice.${index}`}
                variant="invertedBox"
                onClick={() => handleChoiceClick(index)}
              >
                {choice}
              </Button>
            </GridItem>
          ))}
        </SimpleGrid>
      </Box>
    </Flex>
  );
};
