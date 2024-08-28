/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'


export const EmptyCart = ({imgScr , message}) => {
  return (
    <div className='flex flex-col items-center justify-center mt-20'>
        <img src={imgScr} alt="No Notes" className='w-60' />
        <p className='w-1/2 text-sm font-medium text-slate-700 text-center leading-7 mt-5'>{message}</p>
    </div>
  )
}
