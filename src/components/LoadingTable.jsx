import React from 'react'
import Skeleton from 'react-loading-skeleton'

const LoadingTable = () => (
    <div className='mt-1'>
      <Skeleton className='py-3 mb-1' count={20}/>
    </div>
  )

export default LoadingTable