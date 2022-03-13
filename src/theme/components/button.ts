import { background, ComponentStyleConfig } from "@chakra-ui/react"


const button: ComponentStyleConfig = {
  variants: {
    box: (props) => ({
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
        _disabled: {
          background: props.background,
        },
      },
      _active: {
        boxShadow: "0rem 0rem black",
        top: "0.25rem",
        _disabled: {
          background: props.background,
        },        
      },
      _focus: {
        boxShadow: "0rem 0.25rem black",
        top: "0rem",             
      },
      _disabled: {
        opacity: 1,
        boxShadow: "0rem 0.25rem black",
      },
    }),
    invertedBox: (props) => ({
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
        _disabled: {
          background: props.background,
        },
      },
      _active: {
        boxShadow: "0rem 0rem white",
        top: "0.25rem",
        _disabled: {
          background: props.background,
        },            
      },
      _focus: {
        boxShadow: "0rem 0.25rem white",
        top: "0rem",             
      },
      _disabled: {
        opacity: 1,
        boxShadow: "0rem 0.25rem white",
      },
    }),
  },
  defaultProps: {
    colorScheme: "primary"
  }
}

export default button
