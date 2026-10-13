import React from 'react'
import UserUrl from '../components/RecentUrl'
import UrlForm from '../components/UrlForm.jsx'

const ShortUrls = () => {
  return (
     <div className="min-h-screen sm:mt-10 bg-gray-100 flex flex-col items-center justify-center p-4">
    <div className="bg-white mt-0 p-8 rounded-lg shadow-md w-full max-w-8xl">
      <h1 className="text-2xl font-bold text-center mb-6">URL Shortener</h1>
      <UrlForm/>
      <UserUrl/>
    </div>
  </div>
  )
}

export default ShortUrls
