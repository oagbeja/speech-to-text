import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useSpeechWithAudio } from "./hooks/use-speech-to-text";

function App() {
  const [count, setCount] = useState(0);
  const [stmt, setStmt] = useState<Record<string, string>[]>([]);
  const setupVoices = (statement: string, blob: Blob) => {
    setStmt((prev) => [...prev, { [`V${prev.length}`]: statement }]);
    const tempUrl = URL.createObjectURL(blob);
    console.log("Temporary file URL:", tempUrl);
    // Example: Use in <audio> preview
    // const audio = new Audio(tempUrl);
    // audio.play();
  };
  useSpeechWithAudio(setupVoices);
  console.log({ stmt });
  return (
    <>
      <div>
        <a href='https://vite.dev' target='_blank'>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className='card'>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
