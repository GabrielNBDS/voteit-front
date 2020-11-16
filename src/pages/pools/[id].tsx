import React, { useState, useCallback, useEffect, useRef } from 'react'

import { GetServerSideProps } from 'next'
import api from '../../services/api'
import io from 'socket.io-client'

import Layout from '../../components/Layout'
import { Flex } from '@chakra-ui/core'

interface ICandidate {
  id: string
  name: string
  votes: number
  image: string
  // eslint-disable-next-line camelcase
  short_description: string
  description: string
}

interface PoolProps {
  id: string
  title: string
  staticCandidates: ICandidate[]
}

export default function Candidates({ id, title, staticCandidates }: PoolProps) {
  const [candidates, setCandidates] = useState<ICandidate[]>(staticCandidates)
  const ref = useRef(candidates)

  useEffect(() => {
    ref.current = candidates
  }, [candidates])

  const vote = useCallback(async id_ => {
    await api.post(`/candidates/vote/${id_}`)
  }, [])

  useEffect(() => {
    const socket = io(process.env.API_URL)

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
      <Flex>teste</Flex>
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
