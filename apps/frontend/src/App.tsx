import React, { useState } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const submitTask = async () => {
    setError(null);
    setStatus(null);
    try {
      // FIX: Use /api (Relative Path) so Nginx handles the routing
      const res = await fetch('/api/submit-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: "user_1", prompt: prompt })
      });
      
      if (!res.ok) throw new Error("Server Error: " + res.statusText);
      
      const data = await res.json();
      setTaskId(data.task_id);
      pollStatus(data.task_id);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const pollStatus = (id: string) => {
    const interval = setInterval(async () => {
      try {
        // FIX: Use /api (Relative Path)
        const res = await fetch(`/api/task/${id}`);
        const data = await res.json();
        setStatus(data);
        if (data.status === 'COMPLETED' || data.status === 'FAILED') {
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling Error", err);
      }
    }, 2000); 
  };

  return (
    <div className="App" style={{padding: "50px"}}>
      <h1>SentinAI Control Panel</h1>
      <textarea 
        value={prompt} 
        onChange={(e) => setPrompt(e.target.value)} 
        placeholder="Enter AI Prompt..." 
        style={{width: "100%", height: "100px"}}
      />
      <br />
      <button onClick={submitTask} style={{marginTop: "10px", padding: "10px 20px"}}>
        Submit Async Job
      </button>
      
      {error && <p style={{color: "red"}}>Error: {error}</p>}

      {taskId && (
        <div style={{marginTop: 20, background: "#f0f0f0", padding: "20px"}}>
          <p><strong>Task ID:</strong> {taskId}</p>
          <p><strong>Status:</strong> {status ? status.status : "Waiting..."}</p>
          {status?.result && <p><strong>Result:</strong> {status.result}</p>}
        </div>
      )}
    </div>
  );
}

export default App;
