import { Box, Flex, FlexProps } from "@chakra-ui/react"
import { ReactNode } from "react"
import { Header } from "../header"


type Props = {
  sidebarContent?: ReactNode
} & FlexProps

export const AppContainer: React.FC<Props> = ({
  sidebarContent,
  children,
  ...flexProps
}) => {
  return (
    <>
      <Header/>
      {sidebarContent != null ? (
        <Flex w="full" minH="100vh">
          <Box
            w={64} minH="100vh"
            px={6} pt={32} pb={16}
            background="background.white"
            borderColor="text.black"
            borderRightWidth="box"
          >
            {sidebarContent}
          </Box>
          <Flex
            minH="100vh" px={24} pt={32} pb={16}
            flexGrow="1"
            direction="column"
            align="center"
            background="background.main"
            {...flexProps}
          >
            {children}
          </Flex>
        </Flex>
      ) : (
        <Flex
          w="full" minH="100vh" px={24} pt={32} pb={16}
          direction="column"
          align="center"
          background="background.main"
          {...flexProps}
        >
          {children}
        </Flex>
      )}
    </>
  )
}
