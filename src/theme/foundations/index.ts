import { ChakraTheme, RecursiveObject } from "@chakra-ui/react"
import { colors } from "./colors"
import { shadows } from "./shadows"
import { borderWidths } from "./borderWidths"
import { typography } from "./typography"


export const foundations: Partial<ChakraTheme & {borderWidths: RecursiveObject}> = {
  colors,
  shadows,
  borderWidths,
  ...typography,
}
