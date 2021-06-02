import React from "react";
import audio from "./ladida.mp3";
import { Canvas } from "./Canvas";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Canvas audio={audio} />
    </div>
  );
}

export default App;
