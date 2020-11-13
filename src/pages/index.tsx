import React from 'react'
import { Button, Flex, Heading, Image, Text } from '@chakra-ui/core'
import Link from 'next/link'

const Home: React.FC = () => {
  return (
    <Flex
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
      flexDir={{ base: 'column-reverse', md: 'row' }}
    >
      <Image width="100%" maxWidth="480px" src="/votingImage.svg" />

      <Flex
        width="100%"
        maxWidth="480px"
        flexDir="column"
        alignItems="center"
        marginBottom={{ base: 8, md: 0 }}
      >
        <Heading as="h1" marginBottom={4}>
          voteit
        </Heading>

        <Text marginBottom={8}>Vote nas melhores pools.</Text>

        <Flex>
          <Link href="allPools">
            <Button colorScheme="blue" marginRight={4}>
              Votar agora
            </Button>
          </Link>

          <Link href="login">
            <Button colorScheme="blue" variant="ghost">
              Criar pools
            </Button>
          </Link>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Home
