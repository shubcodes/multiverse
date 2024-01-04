import React, { useState } from 'react';

interface Frame extends Record<string, unknown> {
  id: number;
  text: string;
  branchId?: number;
}

const initialFrames: Frame[] = [{ id: 1, text: 'Initial Frame' }];

function App() {
  const [frames, setFrames] = useState<Frame[]>(initialFrames);
  const [selectedFrameId, setSelectedFrameId] = useState<number | null>(initialFrames[0].id);
  const [branchIdCounter, setBranchIdCounter] = useState<number>(1);

  const addFrame = (text: string, branchId?: number) => {
    setFrames((prevFrames) => [...prevFrames, { id: Date.now(), text, branchId }]);
    setSelectedFrameId(Date.now());
  };

  const editFrame = (id: number, text: string) => {
    setFrames((prevFrames) =>
      prevFrames.map((frame) => (frame.id === id ? { id, text, branchId: frame.branchId } : frame))
    );
  };

  const branchFrame = (parentFrameId: number, newParentText: string) => {
    const parentFrameIdx = frames.findIndex((frame) => frame.id === parentFrameId);
    if (parentFrameIdx !== -1) {
      const branchedFrames: Frame[] = [];

      const newFrameId = Date.now();
      const newParentFrame = { id: newFrameId, text: newParentText, branchId: branchIdCounter };
      branchedFrames.push(newParentFrame);

      const remainingFrames = frames.splice(parentFrameIdx + 1);
      branchedFrames.push(...remainingFrames);

      setFrames(() => {
        setBranchIdCounter((prevCount) => prevCount + 1);
        return branchedFrames;
      });

      setSelectedFrameId(newFrameId);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const target = event.currentTarget;
      const text = target.value;
      if (text) {
        if (selectedFrameId) {
          editFrame(selectedFrameId, text);
          branchFrame(selectedFrameId, text);
        } else {
          addFrame(text);
        }
      }
    }
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
        <nav>
          {frames.map((frame) => (
            <button key={frame.id} onClick={() => setSelectedFrameId(frame.id)}>
              Frame {frame.id}
            </button>
          ))}
        </nav>
        {selectedFrameId != null && (
          <div>
            <textarea
              value={frames.find((frame) => frame.id === selectedFrameId)?.text ?? ''}
              onKeyDown={handleKeyPress}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;