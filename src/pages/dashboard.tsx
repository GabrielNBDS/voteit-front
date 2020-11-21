import {
  Flex,
  Heading,
  List,
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
  Spinner
} from '@chakra-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import { FiPlus } from 'react-icons/fi'

import CheckAuth from '../components/CheckAuth'
import PoolsList from '../components/PoolsList'
import { useAuth } from '../hooks/auth'
import api from '../services/api'

interface IPool {
  id: string
  name: string
}

interface ICandidate {
  id: string
  name: string
  image: string
  short_description: string
  description: string
}

interface IPoolData {
  pool: IPool
  candidates: ICandidate[]
}

const Dashboard: React.FC = () => {
  const [pools, setPools] = useState<IPool[]>([])
  const [poolName, setPoolName] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [poolToBeDeleted, setPoolToBeDeleted] = useState('')

  const {
    isOpen: CreateModalIsOpen,
    onOpen: CreateModalOnOpen,
    onClose: CreateModalOnClose
  } = useDisclosure()

  const {
    isOpen: AlertIsOpen,
    onOpen: AlertOnOpen,
    onClose: AlertOnClose
  } = useDisclosure()

  const { user } = useAuth()
  const toast = useToast()
  const poolNameRef = useRef(poolName)
  const cancelRef = useRef()

  useEffect(() => {
    poolNameRef.current = poolName
  }, [poolName])

  useEffect(() => {
    async function getData() {
      const { data } = await api.get(`/pools?id=${user.id}`)
      setPools(data)
      setLoaded(true)
    }

    getData()
  }, [])

  const createPool = async e => {
    e.preventDefault()
    const { data } = await api.post('/pools', { name: poolNameRef.current })
    setPools([...pools, data])

    CreateModalOnClose()
    setPoolName('')
    toast({
      title: 'Pool criada.',
      status: 'success',
      duration: 3000,
      isClosable: true
    })
  }

  const deletePool = async () => {
    await api.delete(`/pools/${poolToBeDeleted}`)

    setPools(pools.filter(pool => pool.id !== poolToBeDeleted))

    AlertOnClose()

    toast({
      title: 'Pool deletada.',
      status: 'success',
      duration: 3000,
      isClosable: true
    })
  }

  return (
    <CheckAuth>
      <Flex flexDir="column" paddingY={8} paddingX={4}>
        {user && <Heading>Olá, {user.name}.</Heading>}

        <Text marginTop={8} fontSize={24} fontWeight="500" marginBottom={2}>
          Suas Pools
        </Text>
        {loaded ? (
          pools.length > 0 ? (
            <List spacing={3}>
              {pools.map(pool => (
                <PoolsList
                  key={pool.id}
                  id={pool.id}
                  name={pool.name}
                  setPoolToBeDeleted={setPoolToBeDeleted}
                  AlertOnOpen={AlertOnOpen}
                />
              ))}
            </List>
          ) : (
            <Text>Você ainda não criou pools</Text>
          )
        ) : (
          <Spinner />
        )}

        <Button
          rightIcon={<FiPlus />}
          maxWidth="max-content"
          marginTop={4}
          colorScheme="blue"
          variant="outline"
          onClick={CreateModalOnOpen}
        >
          Criar pool
        </Button>
      </Flex>

      <Modal isOpen={CreateModalIsOpen} onClose={CreateModalOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Criar nova pool</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={createPool}>
              <Input
                type="text"
                placeholder="Nome da pool"
                isRequired
                value={poolName}
                onChange={e => setPoolName(e.target.value)}
              />

              <Button
                type="submit"
                width="100%"
                colorScheme="blue"
                marginTop={4}
              >
                Criar
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={AlertIsOpen}
        leastDestructiveRef={cancelRef}
        onClose={AlertOnClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Deletar pool?
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza? Isso não poderá ser desfeito.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={AlertOnClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={deletePool} ml={3}>
                Deletar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </CheckAuth>
  )
}

export default Dashboard
