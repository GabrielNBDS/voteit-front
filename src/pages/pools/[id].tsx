import React, { useState, useCallback, useEffect, useRef } from 'react'

import { GetServerSideProps } from 'next'
import api from '../../services/api'
import io from 'socket.io-client'

import Layout from '../../components/Layout'
import { Box, Button, Grid, Heading, Image, Text } from '@chakra-ui/core'

interface ICandidate {
  id: string
  name: string
  votes: number
  image: string
  short_description: string
  description: string
}

interface PoolProps {
  id: string
  title: string
  staticCandidates: ICandidate[]
}

const Candidates: React.FC<PoolProps> = ({
  id,
  title,
  staticCandidates
}: PoolProps) => {
  const [candidates, setCandidates] = useState<ICandidate[]>(staticCandidates)
  const ref = useRef(candidates)

  useEffect(() => {
    ref.current = candidates
  }, [candidates])

  const vote = useCallback(async id_ => {
    await api.post(`/candidates/vote/${id_}`)
  }, [])

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL)

    socket.on(id, (votedCandidate: ICandidate) => {
      const updatedCandidates = ref.current.map<ICandidate>(candidate => {
        if (candidate.id === votedCandidate.id) {
          return votedCandidate
        } else {
          return candidate
        }
      })
      setCandidates(updatedCandidates)
    })
  }, [])

  return (
    <Layout title={`${title} | voteit`}>
      <Box
        as="header"
        display="flex"
        justifyContent="center"
        alignItems="center"
        paddingY={12}
      >
        <Heading as="h1">{title}</Heading>
      </Box>
      <Grid
        gap={4}
        paddingY={4}
        templateColumns="repeat(auto-fit, minmax(320px, 1fr))"
      >
        {candidates.map(candidate => (
          <Box
            key={candidate.id}
            padding={4}
            display="flex"
            flexDir="column"
            alignItems="center"
          >
            <Box>
              <Image
                width="215px"
                height="215px"
                borderRadius="full"
                src={candidate.image}
              />
            </Box>
            <Box textAlign="center">
              <Text fontWeight="700" fontSize={20} marginY={2}>
                {candidate.name}
              </Text>
              <Text marginBottom={2}>{candidate.short_description}</Text>
              <Text marginBottom={2} fontWeight="500">
                {candidate.votes} votos
              </Text>
              <Button onClick={() => vote(candidate.id)} colorScheme="blue">
                Votar
              </Button>
            </Box>
          </Box>
        ))}
      </Grid>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<PoolProps> = async context => {
  const { id } = context.query
  const id_ = id.toString()

  const response = await api.get(`/candidates?id=${id}`)
  const data = response.data

  return {
    props: {
      id: id_,
      title: data.pool.name,
      staticCandidates: data.candidates
    }
  }
}

export default Candidates
