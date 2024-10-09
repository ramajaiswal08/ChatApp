import React from 'react'

const Input = ({
    label = '',
    name= '',
    type = 'text',
    className = '',
    inputClassName='',
    isRequired = false,
    placeholder = '',
    value = '',
    onChange = () => {},
}) => {
  return (
    <div className={`${className}`}>
        <label for={name} className='block text-sm font-medium text-gray-900 dark:text-gray-300'>{label}</label>
        <input type={type} id={name} className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
          focus:ring-primary focus:border-primary block w-full p-2.5 ${className}`} placeholder={placeholder} required={isRequired} value={value} onChange={onChange}></input>
    </div>
  )
}

export default Input