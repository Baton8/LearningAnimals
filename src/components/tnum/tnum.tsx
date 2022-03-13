import { Text } from "@chakra-ui/react"


type Props = {
  number: number,
  length?: number
}

export const Tnum: React.FC<Props> = ({
  number,
  length
}) => {  
  const string = length != null ? number.toString().padStart(length, "0") : number.toString()

  return (
    <>
      {string.split("").map((char, index) => (
        <Text key={index} w="0.6em" display="inline-block" align="center" as="span">{char}</Text>
      ))}
    </>
  )
}
