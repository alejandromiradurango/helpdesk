import { Option, Select } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'

const FormSelect = ({register, error, label, field, validation, options, data = '', ...inputProps}) => {

    const [value, setValue] = useState(null);

    useEffect(() => {
        setValue(data)
    }, [])
    

    return (
        <div className='flex justify-between items-center gap-[3em] my-[1em] mx-auto w-[35em]'>
          <label className='font-bold uppercase' htmlFor={field}>{field}:</label>
          <div className='relative'>
            {/* <select 
                className={`transition-all duration-200 rounded-md border p-2 w-[18em] outline-none bg-white ${error ? 'border-red-500 pt-5' : 'border-[#e2e2e2]'}`}
                {...register(field, validation)}
                {...inputProps}
            >
                <option value="" hidden selected disabled className='text-gray-500'>{inputProps.placeholder}</option>
                {options.map(value => (
                    <option key={value} value={value}>
                    {value}
                    </option>
                ))}
            </select> */}
            <Select 
                value={value}
                label={error ? error.message : field}
                error={error}
                className="w-[18em]"
                {...register(field, validation)}    
            >
                {options.map(value => (
                    <Option key={value} value={value}>{value}</Option>
                ))}
            </Select>
            {error && <small className='absolute top-1 left-2 font-bold text-red-500'>* {error.message}</small>}
          </div>
        </div>
    )
}

export default FormSelect