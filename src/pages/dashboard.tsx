import {
  Box,
  Flex,
  Heading,
  List,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
  Text,
  Icon,
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
  Spinner,
  InputGroup,
  Image
} from '@chakra-ui/core'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import {
  FiCamera,
  FiChevronDown,
  FiEdit,
  FiPlus,
  FiSave,
  FiTrash,
  FiX
} from 'react-icons/fi'

import CheckAuth from '../components/CheckAuth'
import EditCandidate from '../components/EditCandidate'
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
  pool: {
    id: string
    name: string
  }
  candidates: ICandidate[]
}

const Dashboard: React.FC = () => {
  const [pools, setPools] = useState<IPool[]>([])
  const [poolData, setPoolData] = useState<IPoolData>({} as IPoolData)
  const [poolName, setPoolName] = useState('')
  const [poolToBeDeleted, setPoolToBeDeleted] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [canCreate, setCanCreate] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [image, setImage] = useState<File>()
  const [imageString, setImageString] = useState<string>()

  const {
    isOpen: CreateModalIsOpen,
    onOpen: CreateModalOnOpen,
    onClose: CreateModalOnClose
  } = useDisclosure()

  const {
    isOpen: EditModalIsOpen,
    onOpen: EditModalOnOpen,
    onClose: EditModalOnClose
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
  const scrollToRef = useRef<HTMLDivElement>()

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

  const deletePool = async e => {
    e.preventDefault()
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

  const editPool = async (id: string) => {
    setPoolData({} as IPoolData)
    const { data } = await api.get(`/candidates?id=${id}`)
    setPoolData(data)

    EditModalOnOpen()
  }

  const createCandidate = async (id: string) => {
    const formData = new FormData()

    formData.append('name', name)
    formData.append('short_description', shortDescription)
    formData.append('description', description)
    formData.append('image', image)

    const { data } = await api.post(`/candidates/${id}`, formData)

    const newCandidateArray = [...poolData.candidates, data]
    setPoolData({ pool: poolData.pool, candidates: newCandidateArray })

    setCanCreate(false)

    setName('')
    setDescription('')
    setShortDescription('')
    setImage(null)
    setImageString('')

    toast({
      title: 'Candidato criado.',
      status: 'success',
      duration: 3000,
      isClosable: true
    })
  }

  const cancelCreateCandidate = () => {
    setName('')
    setDescription('')
    setShortDescription('')
    setImage(null)
    setImageString('')

    setCanCreate(false)
  }

  const handleAddimage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0])

      const reader = new FileReader()
      reader.readAsDataURL(e.target.files[0])

      reader.onloadend = function () {
        if (typeof reader.result === 'string') {
          setImageString(reader.result)
        }
      }

      reader.onerror = function (error) {
        console.log('empty file', error)
      }
    }
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
                <Box
                  width={300}
                  borderRadius="md"
                  padding={4}
                  display="flex"
                  alignItems="center"
                  borderWidth={1}
                  key={pool.id}
                >
                  <Text marginRight="auto">{pool.name}</Text>

                  <Menu>
                    <MenuButton colorScheme="blue" as={Button}>
                      <FiChevronDown />
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        minH="48px"
                        display="flex"
                        alignItems="center"
                        onClick={() => editPool(pool.id)}
                      >
                        <Text>Editar pool</Text>
                        <Icon as={FiEdit} marginLeft="auto" />
                      </MenuItem>
                      <MenuItem
                        minH="40px"
                        display="flex"
                        alignItems="center"
                        onClick={() => {
                          setPoolToBeDeleted(pool.id)
                          AlertOnOpen()
                        }}
                      >
                        <Text>Deletar Pool</Text>
                        <Icon as={FiTrash} marginLeft="auto" />
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Box>
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

      <Modal isOpen={EditModalIsOpen} onClose={EditModalOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar pool</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!poolData.candidates ? (
              <Spinner />
            ) : (
              poolData.candidates.map(candidate => (
                <EditCandidate
                  key={candidate.id}
                  id={candidate.id}
                  name={candidate.name}
                  image={candidate.image}
                  description={candidate.description}
                  short_description={candidate.short_description}
                />
              ))
            )}
            {canCreate && (
              <Box
                borderWidth="1px"
                borderRadius="xl"
                padding={4}
                marginBottom={4}
                display="flex"
                flexDir="column"
                alignItems="center"
              >
                <Text fontWeight="500" marginRight="auto" marginBottom={2}>
                  Criar candidato
                </Text>
                <Box position="relative">
                  <Image
                    width="215px"
                    height="215px"
                    borderRadius="full"
                    fallbackSrc="https://via.placeholder.com/215"
                    src={imageString}
                  />

                  <Button
                    as="label"
                    colorScheme="blue"
                    position="absolute"
                    bottom="0"
                    right="15px"
                    htmlFor="avatar"
                    cursor="pointer"
                  >
                    <FiCamera />
                    <input
                      type="file"
                      id="avatar"
                      style={{ display: 'none' }}
                      onChange={handleAddimage}
                    />
                  </Button>
                </Box>

                <InputGroup flexDir="column" marginTop={8}>
                  <Text fontWeight="500" marginBottom={2} marginLeft="2px">
                    Nome
                  </Text>
                  <Input value={name} onChange={e => setName(e.target.value)} />
                </InputGroup>

                <InputGroup flexDir="column" marginTop={4}>
                  <Text fontWeight="500" marginBottom={2} marginLeft="2px">
                    Descrição curta
                  </Text>
                  <Input
                    value={shortDescription}
                    onChange={e => setShortDescription(e.target.value)}
                  />
                </InputGroup>

                <InputGroup flexDir="column" marginTop={4}>
                  <Text fontWeight="500" marginBottom={2} marginLeft="2px">
                    Descrição
                  </Text>
                  <Input
                    as="textarea"
                    onChange={e => setDescription(e.target.value)}
                    value={description}
                  />
                </InputGroup>

                <Flex marginTop={4} marginRight={2} justifyContent="center">
                  <Button
                    rightIcon={<FiSave />}
                    maxWidth="max-content"
                    colorScheme="blue"
                    marginRight={2}
                    onClick={() => createCandidate(poolData.pool.id)}
                  >
                    Salvar
                  </Button>

                  <Button
                    rightIcon={<FiX />}
                    maxWidth="max-content"
                    colorScheme="red"
                    onClick={cancelCreateCandidate}
                  >
                    Cancelar
                  </Button>
                </Flex>
              </Box>
            )}
            {!canCreate && (
              <Button
                rightIcon={<FiPlus />}
                maxWidth="max-content"
                marginTop={4}
                colorScheme="blue"
                onClick={() => {
                  setCanCreate(true)
                  if (scrollToRef) {
                    setTimeout(() => {
                      scrollToRef.current.scrollIntoView({ behavior: 'smooth' })
                    }, 100)
                  }
                }}
              >
                Adicionar novo candidato
              </Button>
            )}

            <div ref={scrollToRef}></div>
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
