import { Option, Select } from '@material-tailwind/react'
import React from 'react'

const FormSelect = ({value, setValue, error, label = true, field, validation, options =[], ...inputProps}) => {
    
    return (
        <div className={`flex justify-between items-center gap-[3em] my-[.5em] mx-auto w-full`}>
          <div className='relative w-full'>
            <Select label={field} className='w-full' value={value} onChange={(e) => setValue(field, e)}>
                {options.map(option => {
                    if(typeof option === 'string'){
                        return (
                        <Option key={option} value={option}>
                            {option}
                        </Option>)
                    } else {
                        return (
                        <Option key={option.value} value={option.value}>
                            {option.text}
                        </Option>
                        )
                    }
                })}
            </Select>
          </div>
        </div>
    )
}

export default FormSelect