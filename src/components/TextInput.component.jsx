import React, {useState} from "react";
import {FormControl, TextField} from "@mui/material";
import {Box} from "@mui/system";

const TextInputComponent = ({label, name, type="text", defaultValue="", onChange}) => {

    const [currentText, setCurrentText] = useState(defaultValue);

    const handleOnChange = e => {
        setCurrentText(e.target.value);
        onChange(e);
    }

    return(
        <Box mt={3} width="100%">
            <FormControl fullWidth size="small">
                <TextField value={currentText} name={name} onChange={handleOnChange} variant="outlined" label={label} type={type} size="small"/>
            </FormControl>
        </Box>
    );
}

export default TextInputComponent;