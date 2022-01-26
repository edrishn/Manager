import React, { useRef, useState } from "react";
import {TextField, Button} from "@material-ui/core";

export default function InviteResponse(props: any) {
  const { response, onConfirm } = props;
  const textAreaRef = useRef(null);
  const [copySuccess, setCopySuccess] = useState("");

  let responseToShow = "";
  if (response.LoginLink !== "") responseToShow = response.LoginLink;
  else if (response.Message !== "") responseToShow = response.Message;

  const handleButtonClick = (e: any) => {
    // @ts-ignore
    textAreaRef.current.select();
    document.execCommand("copy");
    e.target.focus();
    setCopySuccess("Copied!");
  };

  const handleConfirmClick = () => {
    onConfirm();
  };

  return (
    <div>
      <TextField
        value={responseToShow}
        inputRef={textAreaRef}
        variant="outlined"
      />
      {response.LoginLink !== "" ? (
        <div>
          <Button onClick={handleButtonClick}>Copy</Button>
          <Button onClick={handleConfirmClick}>Confirm</Button> {copySuccess}
        </div>
      ) : (
        <Button onClick={handleConfirmClick}>Confirm</Button>
      )}
    </div>
  );
}
