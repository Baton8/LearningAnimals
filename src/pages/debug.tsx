import {
  Button, Flex,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import React from "react";
import { useRouter } from "next/dist/client/router";
import { createTestQuizzes, createTestTrack } from "src/repositories/track";


const DebugPage: NextPage = () => {
  const router = useRouter()

  return (
    <Flex mx={4} my={4} direction="column" align="flex-start" gap={4}>
      <Button variant="box" onClick={() => createTestQuizzes()}>Create test quizzes</Button>
      <Button variant="box" onClick={() => createTestTrack()}>Create test track</Button>
    </Flex>
  );
};

export default DebugPage;
