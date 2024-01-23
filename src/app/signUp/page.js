import SignUp from '@/Components/Auth/SignUp'
import React from 'react'

export const metadata = {
  title:"SignUp · Sufferer",
}
export default function register() {
  return (
    <div className='dark:bg-black bg-white h-full w-screen flex items-center justify-center sm:py-0 py-8'><SignUp/></div>
  )
}
