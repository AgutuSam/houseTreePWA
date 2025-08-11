import './index.css';
import React from "react";
import { render } from "react-dom";
import { App } from "./App";
import { registerSW } from './registerSW'; 

render(<App />, document.getElementById("root"));

// Register service worker
registerSW();