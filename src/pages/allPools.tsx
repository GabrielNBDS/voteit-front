import React from 'react'
import { GetServerSideProps } from 'next'
import api from '../services/api'

interface IPool {
  id: string
  name: string
}

interface PoolProps {
  pools: IPool[]
}

const Pools: React.FC<PoolProps> = ({ pools }: PoolProps) => {
  return <></>
}

export const getServerSideProps: GetServerSideProps<PoolProps> = async () => {
  const response = await api.get('http://localhost:3333/pools/all')
  const data = response.data

  return {
    props: {
      pools: data
    }
  }
}

export default Pools
