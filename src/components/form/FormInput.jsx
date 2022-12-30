import React from 'react'

const FormInput = ({register, error, label, field, validation, ...inputProps}) => {
    return (
        <div className='flex justify-between items-center gap-[3em] my-[1em] mx-auto w-[35em]'>
          <label className='font-bold uppercase' htmlFor={field}>{label}</label>
          <div className='relative'>
            <input   
                className={`transition-all duration-200 rounded-md border p-2 w-[18em] outline-none ${error ? 'border-red-500 pt-5' : 'border-[#e2e2e2]'}`}
                {...register(field, validation)}
                id={field}
                name={field}
                {...inputProps}
            />
            {error && <small className='absolute top-1 left-2 font-bold text-red-500'>* {error.message}</small>}
          </div>
        </div>
    )
}

export default FormInput