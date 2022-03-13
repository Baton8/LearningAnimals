import { ComponentStyleConfig } from "@chakra-ui/react"


const button: ComponentStyleConfig = {
  variants: {
    box: {
      h: 12,
      fontWeight: "normal",
      color: "text.black",
      background: "background.white",
      borderWidth: "box",
      borderColor: "text.black",
      boxShadow: "0rem 0.25rem black",
      rounded: "2xl",
      position: "relative",
      top: "0rem",
      transitionProperty: "box-shadow top",
      _hover: {
        boxShadow: "0rem 0rem black",
        top: "0.25rem",
      },
      _active: {
        boxShadow: "0rem 0rem black",
        top: "0.25rem",
      },
      _focus: {
        boxShadow: "0rem 0rem black",
        top: "0.25rem",
      }
    },
    invertedBox: {
      h: 12,
      fontWeight: "normal",
      color: "text.white",
      background: "background.black",
      borderWidth: "box",
      borderColor: "text.white",
      boxShadow: "0rem 0.25rem white",
      rounded: "2xl",
      position: "relative",
      top: "0rem",
      transitionProperty: "box-shadow top",
      _hover: {
        boxShadow: "0rem 0rem white",
        top: "0.25rem",
      },
      _active: {
        boxShadow: "0rem 0rem white",
        top: "0.25rem",
      },
      _focus: {
        boxShadow: "0rem 0rem white",
        top: "0.25rem",
      }
    }
  },
  defaultProps: {
    colorScheme: "primary"
  }
}

export default button
