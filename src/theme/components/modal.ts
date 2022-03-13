import { ComponentStyleConfig } from "@chakra-ui/react"


const modal: ComponentStyleConfig = {
  variants: {
    box: {
      dialog: {
        color: "text.black",
        background: "background.main",
        borderWidth: "box",
        borderColor: "text.black",
        rounded: "2xl",
      },
      header: {
        px: 12,
        pt: 8, pb: 6,
      },
      footer: {
        px: 12,
        pt: 6, pb: 8,
        justifyContent: "center",
      },
      body: {
        px: 12, py: 0,
      }
    },
  },
}

export default modal
