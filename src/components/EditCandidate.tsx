import React, { ChangeEvent, useRef, useState } from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  Image,
  Input,
  InputGroup,
  Text,
  useToast
} from '@chakra-ui/core'
import { FiCamera, FiEdit, FiSave, FiTrash, FiX } from 'react-icons/fi'
import api from '../services/api'

interface IProps {
  id: string
  name: string
  image: string
  short_description: string
  description: string
  deleteCandidate: (id: string) => Promise<void>
}

const EditCandidate: React.FC<IProps> = ({
  deleteCandidate,
  id,
  description: PropDescription,
  image: PropImage,
  name: PropName,
  short_description: PropShortDescription
}) => {
  const toast = useToast()

  const [image, setImage] = useState(PropImage)

  const [name, setName] = useState(PropName)
  const [description, setDescription] = useState(PropDescription)
  const [shortDescription, setShortDescription] = useState(PropShortDescription)

  const [nameBeforeEdit, setNameBeforeEdit] = useState('')
  const [descriptionBeforeEdit, setDescriptionBeforeEdit] = useState('')
  const [shortDescriptionBeforeEdit, setShortDescriptionBeforeEdit] = useState(
    ''
  )

  const [canEdit, setCanEdit] = useState(false)

  const handleChangeImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const formData = new FormData()

      formData.append('image', e.target.files[0])

      const { data } = await api.put(`/candidates/${id}`, formData)
      setImage(data)

      toast({
        title: 'Imagem atualizada.',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
    }
  }

  const handleEdit = () => {
    setNameBeforeEdit(name)
    setDescriptionBeforeEdit(description)
    setShortDescriptionBeforeEdit(shortDescription)

    setCanEdit(true)
  }

  const handleCancel = () => {
    setName(nameBeforeEdit)
    setDescription(descriptionBeforeEdit)
    setShortDescription(shortDescriptionBeforeEdit)

    setCanEdit(false)
  }

  const handleSave = async e => {
    e.preventDefault()
    await api.patch(`/candidates/${id}`, {
      name,
      description,
      short_description: shortDescription
    })

    setCanEdit(false)

    toast({
      title: 'Modificações salvas.',
      status: 'success',
      duration: 3000,
      isClosable: true
    })
  }

  const [isOpen, setIsOpen] = useState(false)
  const onClose = () => {
    setIsOpen(false)
  }
  const cancelRef = useRef()

  return (
    <Box
      borderWidth="1px"
      borderRadius="xl"
      padding={4}
      display="flex"
      flexDir="column"
      alignItems="center"
    >
      <Box position="relative">
        <Image width="215px" height="215px" borderRadius="full" src={image} />

        <Button
          as="label"
          colorScheme="blue"
          position="absolute"
          bottom="0"
          right="15px"
          htmlFor={`avatar-${id}`}
          cursor="pointer"
        >
          <FiCamera />
          <input
            type="file"
            id={`avatar-${id}`}
            style={{ display: 'none' }}
            onChange={handleChangeImage}
          />
        </Button>
      </Box>

      <Box as="form" width="100%" onSubmit={handleSave}>
        <InputGroup flexDir="column" marginTop={8}>
          <Text fontWeight="500" marginBottom={2} marginLeft="2px">
            Nome
          </Text>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={!canEdit}
            required
          />
        </InputGroup>

        <InputGroup flexDir="column" marginTop={4}>
          <Text fontWeight="500" marginBottom={2} marginLeft="2px">
            Descrição curta
          </Text>
          <Input
            value={shortDescription}
            onChange={e => setShortDescription(e.target.value)}
            disabled={!canEdit}
            required
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
            disabled={!canEdit}
            required
          />
        </InputGroup>

        <Flex marginTop={4} justifyContent="space-between">
          {!canEdit ? (
            <>
              <Button
                rightIcon={<FiEdit />}
                colorScheme="blue"
                variant="outline"
                onClick={handleEdit}
              >
                Editar
              </Button>
              <Button
                colorScheme="red"
                rightIcon={<FiTrash />}
                onClick={() => setIsOpen(true)}
              >
                Deletar
              </Button>
            </>
          ) : (
            <>
              <Button
                rightIcon={<FiSave />}
                maxWidth="max-content"
                marginTop={4}
                marginRight={2}
                colorScheme="blue"
                type="submit"
                disabled={
                  name === nameBeforeEdit &&
                  description === descriptionBeforeEdit &&
                  shortDescription === shortDescriptionBeforeEdit
                }
              >
                Salvar
              </Button>
              <Button
                rightIcon={<FiX />}
                maxWidth="max-content"
                marginTop={4}
                colorScheme="blue"
                marginRight="auto"
                variant="ghost"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            </>
          )}
        </Flex>
      </Box>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Deletar candidato?
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza? Isso não poderá ser revertido
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={() => deleteCandidate(id)}
                ml={3}
              >
                Deletar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  )
}

export default EditCandidate
