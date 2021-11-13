import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import Button from "@material-ui/core/Button";

export default function InviteNewUser(props: any) {
  const { onChange } = props;
  const [codeValue, setCodeValue] = useState("");
  const [numberValue, setNumberValue] = useState("");
  const [username, setUsername] = useState("");

  const handleCodeInputChange = (e: any) => {
    let newValue = e.currentTarget.value;
    setCodeValue(newValue);
  };

  const handleCodeKeyDown = (e: any) => {
    let index = e.currentTarget.selectionStart;
    if (index === 0) {
      if (e.key === "0") e.preventDefault();
    }
    if (index === 3 && e.key !== "Backspace") {
      // @ts-ignore
      document.getElementById("number-input").focus();
    }
  };

  const handleNumberInputChange = (e: any) => {
    let newValue = e.currentTarget.value;
    setNumberValue(newValue);
  };

  const handleNumberKeyDown = (e: any) => {
    let index = e.currentTarget.selectionStart;
    if (index === 0 && e.key === "Backspace") {
      // @ts-ignore
      document.getElementById("code-input").focus();
      e.preventDefault();
    }
  };

  const handleUsernameChange = (e: any) => {
    let value = e.currentTarget.value;
    setUsername(value);
    // onChange(username);
  };

  const handleButtonClick = () => {
    let MobileNumber = "0" + codeValue + numberValue;

    onChange({ Mobile: MobileNumber, Username: username });
  };

  return (
    <div>
      <TextField
        id="username-input"
        value={username}
        variant="outlined"
        placeholder="Username:"
        onChange={handleUsernameChange}
      />
      <TextField
        id="code-input"
        value={codeValue}
        variant="outlined"
        onChange={handleCodeInputChange}
        inputProps={{ maxLength: 3, onKeyDown: handleCodeKeyDown }}
        InputProps={{
          startAdornment: <InputAdornment position="start">0</InputAdornment>,
        }}
      />
      <TextField
        id="number-input"
        value={numberValue}
        variant="outlined"
        onChange={handleNumberInputChange}
        inputProps={{ maxLength: 7, onKeyDown: handleNumberKeyDown }}
      />
      <Button onClick={handleButtonClick}>Confirm</Button>
    </div>
  );
}
