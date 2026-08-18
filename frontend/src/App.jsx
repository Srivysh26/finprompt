import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState("General");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Concise");
  const [improvedPrompt, setImprovedPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("finprompt_history");

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveHistory = (item) => {
    const updatedHistory = [item, ...history].slice(0, 10);

    setHistory(updatedHistory);
    localStorage.setItem(
      "finprompt_history",
      JSON.stringify(updatedHistory)
    );
  };

  const optimizePrompt = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt first.");
      return;
    }

    setLoading(true);
    setError("");
    setImprovedPrompt("");
    setCopied(false);

    const enhancedPrompt = `
Original user request:
${prompt}

Optimization requirements:
- Category: ${category}
- Desired tone: ${tone}
- Preferred length: ${length}

Improve the user's prompt while preserving their original intent.
Make the result specific, clear, structured, and useful for an AI model.
Return only the improved prompt.
`;

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/optimize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            prompt: enhancedPrompt
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to optimize prompt.");
      }

      const data = await response.json();

      setImprovedPrompt(data.improved_prompt);

      saveHistory({
        id: Date.now(),
        originalPrompt: prompt,
        improvedPrompt: data.improved_prompt,
        category,
        tone,
        length,
        createdAt: new Date().toLocaleString()
      });
    } catch (err) {
      setError(
        "Could not connect to the backend. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(improvedPrompt);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const clearAll = () => {
    setPrompt("");
    setImprovedPrompt("");
    setError("");
    setCopied(false);
  };

  const reusePrompt = (item) => {
    setPrompt(item.originalPrompt);
    setCategory(item.category);
    setTone(item.tone);
    setLength(item.length);
    setImprovedPrompt(item.improvedPrompt);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const deleteHistoryItem = (id) => {
    const updatedHistory = history.filter(
      (item) => item.id !== id
    );

    setHistory(updatedHistory);

    localStorage.setItem(
      "finprompt_history",
      JSON.stringify(updatedHistory)
    );
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("finprompt_history");
  };

  return (
    <div className="app">
      <header className="hero">
        <div className="logo">FP</div>

        <h1>FinPrompt</h1>

        <p>
          Transform simple ideas into clear, powerful AI prompts.
        </p>
      </header>

      <main>
        <section className="card">
          <div className="section-title">
            <div>
              <h2>Create your prompt</h2>
              <p>
                Tell FinPrompt what you want AI to accomplish.
              </p>
            </div>

            <span className="status">● AI Ready</span>
          </div>

          <label>Your prompt</label>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Write an email to my manager"
          />

          <div className="controls">
            <div className="control">
              <label>Category</label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>General</option>
                <option>Email</option>
                <option>Coding</option>
                <option>Study</option>
                <option>Resume</option>
                <option>Marketing</option>
                <option>Business</option>
                <option>Creative Writing</option>
              </select>
            </div>

            <div className="control">
              <label>Tone</label>

              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option>Professional</option>
                <option>Friendly</option>
                <option>Formal</option>
                <option>Concise</option>
                <option>Persuasive</option>
                <option>Creative</option>
              </select>
            </div>

            <div className="control">
              <label>Length</label>

              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
              >
                <option>Concise</option>
                <option>Medium</option>
                <option>Detailed</option>
              </select>
            </div>
          </div>

          {error && <p className="error">{error}</p>}

          <div className="actions">
            <button
              className="primary-button"
              onClick={optimizePrompt}
              disabled={loading}
            >
              {loading
                ? "Optimizing..."
                : "✨ Optimize Prompt"}
            </button>

            <button
              className="secondary-button"
              onClick={clearAll}
            >
              Clear
            </button>
          </div>
        </section>

        {improvedPrompt && (
          <section className="card result-card">
            <div className="section-title">
              <div>
                <h2>✨ Optimized Prompt</h2>
                <p>Your improved prompt is ready to use.</p>
              </div>

              <button
                className="copy-button"
                onClick={copyPrompt}
              >
                {copied ? "✓ Copied!" : "Copy"}
              </button>
            </div>

            <div className="output">
              {improvedPrompt}
            </div>
          </section>
        )}

        <section className="card history-card">
          <div className="section-title">
            <div>
              <h2>🕘 Prompt History</h2>
              <p>Your last 10 optimized prompts.</p>
            </div>

            {history.length > 0 && (
              <button
                className="clear-history"
                onClick={clearHistory}
              >
                Clear History
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="empty-history">
              <div className="empty-icon">📝</div>

              <h3>No prompts yet</h3>

              <p>
                Your optimized prompts will appear here.
              </p>
            </div>
          ) : (
            <div className="history-list">
              {history.map((item) => (
                <div className="history-item" key={item.id}>
                  <div className="history-content">
                    <h3>{item.originalPrompt}</h3>

                    <div className="history-meta">
                      <span>{item.category}</span>
                      <span>{item.tone}</span>
                      <span>{item.length}</span>
                    </div>

                    <small>{item.createdAt}</small>
                  </div>

                  <div className="history-actions">
                    <button
                      className="reuse-button"
                      onClick={() => reusePrompt(item)}
                    >
                      Reuse
                    </button>

                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteHistoryItem(item.id)
                      }
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        FinPrompt • AI Prompt Optimization Platform
      </footer>
    </div>
  );
}

export default App;
