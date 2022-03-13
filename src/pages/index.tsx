import { Box, Button, Flex, GridItem, Icon, Image, SimpleGrid, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import React, { useCallback, useEffect, useState } from "react";
import { WhiteBox } from "src/components/whiteBox";
import NextLink from "next/link";
import useSWR from "swr";
import {
  fetchAnswerQuizEndDay,
  fetchAnswerQuizStartDay,
  fetchQuizEntryPrize,
  fetchQuizWinPrize,
  fetchQuizzes,
  fetchTitle,
  startQuiz
} from "src/repositories/track";
import dayjs, { Dayjs } from "dayjs";
import { AppContainer } from "src/components/appContainer";
import { Tnum } from "src/components/tnum";
import { QuizCreator } from "src/components/quizCreator";
import { QuizPane } from "src/components/quizPane";
import { TrackCreator } from "src/components/trackCreator";
import { useRouter } from "next/dist/client/router";


// none (トラック未開催), learning (記事投稿フェーズ), answering (クイズ解答フェーズ), finished (終了後)
export type TrackPhase = "none" | "learning" | "answering" | "finished"

const getPhase = (startDay: Dayjs | undefined, endDay: Dayjs | undefined): TrackPhase => {
  if (startDay != null && endDay != null) {
    const now = dayjs()
    if (now.isBefore(startDay)) {
      return "learning"
    } else if (now.isBefore(endDay)) {
      return "answering"
    } else {
      return "finished"
    }
  } else {
    return "none"
  }
}

const getRemainingTime = (startDay: Dayjs | undefined, endDay: Dayjs | undefined): [number, number, number, number] => {
  if (startDay != null && endDay != null) {
    const now = dayjs()
    const refDay = now.isBefore(startDay) ? startDay : now.isBefore(endDay) ? endDay : null
    if (refDay != null) {
      const days = refDay.diff(now, "day")
      const hours = refDay.diff(now, "hour") % 24
      const minutes = refDay.diff(now, "minute") % 60
      const seconds = refDay.diff(now, "second") % 60
      return [days, hours, minutes, seconds]
    } else {
      return [0, 0, 0, 0]
    }
  } else {
    return [0, 0, 0, 0]
  }
}

const TrackPage: NextPage = () => {
  const router = useRouter()

  const {data: title} = useSWR("/track/fetchTitle", (url) => fetchTitle())

  const {data: quizEntryPrize} = useSWR("/track/fetchQuizEntryPrize", (url) => fetchQuizEntryPrize())
  const {data: quizWinPrize} = useSWR("/track/fetchQuizWinPrize", (url) => fetchQuizWinPrize())

  const {data: answerQuizStartDay} = useSWR("/track/fetchQuizStartDay", (url) => fetchAnswerQuizStartDay())
  const {data: answerQuizEndDay} = useSWR("/track/fetchQuizEndDay", (url) => fetchAnswerQuizEndDay())
  const {data: quizzes} = useSWR("/track/fetchQuizzes", (url) => fetchQuizzes())

  const [isQuizCreatorOpen, setIsQuizCreatorOpen] = useState(false)
  const [isTrackCreatorOpen, setIsTrackCreatorOpen] = useState(false)
  const [isStartLoading, setIsStartLoading] = useState(false)

  const phase = getPhase(answerQuizStartDay, answerQuizEndDay)
  const [days, hours, minutes, seconds] = getRemainingTime(answerQuizStartDay, answerQuizEndDay)

  const handleStartClick = useCallback(async () => {
    setIsStartLoading(true)
    await startQuiz()
    setIsStartLoading(false)
    router.push("/quiz")
  }, [router])

  // カウントダウン更新用
  const [, setDummy] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setDummy((dummy) => dummy + 1)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <AppContainer
      bgGradient={phase === "answering" ? "linear(to-br, background.blue.start, background.blue.end)" : "linear(to-br, background.main, background.main)"}
      backgroundAttachment="fixed"
    >
      <Flex
        alignSelf="stretch" mx={-24} px={24} mt={-32} pt={40} pb={12}
        direction="column" align="center"
        background="url('https://images.unsplash.com/photo-1620321023374-d1a68fbc720d')" backgroundSize="cover" backgroundPosition="center"
      >
        {phase === "none" ? (
          <Flex w="full" direction="column" align="center">
            <Box color="text.white" textShadow="overImage" textAlign="center">
              <Box fontSize="5xl" fontWeight="bold" lineHeight="shorter">
                We are looking for a new quiz organizer!
              </Box>
              <Box mt={2} fontSize="lg">
                Choose the topic for the next quiz competition as you like!
              </Box>
            </Box>
            <Box mt={10}>
              <Button
                w={60} h={16}
                fontSize="xl" fontWeight="bold" color="text.white"
                background="background.transparent"
                variant="box"
                onClick={() => setIsTrackCreatorOpen(true)}
              >
                Create track
              </Button>
            </Box>
          </Flex>
        ) : (
          <Flex w="full" maxW="1200px" direction="column" align="center">
            <Flex w="full" justify="space-between" align="center">
              <Box color="text.white" textShadow="overImage">
                <Box fontSize="5xl" fontWeight="bold" lineHeight="shorter">
                  {title || "[Untitled Track]"}
                </Box>
                <Box fontSize="2xl" fontWeight="bold">
                  {answerQuizStartDay?.format("DD MMM YYYY · HH:mm")}–{answerQuizEndDay?.format("HH:mm")}
                </Box>
                <Box mt={4} fontSize="lg">
                   All participants will receive:{" "}
                   <Text fontWeight="bold" as="span">{quizEntryPrize?.toFixed(3)} LAC</Text><br/>
                   Winners will receive:{" "}
                   <Text fontWeight="bold" as="span">{quizWinPrize?.toFixed(3)} LAC</Text>
                </Box>
              </Box>
              <WhiteBox 
                px={8} pb={6}
                flexDirection="column" alignItems="center"
                background="background.transparent"
                rounded="xl" variant="invBox"
              >
                <Flex
                  h={8} px={10} mt={-4} mb={4}
                  fontWeight="bold" color="text.black" background="background.white"
                  rounded="full"
                  align="center" justify="center"
                >
                  Top 3
                </Flex>
                <Flex gap={4} align="center" color="text.white">
                  <Box textAlign="center">
                    <Box>2nd</Box>
                    <Image w={14} h={14} mt={1} rounded="full" src="http://via.placeholder.com/56x56" alt=""/>
                  </Box>
                  <Box textAlign="center">
                    <Box fontSize="lg">1st</Box>
                    <Image w={20} h={20} mt={1} rounded="full" src="http://via.placeholder.com/80x80" alt=""/>
                  </Box>
                  <Box textAlign="center">
                    <Box>3rd</Box>
                    <Image w={14} h={14} mt={1} rounded="full" src="http://via.placeholder.com/56x56" alt=""/>
                  </Box>
                </Flex>
              </WhiteBox>
            </Flex>
            <Box mt={10}>
              {phase === "answering" || phase === "finished" && (
                <Box mb={2} fontSize="xl" fontWeight="bold" color="text.white" textAlign="center">
                  {phase === "finished" ? "This track is finished" : (
                    <>
                      {days > 0 && <><Tnum number={days}/>&nbsp;{days === 1 ? "day" : "days"}&nbsp;·&nbsp;</>}
                      {hours > 0 && <><Tnum number={hours} length={2}/>:</>}
                      <Tnum number={minutes} length={2}/>:
                      <Tnum number={seconds} length={2}/>
                    </>
                  )}
                </Box>
              )}
              <Button
                w={60} h={16}
                fontSize="xl" fontWeight="bold" color="text.white"
                background={phase === "answering" ? "red.main" : "background.transparent"}
                isDisabled={phase === "learning" ? true : false}
                isLoading={isStartLoading}
                variant={phase === "answering" ? "invBox" : "box"}
                onClick={handleStartClick}
              >
                {phase === "answering" || phase === "finished" ? "Start" : (
                  <>
                    {days > 0 && <><Tnum number={days}/>&nbsp;{days === 1 ? "day" : "days"}&nbsp;·&nbsp;</>}
                    {hours > 0 && <><Tnum number={hours} length={2}/>:</>}
                    <Tnum number={minutes} length={2}/>:
                    <Tnum number={seconds} length={2}/>
                  </>
                )}
              </Button>
            </Box>
          </Flex>
        )}
      </Flex>
      <Box w="full" maxW="1200px">
        {phase === "learning" && (
          <Box w="full" maxW="800px" mt={12} mx="auto" color="text.black">
            <Box>
              <Text align="center" fontSize="2xl" fontWeight="bold">It&apos;s time to study</Text>
            </Box>
            <WhiteBox mt={4} pl={8} pr={2} py={2} alignItems="center" variant="box">
              <Box flexGrow="1">
                <Text fontSize="2xl" fontWeight="bold" lineHeight="shorter">
                  The five quizzes with the most bookmarks<br/>
                  will win the NFTs!
                </Text>
                {/* <Text mt={2} color="text.gray">
                  Whoever submits quizzes will receive:{" "}
                  <Text fontSize="xl" fontWeight="bold" color="green.main" as="span">
                    {0} LAC
                  </Text>
                </Text> */}
              </Box>
              <WhiteBox
                px={8} pt={6} pb={6}
                flexDirection="column" alignItems="center"
                background="green.main"
                rounded="xl"
                variant="box"
              >
                <Flex gap={4} align="center" color="text.white">
                  <Box textAlign="center">
                    <Box fontSize="lg">Top 5</Box>
                    <Image w={20} h={20} mt={1} rounded="full" src="http://via.placeholder.com/80x80" alt=""/>
                  </Box>
                </Flex>
              </WhiteBox>
            </WhiteBox>
            <Box mt={6} textAlign="center">
              <Button w={48} color="text.white" background="red.main" variant="box" onClick={() => setIsQuizCreatorOpen(true)}>
                Submit quiz
              </Button>
            </Box>
          </Box>
        )}
        {phase !== "none" && (
          <Box w="full" mt={12} color={phase === "answering" ? "text.white" : "text.black"}>
            <Box>
              <Text align="center" fontSize="2xl" fontWeight="bold">Quizzes</Text>
              <Text mt={2} fontSize="sm" color={phase === "answering" ? "text.invGray" : "text.gray"} align="center" lineHeight="shorter">
                The following are all the quizzes that everyone put together.<br/>
                Read them carefully as you will be asked from them!
              </Text>
            </Box>
            <SimpleGrid mt={8} gap={6} w="full" templateColumns="repeat(4, 1fr)">
              {(quizzes ?? []).map((quiz, index) => (
                <GridItem key={index}>
                  <QuizPane quiz={quiz} phase={phase}/>
                </GridItem>
              ))}
            </SimpleGrid>
          </Box>
        )}
      </Box>
      <QuizCreator isOpen={isQuizCreatorOpen} onClose={() => setIsQuizCreatorOpen(false)}/>
      <TrackCreator isOpen={isTrackCreatorOpen} onClose={() => setIsTrackCreatorOpen(false)}/>
    </AppContainer>
  );
};

export default TrackPage;
