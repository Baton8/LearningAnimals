import React, { useEffect } from "react"
import { AppInitialProps, AppProps } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"
import theme from "src/theme"
import { contract } from "src/repositories/track/abi"


type Props = AppProps<AppInitialProps>

const App: React.FC<Props> = ({ Component, pageProps }) => {
  useEffect(() => {
    const anyWindow = window as any
    if (anyWindow.ethereum) {
      anyWindow.ethereum.enable()
    }
    console.log(contract)
  }, [])

  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default App
