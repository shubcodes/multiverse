import React, { useState } from 'react';

interface Frame extends Record<string, unknown> {
  id: number;
  text: string;
  branchName?: string;
}

const initialFrames: Frame[] = [{ id: 1, text: 'Initial Frame', branchName: 'master' }];

function App() {
  const [frames, setFrames] = useState<Frame[]>(initialFrames);
  const [selectedFrameId, setSelectedFrameId] = useState<number | null>(initialFrames[0].id);

  const addFrame = (text: string, branchName?: string) => {
    const newFrame: Frame = { id: Date.now(), text, branchName };
    setFrames((prevFrames) => [...prevFrames, newFrame]);
    setSelectedFrameId(newFrame.id);
  };

  const branchFrame = (parentFrameId: number, newBranchName: string) => {
    const parentFrameIdx = frames.findIndex((frame) => frame.id === parentFrameId);

    if (parentFrameIdx !== -1) {
      const newBranchFrames: Frame[] = [];
      const parentFrame = frames[parentFrameIdx];
      const newBranchHead = { ...parentFrame, branchName: newBranchName, id: Date.now() };
      newBranchFrames.push(newBranchHead);

      const childFrameIdx = parentFrameIdx + 1;
      if (childFrameIdx < frames.length) {
        const remaningChildFrames = frames.slice(childFrameIdx);
        newBranchFrames.push(...remaningChildFrames);
      }

      setFrames(() => [...frames.slice(0, parentFrameIdx), ...newBranchFrames]);
      setSelectedFrameId(newBranchHead.id);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const target = event.currentTarget;
      const text = target.value;
      if (text) {
        if (selectedFrameId) {
          const frameToEdit = frames.find((frame) => frame.id === selectedFrameId);
          if (frameToEdit?.branchName === 'master') {
            addFrame(text);
          } else {
            editFrame(selectedFrameId, text, frameToEdit?.branchName);
          }
          branchFrame(selectedFrameId, frameToEdit?.branchName ?? 'unknown');
        } else {
          addFrame(text, 'master');
        }
      }
    }
  };

  const editFrame = (id: number, text: string, branchName?: string) => {
    setFrames((prevFrames) =>
      prevFrames.map((frame) => (frame.id === id ? { ...frame, text, branchName } : frame))
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Multiverse Storyboard</h1>
        <button type="button" onClick={() => addFrame('Untitled Frame', 'master')}>
          New Frame
        </button>
      </header>
      <main>
        <nav>
          {frames.map((frame) => (
            <button key={frame.id} onClick={() => setSelectedFrameId(frame.id)}>
              Frame {frame.id}{' '}
              {frame.branchName && (
                <span style={{ color: 'darkgray', fontSize: 'smaller' }}>
                  ({frame.branchName})
                </span>
              )}
            </button>
          ))}
        </nav>
        {selectedFrameId != null && (
          <div>
            <textarea
              value={
                frames.find((frame) => frame.id === selectedFrameId)?.text ?? ''
              }
              onKeyDown={handleKeyPress}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;