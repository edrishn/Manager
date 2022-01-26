import React from "react";
import UserManager from "./UserManager";
function App() {
  const handleChange = (value: any) => {
    console.log("Response: ", value);
  };
  return (
    <div className="App">
      <UserManager serverUrl="https://cu6by.sse.codesandbox.io" />
      {/*<InviteNewUser onChange={handleChange}/>*/}
    </div>
  );
}

export default App;
