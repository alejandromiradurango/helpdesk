import { Input, Textarea } from '@material-tailwind/react'
import React from 'react'

const FormInput = ({register, error, field, validation = {}, type = 'input', typeInput = 'text', ...inputProps}) => {

    return (
        <div className='flex justify-between items-center gap-[3em] my-[.5em] w-full'>
          <div className='relative w-full mx-auto'>
            {type === 'input' ? (
              <Input
                label={error ? error.message : field}
                error={error && true} 
                id={field}
                className=""
                {...register(field, validation)}
                type={typeInput}
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