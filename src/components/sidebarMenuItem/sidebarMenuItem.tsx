import { Flex, Icon, Link, Text } from "@chakra-ui/react"
import { IconType } from "react-icons/lib"
import NextLink from "next/link"


type Props = {
  text: string,
  href: string,
  icon: IconType,
  isActive?: boolean,
  colorScheme: string,
}

export const SidebarMenuItem: React.FC<Props> = ({
  text,
  href,
  icon,
  isActive,
  colorScheme,
}) => {
  return (
    <NextLink href={href} passHref={true}>
      <Link>
        <Flex background={isActive ? `${colorScheme}.light` : undefined} rounded="full" align="center">
          <Flex
            w={12} h={12}
            background={isActive ? `${colorScheme}.main` : "background.gray"}
            borderWidth="box" borderColor="text.black"
            rounded="full"
            align="center" justify="center"
          >
            <Icon w={6} h={6} as={icon}/>
          </Flex>
          <Text ml={2} fontSize="lg" fontWeight="bold">
            {text}
          </Text>
        </Flex>
      </Link>
    </NextLink>
  )
}
