import { Flex, FlexProps, Heading, Icon, useStyleConfig } from "@chakra-ui/react"


type Props = {
  variant?: string
} & FlexProps

export const WhiteBox: React.FC<Props> = ({
  variant,
  children,
  ...flexProps
}) => {
  const styles = useStyleConfig("WhiteBox", {variant} as any)
  
  return (
    <Flex __css={styles} {...flexProps}>
      {children}
    </Flex>
  )
}
