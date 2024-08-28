import CreatableSelect from 'react-select/creatable'
import { SingleValue } from 'react-select'
import { useMemo } from 'react'
type SelectProps = {
    onCreate:(value?:string)=>void,
    onChange?:(value:string)=>void,
    options:{ label:string , value:string}[],
    value:string|undefined|null,
    disabled?:boolean,
    placeholder:string
}
const Select:React.FC<SelectProps> = ({
    onChange,
    onCreate,
    options,
    value,
    disabled,
    placeholder,
}) => {

    const onSelect = (
        option:SingleValue<{label:string, value:string}> 
    ) =>{
        if(option)onChange?.(option.value);
    }

    const formattedValue = useMemo(()=>{
        return options.find((option)=>option.value==value)
    },[value,options])
    return (
        <CreatableSelect 
            value={formattedValue}
            placeholder={placeholder}
            className='text-sm h-10s'
            styles={{
                control:(base)=>({
                    ...base,
                    borderColor:'#e2e8f0',
                    ':hover':{
                        borderColor:'#e2e8f0',
                    }
                })
            }}
            onChange={onSelect}
            options={options}
            onCreateOption={onCreate}
            isDisabled={disabled}
        />
    )
}

export default Select