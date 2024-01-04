import React, { useState } from 'react';

interface Frame {
  id: number;
  text: string;
}

const initialFrames: Frame[] = [];

function App() {
  const [frames, setFrames] = useState<Frame[]>(initialFrames);
  const [selectedFrameId, setSelectedFrameId] = useState<number | null>(null);

  const addFrame = (text: string) => {
    setFrames((prevFrames) => [...prevFrames, { id: Date.now(), text }]);
    setSelectedFrameId(Date.now());
  };

  const editFrame = (id: number, text: string) => {
    setFrames((prevFrames) =>
      prevFrames.map((frame) => (frame.id === id ? { id, text } : frame))
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Multiverse Storyboard</h1>
        <button type="button" onClick={() => addFrame('Untitled Frame')}>
          New Frame
        </button>
      </header>
      <main>
        {frames.map((frame) => (
          <div key={frame.id} className={'frame ' + (selectedFrameId === frame.id ? 'selected' : '')}>
            <button type="button" onClick={() => setSelectedFrameId(frame.id)}></button>
            <textarea value={frame.text} onChange={(e) => editFrame(frame.id, e.target.value)}></textarea>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;