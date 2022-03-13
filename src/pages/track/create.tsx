import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  GridItem,
  Icon,
  Input,
  Link,
  Radio,
  RadioGroup,
  SimpleGrid,
  Text,
  Textarea
} from "@chakra-ui/react";
import type { NextPage } from "next";
import NextLink from "next/link";
import React from "react";
import { AppContainer } from "src/components/appContainer";
import { useCreateTrackForm } from "src/hooks/useCreateTrackForm";


const CreateTrackPage: NextPage = () => {
  const {isLoading, register, control, handleSubmitValid} = useCreateTrackForm()

  return (
    <AppContainer>
      <Box w="full" maxW="600px">
        <Text mb={6} fontSize="4xl" fontWeight="bold" align="center">
          Create track
        </Text>
        <Box as="form" onSubmit={handleSubmitValid}>
          <FormControl>
            <FormLabel fontSize="lg" fontWeight="bold">
              Title
            </FormLabel>
            <Input variant="box" {...register("title")}/>
          </FormControl>
          <FormControl mt={6}>
            <FormLabel fontSize="lg" fontWeight="bold">
              Description
            </FormLabel>
            <Textarea h={28} variant="box" {...register("description")}/>
          </FormControl>
          <FormControl mt={6}>
            <FormLabel fontSize="lg" fontWeight="bold">
              Total prize pool
            </FormLabel>
            <Flex align="baseline">
              <Input type="number" variant="box" {...register("prize")}/>
              <Box ml={2}>LAC</Box>
            </Flex>
          </FormControl>
          <Flex mt={6} direction="column" align="center">
            <Button w={48} color="text.white" background="red.main" variant="box" type="submit" isLoading={isLoading}>
              Create
            </Button>
            <NextLink href="/" passHref={true}>
              <Link mt={4}>Back</Link>
            </NextLink>
          </Flex>
        </Box>
      </Box>
    </AppContainer>
  );
};

export default CreateTrackPage;
