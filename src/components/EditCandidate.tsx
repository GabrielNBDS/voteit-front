import React, { ChangeEvent, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  InputGroup,
  Text,
  useToast
} from '@chakra-ui/core'
import { FiCamera, FiEdit, FiSave, FiX } from 'react-icons/fi'
import api from '../services/api'

interface ICandidate {
  id: string
  name: string
  image: string
  short_description: string
  description: string
}

const EditCandidate: React.FC<ICandidate> = ({
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

  const handleSave = async () => {
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

  return (
    <Box
      borderWidth="1px"
      borderRadius="xl"
      padding={4}
      marginBottom={4}
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

        {!canEdit ? (
          <Button
            rightIcon={<FiEdit />}
            maxWidth="max-content"
            marginTop={4}
            colorScheme="blue"
            marginRight="auto"
            variant="outline"
            onClick={handleEdit}
          >
            Editar
          </Button>
        ) : (
          <Flex justifyContent="flex-start" width="100%">
            <Button
              rightIcon={<FiSave />}
              maxWidth="max-content"
              marginTop={4}
              marginRight={2}
              colorScheme="blue"
              type="submit"
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
          </Flex>
        )}
      </Box>
    </Box>
  )
}

export default EditCandidate
