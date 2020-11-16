import {
  Box,
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure
} from '@chakra-ui/core'
import React from 'react'
import { FiChevronDown, FiEdit, FiTrash } from 'react-icons/fi'
import EditPoolModal from './EditPoolModal'

interface Iprops {
  id: string
  name: string
  AlertOnOpen: () => void
  setPoolToBeDeleted: React.Dispatch<React.SetStateAction<string>>
}

const PoolsList: React.FC<Iprops> = ({
  id,
  name,
  AlertOnOpen,
  setPoolToBeDeleted
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Box
      width={300}
      borderRadius="md"
      padding={4}
      display="flex"
      alignItems="center"
      borderWidth={1}
      key={id}
    >
      <Text marginRight="auto">{name}</Text>

      <Menu>
        <MenuButton colorScheme="blue" as={Button}>
          <FiChevronDown />
        </MenuButton>
        <MenuList>
          <MenuItem
            minH="48px"
            display="flex"
            alignItems="center"
            onClick={onOpen}
          >
            <Text>Editar pool</Text>
            <Icon as={FiEdit} marginLeft="auto" />
          </MenuItem>
          <MenuItem
            minH="40px"
            display="flex"
            alignItems="center"
            onClick={() => {
              setPoolToBeDeleted(id)
              AlertOnOpen()
            }}
          >
            <Text>Deletar Pool</Text>
            <Icon as={FiTrash} marginLeft="auto" />
          </MenuItem>
        </MenuList>
      </Menu>
      <EditPoolModal id={id} isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}

export default PoolsList
