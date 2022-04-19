import React, {useState} from "react";
import {Box} from "@mui/system";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

const SelectInputComponent = ({label, name, options, defaultOption, width="100%", onChange}) =>{

    const [currSelected, setCurrSelected] = useState(defaultOption.value);

    const handleOnChange = e => {
        setCurrSelected(e.target.value);
        onChange(e);
    }

    return(
        <Box mt={3} width={width}>
            <FormControl size="small" fullWidth>
                <InputLabel>{label}</InputLabel>
                <Select name={name} value={currSelected} label={label} onChange={handleOnChange}>
                    {options.map((item, index) => (
                        <MenuItem key={index} value={item.value}>{item.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}

export default SelectInputComponent;