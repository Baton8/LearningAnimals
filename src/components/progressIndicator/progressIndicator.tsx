import { Avatar, Box, Button, Flex, FlexProps, Heading, Icon, IconButton, useStyleConfig } from "@chakra-ui/react"


type Props = {
  index: number,
  count: number
}

export const ProgressIndicator: React.FC<Props> = ({
  index,
  count
}) => {  
  return (
    <Flex gap={4}>
      {Array.from({length: count}).map((dummy, eachIndex) => (
        <Flex
          key={eachIndex}
          w={4} h={4}
          rounded="full"
          align="center" justify="center"
          borderWidth="1px"
          borderColor={eachIndex === index ? "text.white" : "transparent"}
        >
          <Box
            w={2} h={2}
            rounded="full"
            borderWidth="1px"
            borderColor="text.white"
            background={eachIndex <= index ? "text.white" : "transparent"}
          />
        </Flex>
      ))}
    </Flex>
  )
}
