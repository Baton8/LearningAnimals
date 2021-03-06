import {
  Box,
  Button,
  Flex,
  Stack,
  Text,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import NextLink from "next/link";
import React from "react";
import { AppContainer } from "src/components/appContainer";
import { FaChartLine, FaFile, FaStar, FaUser } from "react-icons/fa";
import { SidebarMenuItem } from "src/components/sidebarMenuItem";
import { WhiteBox } from "src/components/whiteBox";
import useSWR from "swr";
import { fetchBalance } from "src/repositories/token";
import { useRouter } from "next/dist/client/router";
import { fetchTokenEarnAmount, withdrawAnimals, withdrawTokens } from "src/repositories/track";
import { formatNumber } from "src/utils/formatNumber";


const UserPage: NextPage = () => {
  const router = useRouter()
  const mode = (router.query.mode as string | undefined) || "stats"

  const {data: balance} = useSWR("/token/fetchBalance", (url) => fetchBalance())
  const {data: tokenEarnAmount} = useSWR("/token/fetchTokenEarnAmount", (url) => fetchTokenEarnAmount())

  return (
    <AppContainer sidebarContent={(
      <Stack spacing={5}>
        <SidebarMenuItem
          text="Statistics"
          href="/user/stats"
          isActive={mode === "stats"}
          icon={FaChartLine}
          colorScheme="green"
        />
        <SidebarMenuItem
          text="Favorites"
          href="/user/favs"
          isActive={mode === "favs"}
          icon={FaStar}
          colorScheme="yellow"
        />
        <SidebarMenuItem
          text="Back numbers"
          href="/user/tracks"
          isActive={mode === "tracks"}
          icon={FaFile}
          colorScheme="pink"
        />
        <SidebarMenuItem
          text="Settings"
          href="/user/settings"
          isActive={mode === "settings"}
          icon={FaUser}
          colorScheme="blue"
        />
      </Stack>
    )}>
      <Box w="full" maxW="800px">
        <Box>
          <Text mb={2} fontSize="xl" fontWeight="bold">
            Your balance
          </Text>
          <WhiteBox px={8} py={6} variant="box">
            <Box fontSize="2xl" fontWeight="bold">
              {formatNumber(balance, 3)} LAC
            </Box>
          </WhiteBox>
          <Flex mt={4} align="baseline">
            <Button w={48} color="text.white" background="green.main" variant="box" onClick={() => withdrawTokens()}>
              Withdraw coins
            </Button>
            <Text ml={4} as="span">
              <Text fontWeight="bold" as="span">{formatNumber(tokenEarnAmount, 3)} LAC</Text>
              {" "}deposited
            </Text>
          </Flex>
          <Flex mt={4} align="baseline">
            <Button w={48} color="text.white" background="green.main" variant="box" onClick={() => withdrawAnimals()}>
              Withdraw NFTs
            </Button>
          </Flex>
        </Box>
      </Box>
    </AppContainer>
  );
};

export default UserPage;
