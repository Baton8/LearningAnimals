import { ComponentStyleConfig } from "@chakra-ui/react"


const whiteBox: ComponentStyleConfig = {
  variants: {
    box: {
      fontWeight: "normal",
      color: "text.black",
      background: "background.white",
      borderWidth: "box",
      borderColor: "text.black",
      rounded: "2xl",
    },
    invertedBox: {
      fontWeight: "normal",
      color: "text.white",
      background: "background.black",
      borderWidth: "box",
      borderColor: "text.white",
      rounded: "2xl",
    }
  },
  baseStyle: {
    display: "flex",
  },
}

export default whiteBox
