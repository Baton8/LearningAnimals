import { Box, Button, Flex, GridItem, SimpleGrid, Text } from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { WhiteBox } from "../whiteBox";
import NextLink from "next/link";
import { Tnum } from "../tnum";


type Props = {
  time: number,
}

export const QuizPageFinishedLayout: React.FC<Props> = ({
  time,
}) => {
  const minutes = Math.floor(time / 10 / 100 / 60)
  const seconds = Math.floor(time / 10 / 100 % 60)
  const millis = Math.floor(time / 10 % 100)

  return (
    <Flex
      w="full" h="100vh" px={24} py={12}
      direction="column"
      align="center" justify="center"
      baxkground="background.main"
    >
      <WhiteBox px={24} py={10} flexDirection="column" alignItems="center" variant="invBox">
        <Text>Result</Text>
        <Box mt={-1} fontSize="3xl" color="yellow.main">
          <Tnum number={minutes} length={2}/>:
          <Tnum number={seconds} length={2}/>.
          <Tnum number={millis} length={2}/>
        </Box>
        <Text mt={4} fontSize="3xl" fontWeight="bold" align="center">
          You did a good job!
        </Text>
        <Text align="center">
          The results will be announced in three days.<br/>
          Look forward to it.
        </Text>
        <Box mt={6}>
          <NextLink href="/" passHref={true}>
            <Button w={48} color="text.white" background="red.main" variant="box">Return home</Button>
          </NextLink>
        </Box>
      </WhiteBox>
    </Flex>
  );
};
