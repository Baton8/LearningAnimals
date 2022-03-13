import { Box, Button, Flex, GridItem, SimpleGrid } from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ProgressIndicator } from "src/components/progressIndicator";


type Props = {
  quizIndex: number,
  quizCount: number,
  onNext?: () => void
}

export const QuizPageAvantLayout: React.FC<Props> = ({
  quizIndex,
  quizCount,
  onNext,
}) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      onNext?.()
    }, 3000)
    return () => clearTimeout(timeout)
  }, [onNext])

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
        </Flex>
      </Box>
    </Flex>
  );
};
