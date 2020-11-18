import {
  Box,
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  IconButton,
  Image,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useToast
} from '@chakra-ui/core'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { FiCamera, FiCheck, FiEdit, FiPlus, FiSave, FiX } from 'react-icons/fi'
import api from '../services/api'
import EditCandidate from './EditCandidate'

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

interface IProps {
  id: string
  isOpen: boolean
  onClose: () => void
}

const EditPoolModal: React.FC<IProps> = ({ isOpen, onClose, id }) => {
  const toast = useToast()
  const [poolData, setPoolData] = useState<IPoolData>({} as IPoolData)

  const [canCreate, setCanCreate] = useState(false)
  const [canEditName, setCanEditName] = useState(false)
  const [poolName, setPoolName] = useState('')

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [image, setImage] = useState<File>()
  const [imageString, setImageString] = useState<string>()

  const scrollToRef = useRef<HTMLDivElement>()

  useEffect(() => {
    async function getData() {
      const { data } = await api.get(`/candidates?id=${id}`)
      setPoolData(data)
      setPoolName(data.pool.name)
    }

    getData()
  }, [])

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

  const cancelCreateCandidate = () => {
    setName('')
    setDescription('')
    setShortDescription('')
    setImage(null)
    setImageString('')

    setCanCreate(false)
  }

  const createCandidate = async () => {
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

  const deleteCandidate = async (id: string) => {
    await api.delete(`/candidates/${id}`)
    const filteredArray = poolData.candidates.filter(
      candidate => candidate.id !== id
    )
    setPoolData({ pool: poolData.pool, candidates: filteredArray })

    toast({
      title: 'Candidato deletado.',
      status: 'success',
      duration: 3000,
      isClosable: true
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {poolData.pool && (
            <Editable defaultValue={poolData.pool.name}>
              <EditablePreview />
              <EditableInput />
            </Editable>
          )}
        </ModalHeader>
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
                deleteCandidate={deleteCandidate}
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
                  onClick={createCandidate}
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
  )
}

export default EditPoolModal
