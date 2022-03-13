import { Box, Button, Flex, GridItem, Icon, Image, SimpleGrid, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { WhiteBox } from "src/components/whiteBox";
import NextLink from "next/link";
import { FaStar } from "react-icons/fa";
import useSWR from "swr";
import {
  fetchArticleEntryPrize,
  fetchArticles,
  fetchQuizEndDay,
  fetchQuizEntryPrize,
  fetchQuizStartDay,
  fetchQuizzes,
  fetchTitle
} from "src/repositories/track";
import dayjs, { Dayjs } from "dayjs";
import { AppContainer } from "src/components/appContainer";
import { Tnum } from "src/components/tnum";


// learning (記事投稿フェーズ), open (クイズ解答フェーズ), finished (終了後)
type TrackStatus = "learning" | "open" | "finished"

const getStatus = (quizStartDay: Dayjs | undefined, quizEndDay: Dayjs | undefined): TrackStatus => {
  if (quizStartDay != null && quizEndDay != null) {
    const now = dayjs()
    if (now.isBefore(quizStartDay)) {
      return "learning"
    } else if (now.isBefore(quizEndDay)) {
      return "open"
    } else {
      return "learning"
    }
  } else {
    return "learning"
  }
}

const getRemainingTime = (quizStartDay: Dayjs | undefined, quizEndDay: Dayjs | undefined): [number, number, number, number] => {
  if (quizStartDay != null && quizEndDay != null) {
    const now = dayjs()
    const refDay = now.isBefore(quizStartDay) ? quizStartDay : now.isBefore(quizEndDay) ? quizEndDay : null
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
  const {data: title} = useSWR("/track/fetchTitle", (url) => fetchTitle())
  const {data: quizEntryPrize} = useSWR("/track/fetchQuizEntryPrize", (url) => fetchQuizEntryPrize())
  const {data: articleEntryPrize} = useSWR("/track/fetchArticleEntryPrize", (url) => fetchArticleEntryPrize())
  const {data: quizStartDay} = useSWR("/track/fetchQuizStartDay", (url) => fetchQuizStartDay())
  const {data: quizEndDay} = useSWR("/track/fetchQuizEndDay", (url) => fetchQuizEndDay())
  const {data: articles} = useSWR("/track/fetchArticles", (url) => fetchArticles())
  const {data: quizzes} = useSWR("/track/fetchQuizzes", (url) => fetchQuizzes())

  const status = getStatus(quizStartDay, quizEndDay)
  const [days, hours, minutes, seconds] = getRemainingTime(quizStartDay, quizEndDay)

  const [, setDummy] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setDummy((dummy) => dummy + 1)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <AppContainer
      bgGradient={status === "open" ? "linear(to-br, background.blue.start, background.blue.end)" : "linear(to-br, background.main, background.main)"}
      backgroundAttachment="fixed"
    >
      <Flex
        alignSelf="stretch" mx={-24} px={24} mt={-32} pt={40} pb={12}
        direction="column" align="center"
        background="url('https://images.unsplash.com/photo-1620321023374-d1a68fbc720d')" backgroundSize="cover" backgroundPosition="center"
      >
        <Flex w="full" maxW="1200px" direction="column" align="center">
          <Flex w="full" justify="space-between" align="center">
            <Box color="text.white" textShadow="overImage">
              <Box fontSize="5xl" fontWeight="bold">
                {title || "[Untitled Track]"}
              </Box>
              <Box fontSize="2xl" fontWeight="bold">
                {quizStartDay?.format("DD MMM YYYY · HH:mm")}–{quizEndDay?.format("HH:mm")}
              </Box>
              <Box mt={4}>
                Attend to get: {quizEntryPrize} LAC
              </Box>
            </Box>
            <WhiteBox 
              px={8} pb={6}
              flexDirection="column" alignItems="center"
              background="background.transparent"
              rounded="xl" variant="invertedBox"
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
            {status !== "learning" && (
              <Box mb={2} fontSize="xl" fontWeight="bold" color="text.white" textAlign="center">
                {status !== "open" ? "This track is finished" : (
                  <>
                    {days > 0 && <><Tnum number={days}/>&nbsp;{days === 1 ? "day" : "days"}&nbsp;·&nbsp;</>}
                    {hours > 0 && <><Tnum number={hours} length={2}/>:</>}
                    <Tnum number={minutes} length={2}/>:
                    <Tnum number={seconds} length={2}/>
                  </>
                )}
              </Box>
            )}
            <NextLink href="/quiz" passHref={true}>
              <Button
                w={60} h={16}
                fontSize="xl" fontWeight="bold" color="text.white"
                background={status === "open" ? "red.main" : "background.transparent"}
                variant={status === "open" ? "invertedBox" : "box"}
              >
                {status !== "learning" ? "Start" : (
                  <>
                    {days > 0 && <><Tnum number={days}/>&nbsp;{days === 1 ? "day" : "days"}&nbsp;·&nbsp;</>}
                    {hours > 0 && <><Tnum number={hours} length={2}/>:</>}
                    <Tnum number={minutes} length={2}/>:
                    <Tnum number={seconds} length={2}/>
                  </>
                )}
              </Button>
            </NextLink>
          </Box>
        </Flex>
      </Flex>
      <Box w="full" maxW="1200px">
        {status === "learning" && (
          <Box w="full" maxW="1000px" mt={12} mx="auto" color="text.black">
            <Box>
              <Text align="center" fontSize="2xl" fontWeight="bold">It&apos;s time to study</Text>
            </Box>
            <WhiteBox mt={4} pl={8} pr={2} py={2} alignItems="center" variant="box">
              <Box flexGrow="1">
                <Text fontSize="2xl" fontWeight="bold" lineHeight="shorter">
                  The five quizzes with the most bookmarks<br/>
                  will win the NFTs!
                </Text>
                <Text mt={2} color="text.gray">
                  Whoever submits quizzes will receive:{" "}
                  <Text fontSize="xl" fontWeight="bold" color="green.main" as="span">
                    {articleEntryPrize} LAC
                  </Text>
                </Text>
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
            </WhiteBox>
            <Box mt={6} textAlign="center">
              <NextLink href="/quiz/create" passHref={true}>
                <Button w={48} color="text.white" background="red.main" variant="box">Submit quiz</Button>
              </NextLink>
            </Box>
          </Box>
        )}
        <Box w="full" mt={12} color={status === "open" ? "text.white" : "text.black"}>
          <Box>
            <Text align="center" fontSize="2xl" fontWeight="bold">Quizzes</Text>
            <Text mt={2} fontSize="sm" color={status === "open" ? "text.darkgray" : "text.gray"} align="center" lineHeight="shorter">
              The following are all the quizzes that everyone put together.<br/>
              Read them carefully as you will be asked from them!
            </Text>
          </Box>
          <SimpleGrid mt={8} gap={4} w="full" templateColumns="repeat(2, 1fr)">
            {(articles ?? []).map((article, index) => (
              <GridItem key={index}>
                <WhiteBox
                  w="full" h="full" px={4} py={4}
                  whiteSpace="normal" textAlign="left"
                  flexDirection="column" alignItems="flex-start" justifyContent="space-between"
                  variant={status === "open" ? "invertedBox" : "box"}
                >
                  <Box w="full">
                    <Text w="full" fontWeight="bold">
                      {article.title || "[No question]"}
                    </Text>
                    <SimpleGrid w="full" templateColumns="repeat(2, 1fr)" columnGap={4}>
                      {["Choice 1", "Choice 2", "Choice 3", "Choice 4"].map((choice, index) => (
                        <GridItem key={index} fontWeight={index === 1 ? "bold" : undefined} color={index === 1 ? "red.main" : undefined}>
                          {choice}
                        </GridItem>
                      ))}
                    </SimpleGrid>
                  </Box>
                  <Flex w="full" mt={2} fontWeight="bold" align="center" justify="flex-end">
                    {article.favorites}
                    <Icon
                      w={5} h={5} ml={1}
                      as={FaStar}
                      color="star.off"
                      sx={{"& path": {stroke: status === "open" ? "text.white" : "text.black", strokeWidth: 50}}}
                    />
                  </Flex>
                </WhiteBox>
              </GridItem>
            ))}
          </SimpleGrid>
        </Box>
      </Box>
    </AppContainer>
  );
};

export default TrackPage;
