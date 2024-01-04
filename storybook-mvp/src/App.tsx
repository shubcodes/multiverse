import React, { useState } from 'react';

interface Frame {
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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const target = event.currentTarget;
      const text = target.value;
      if (text) {
        if (selectedFrameId) {
          editFrame(selectedFrameId, text);
        } else {
          addFrame(text);
        }
      }
    }
  };

  const mergeBranches = (originalBranchId?: number, mergedBranchId?: number) => {
    setFrames((prevFrames) => {
      const originalBranch = prevFrames.filter((frame) => frame.branchId === originalBranchId);
      const mergedBranch = prevFrames.filter((frame) => frame.branchId === mergedBranchId);
      return [...originalBranch, ...mergedBranch];
    });
  };

  const branchFromFrame = (id: number) => {
    const newBranchId = branchIdCounter;
    setBranchIdCounter((prevCount) => prevCount + 1);
    const originalFrame = frames.find((frame) => frame.id === id);
    if (originalFrame) {
      const clonedFrame = structuredClone(originalFrame);
      clonedFrame.branchId = newBranchId;
      clonedFrame.text += '\n\n*** Branch starts ***';
      addFrame(clonedFrame.text, newBranchId);
      setSelectedFrameId(Date.now());
    }
  };

  const handleMergeButtonClick = () => {
    const originalBranch = frames.filter((frame) => frame.branchId === undefined);
    const newBranch = frames.filter((frame) => frame.branchId !== undefined)[0];
    if (originalBranch.length > 0 && newBranch) {
      mergeBranches(undefined, newBranch.branchId);
      branchFromFrame(originalBranch[originalBranch.length - 1].id);
      addFrame(newBranch.text, newBranch.branchId);
      setSelectedFrameId(Date.now());
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Multiverse Storyboard</h1>
        <button type="button" onClick={() => addFrame('Untitled Frame')}>
          New Frame
        </button>
        <button type="button" onClick={handleMergeButtonClick} disabled={!frames.some((frame) => frame.branchId !== undefined)}>
          Merge Branches
        </button>
      </header>
      <main className="App-frames">
        {frames.map((frame) => (
          <div
            key={frame.id}
            className={'frame ' + (selectedFrameId === frame.id ? 'selected' : '') + (frame.branchId ? ' branch' : '')}
            onClick={() => setSelectedFrameId(frame.id)}
          >
            <button type="button" onClick={() => branchFromFrame(frame.id)} disabled={frame.branchId ? false : true}>
              Branch
            </button>
            <textarea
              value={frame.text}
              onChange={(e) => editFrame(frame.id, e.target.value)}
              onKeyPress={handleKeyPress}
            ></textarea>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;