import React, { useState } from 'react'

import Link from 'next/link'
import {
  Box,
  Flex,
  Heading,
  Stack,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Button,
  Alert,
  AlertIcon,
  Text,
  Link as ChakraLink
} from '@chakra-ui/core'
import { useRouter } from 'next/router'

import { FiLock, FiMail } from 'react-icons/fi'

import { useAuth } from '../hooks/auth'
import CheckAuth from '../components/CheckAuth'

const Login: React.FC = () => {
  const { signIn } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(false)
    setIsLoading(true)

    try {
      await signIn({
        email,
        password
      })

      router.push('dashboard')
    } catch {
      setError(true)
      setIsLoading(false)
    }
  }

  return (
    <CheckAuth>
      <Flex minH="100vh" alignItems="center" justifyContent="center">
        <Box rounded="lg" width="100%" flexDir="column" textAlign="center">
          <Heading as="h1" marginBottom={8}>
            Login
          </Heading>
          <Flex alignItems="center" flexDir="column">
            <Stack spacing={4}>
              <form onSubmit={HandleSubmit}>
                <InputGroup marginTop={4}>
                  <InputLeftElement
                    color="gray.300"
                    pointerEvents="none"
                    children={<Icon as={FiMail} />}
                  />
                  <Input
                    type="text"
                    placeholder="Email"
                    isRequired
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </InputGroup>

                <InputGroup marginTop={4}>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<Icon as={FiLock} />}
                  />
                  <Input
                    placeholder="Senha"
                    type="password"
                    isRequired
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </InputGroup>

                <Button
                  colorScheme="blue"
                  width="100%"
                  marginY={4}
                  type="submit"
                  isLoading={isLoading}
                >
                  Entrar
                </Button>

                {error && (
                  <Alert marginBottom={2} status="error">
                    <AlertIcon />
                    Credenciais incorretas.
                  </Alert>
                )}

                <Flex width="100%" alignItems="center" justifyContent="center">
                  <Text marginRight={4}>Não possui conta?</Text>
                  <ChakraLink>
                    <Link href="signup">Cadastrar</Link>
                  </ChakraLink>
                </Flex>
              </form>
            </Stack>
          </Flex>
        </Box>
      </Flex>
    </CheckAuth>
  )
}

export default Login
