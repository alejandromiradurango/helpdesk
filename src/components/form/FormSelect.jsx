import React from 'react'

const FormSelect = ({register, error, label, field, validation, options, ...inputProps}) => {
    
    return (
        <div className='flex justify-between items-center gap-[3em] my-[1em] mx-auto w-full'>
          <label className='font-bold uppercase hidden sm:block' htmlFor={field}>{field}:</label>
          <div className='relative w-full md:w-auto'>
            <span className={`absolute -top-2 bg-white px-1 text-xs left-[.7rem] pointer-events-none ${error ? 'text-red-500 z-2' : 'text-[#757e83]'} ${inputProps.disabled && 'hidden'}`}>{error ? error.message : field}</span>
            <select 
                className={`transition-all duration-200 rounded-md border p-2 m-auto w-full md:w-[18em] focus:outline-2 text-sm bg-white ${error ? 'border-red-500 top-0 text-red-500' : 'border-blue-gray-200 focus:border-blue-500 text-blue-gray-700'} disabled:bg-blue-gray-50 disabled:border-0 disabled:appearance-none`}
                {...register(field, validation)}
                {...inputProps}
            >
                <option value="" hidden >Seleccione...</option>
                {options.map(value => (
                    <option key={value} value={value} className='text-blue-gray-700'>
                    {value}
                    </option>
                ))}
            </select>
          </div>
        </div>
    )
}

export default FormSelect