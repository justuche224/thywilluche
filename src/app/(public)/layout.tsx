import Header from '@/components/shared/header'
import React from 'react'

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
    <Header/>
    {children}
    </>
  )
}

export default PublicLayout