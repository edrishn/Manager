import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import startServer from "./Mirage";

startServer();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
