import React from 'react'

const AdminProjectLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='container mx-auto px-6 py-20'>{children}</div>
  )
}

export default AdminProjectLayout