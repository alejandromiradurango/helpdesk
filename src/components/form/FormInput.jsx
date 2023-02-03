import { Input, Textarea } from '@material-tailwind/react'
import React from 'react'

const FormInput = ({register, error, field, validation = {}, type = 'input', ...inputProps}) => {

    return (
        <div className='flex justify-between items-center gap-[3em] my-[.5em] mx-auto w-full'>
          <label className='font-bold uppercase hidden sm:block' htmlFor={field}>{field}:</label>
          <div className='relative w-full md:w-auto'>
            {type === 'input' ? (
              <Input
                label={error ? error.message : field}
                error={error && true} 
                id={field}
                className="md:w-[18em]"
                {...register(field, validation)}
                {...inputProps}
              />
            ) : (
              <Textarea 
                resize
                label={error ? error.message : field}
                error={error && true} 
                id={field}
                className="md:w-[24em]"
                {...register(field, validation)}
                {...inputProps}
              />
            )}
          </div>
        </div>
    )
}

export default FormInput