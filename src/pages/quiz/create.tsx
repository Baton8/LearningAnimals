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
import React, { Fragment } from "react";
import { AppContainer } from "src/components/appContainer";
import { FaArrowDown } from "react-icons/fa";
import { useCreateQuizForm } from "src/hooks/useCreateQuizForm";
import { Controller } from "react-hook-form";


const CreateQuizPage: NextPage = () => {
  const {isLoading, register, control, handleSubmitValid} = useCreateQuizForm()

  return (
    <AppContainer>
      <Box w="full" maxW="600px">
        <Text mb={6} fontSize="4xl" fontWeight="bold" align="center">
          Submit quiz
        </Text>
        <Box as="form" onSubmit={handleSubmitValid}>
          <FormControl>
            <FormLabel fontSize="lg" fontWeight="bold">
              Question
            </FormLabel>
            <Textarea h={28} variant="box" {...register("question")}/>
          </FormControl>
          <Box mt={6}>
            <Flex mb={2} align="flex-end" justify="space-between">
              <Text fontSize="lg" fontWeight="bold">
                Answer choices
              </Text>
              <Box fontSize="sm" color="text.gray">
                Check the correct answer
                <Icon ml={1} mr={1} mb={-0.5} as={FaArrowDown}/>
              </Box>
            </Flex>
            <Controller control={control} name="correctIndex" render={({field}) => (
              <RadioGroup name="correctIndex" value={field.value} onChange={field.onChange}>
                <SimpleGrid templateColumns="max-content 1fr max-content" rowGap={3} alignItems="center">
                  {Array.from({length: 4}).map((dummy, index) => (
                    <Fragment key={index}>
                      <FormControl display="contents">
                        <GridItem>
                          <FormLabel mb="none">{index + 1}.</FormLabel>
                        </GridItem>
                        <GridItem>
                          <Input variant="box" {...register(`choices.${index}`)}/>
                        </GridItem>
                      </FormControl>
                      <GridItem ml={4}>
                        <Radio size="lg" value={`${index}`}/>
                      </GridItem>                
                    </Fragment>
                  ))}
                </SimpleGrid>
              </RadioGroup>
            )}/>
          </Box>
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

export default CreateQuizPage;
