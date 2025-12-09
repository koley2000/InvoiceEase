import React from 'react'

const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg--background">
      <div className="bg-foreground p-8 rounded-2xl shadow-lg flex flex-col items-center">
        {/* Spinner */}
        <div className="w-24 h-24 border-4 border-blue-200 border-t-accent rounded-full animate-spin"></div>
        <p className="mt-4 text-accent font-medium text-md animate-pulse">Processing Request</p>
      </div>
    </div>
  )
}

export default Loading