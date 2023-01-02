import { Input } from '@material-tailwind/react'
import React from 'react'

const FormInput = ({register, error, field, validation, ...inputProps}) => {
    return (
        <div className='flex justify-between items-center gap-[3em] my-[1em] mx-auto w-[35em]'>
          <label className='font-bold uppercase' htmlFor={field}>{field}:</label>
          <div className='relative'>
            <Input
              label={error ? error.message : field}
              error={error} 
              id={field}
              className="w-[18em]"
              {...register(field, validation)}
              {...inputProps}
            />
          </div>
        </div>
    )
}

export default FormInput