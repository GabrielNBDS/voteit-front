import React, { useState } from 'react'

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
import Link from 'next/link'

import { FiLock, FiMail, FiUser } from 'react-icons/fi'

import api from '../services/api'

const Login: React.FC = () => {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const HandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(false)
    setIsLoading(true)

    try {
      await api.post('/users', { name, email, password })

      router.push('login')
    } catch (error) {
      setError(true)
      setIsLoading(false)
    }
  }

  return (
    <>
      <Flex minH="100vh" alignItems="center" justifyContent="center">
        <Box width="100%" flexDir="column" textAlign="center">
          <Heading as="h1" marginBottom={8}>
            Cadastro
          </Heading>
          <Flex alignItems="center" flexDir="column">
            <Stack spacing={4}>
              <form onSubmit={HandleSubmit}>
                <InputGroup>
                  <InputLeftElement
                    color="gray.300"
                    pointerEvents="none"
                    children={<Icon as={FiUser} />}
                  />
                  <Input
                    type="text"
                    placeholder="Nome"
                    isRequired={true}
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </InputGroup>

                <InputGroup marginTop={4}>
                  <InputLeftElement
                    color="gray.300"
                    pointerEvents="none"
                    children={<Icon as={FiMail} />}
                  />
                  <Input
                    type="text"
                    placeholder="Email"
                    isRequired={true}
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
                    isRequired={true}
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
                  <Text marginRight={4}>Já possui conta?</Text>
                  <ChakraLink>
                    <Link href="login">
                      <a>Login</a>
                    </Link>
                  </ChakraLink>
                </Flex>
              </form>
            </Stack>
          </Flex>
        </Box>
      </Flex>
    </>
  )
}

export default Login
