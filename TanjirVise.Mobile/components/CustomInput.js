import React, { useState, useEffect } from "react";
import { Text } from "react-native";
import { FormControl, Input, WarningOutlineIcon, Pressable, Icon } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

const CustomInput = ({
    label,
    placeholder = "",
    type = "text",
    value,
    onChangeText,
    isRequired = false,
    validateType = null,
    errorMessage,
    showErrors = false,
    onErrorChange,
}) => {
    const [error, setError] = useState("");
    const [touched, setTouched] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        if (touched)
        {
            validate(value);
        }
    }, [value]);

    const validate = (text) => {
        let valid = true;
        setError("");

        if (isRequired && !text)
        {
            setError(`${label} is required`);
            valid = false;
        }

        if (validateType === "email" && text && !/\S+@\S+\.\S+/.test(text))
        {
            setError("Enter a valid email address");
            valid = false;
        }

        if (validateType === "password" && text && text.length < 8)
        {
            setError("Password should be at least 8 characters long");
            valid = false;
        }

        if (onErrorChange)
        {
            onErrorChange(!valid); // Proslijedi da li postoji greška
        }

        return valid;
    };

    const handleBlur = () => {
        setTouched(true);
        validate(value); // Validacija na blur
    };

    return (
        <FormControl isInvalid={ !!error && touched || showErrors }>
            <FormControl.Label>
                <Text style={ { color: '#333', fontSize: 16 } }>
                    { label }{ isRequired ? "*" : "" }
                </Text>
            </FormControl.Label>
            <Input
                size="lg"
                placeholder={ placeholder }
                type={ type === "password" ? !showPassword ? "password" : "text" : type }
                value={ value }
                id={ label }
                borderColor={ "#DDD" }
                borderRadius={ 13 }
                backgroundColor={ 'white' }
                onChangeText={ onChangeText }
                onBlur={ handleBlur }
                autoCapitalize={ type === "email" || type === "password" ? "none" : "sentences" }
                autoComplete={ type === "email" ? "email" : "off" }
                InputRightElement={
                    type === "password" ? (
                        <Pressable onPress={ handleTogglePasswordVisibility }>
                            <Icon
                                as={ <MaterialIcons name={ showPassword ? "visibility" : "visibility-off" } /> }
                                size={ 5 }
                                mr="2"
                                color="muted.400"
                            />
                        </Pressable>
                    ) : null
                }
                keyboardType={ type === "email" ? "email-address" : type === "number" ? "numeric" : "default" }
                multiline={ type === "note" ? true : false }
                numberOfLines={ type === "note" ? 5 : 1 }
                textAlignVertical={ type === "note" ? 'top' : 'auto' }
                _invalid={ {
                    borderColor: '#E6611E', // Custom border color for invalid input
                    _focus: {
                        borderColor: '#E6611E', // Maintain orange border on focus
                    },
                } }
            />
            { (!!error && touched || showErrors) && (
                <FormControl.ErrorMessage
                    id={ "error" + label }
                    leftIcon={ <WarningOutlineIcon size="xs" color="#E6611E" /> }
                >
                    <Text style={ { color: '#E6611E' } }>
                        { errorMessage || error }
                    </Text>
                </FormControl.ErrorMessage>
            ) }
        </FormControl>
    );
};

export default CustomInput;
