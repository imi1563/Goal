import React from 'react'

const Loader = () => {
    return (
        <div className="min-h-[50vh] flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
    )
}

export default Loader