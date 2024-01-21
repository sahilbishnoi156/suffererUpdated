import SignUp from '@/Components/Auth/SignUp'
import React from 'react'

export const metadata = {
  title:"SignUp · Sufferer",
}
export default function register() {
  return (
    <div className='bg-black h-full w-screen sticky z-50 top-0 left-0 flex items-center justify-center sm:my-0 my-8'><SignUp/></div>
  )
}
