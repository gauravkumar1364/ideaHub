import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API || 'http://localhost:5000/api';

export default function LiveVariableAnalysis() {
  const [code, setCode] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [examples, setExamples] = useState([]);
  const [selectedExample, setSelectedExample] = useState(null);
  const [activeTab, setActiveTab] = useState('editor'); // editor, results, cfg

  useEffect(() => {
    fetchExamples();
  }, []);

  const fetchExamples = async () => {
    try {
      const response = await axios.get(`${API_BASE}/lva/examples`);
      if (response.data.success) {
        setExamples(response.data.examples);
      }
    } catch (err) {
      console.error('Failed to fetch examples:', err);
    }
  };

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setError('Please enter some code to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await axios.post(`${API_BASE}/lva/analyze`, { code });
      if (response.data.success) {
        setResults(response.data.results);
        setActiveTab('results');
      } else {
        setError(response.data.message || 'Analysis failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze code');
    } finally {
      setLoading(false);
    }
  };

  const loadExample = (example) => {
    setCode(example.code);
    setSelectedExample(example.id);
    setResults(null);
    setError(null);
    setActiveTab('editor');
  };

  const clearCode = () => {
    setCode('');
    setResults(null);
    setError(null);
    setSelectedExample(null);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>
          🔍 Live Variable Analysis Tool
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Analyze JavaScript code to determine which variables are live at each program point.
          Uses Babel parser for AST generation and backward dataflow analysis.
        </p>
      </div>

      {/* Examples Section */}
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '10px', fontSize: '18px' }}>📚 Example Code Snippets</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {examples.map((ex) => (
            <button
              key={ex.id}
              onClick={() => loadExample(ex)}
              style={{
                padding: '8px 16px',
                background: selectedExample === ex.id ? '#4CAF50' : '#fff',
                color: selectedExample === ex.id ? '#fff' : '#333',
                border: '1px solid #ddd',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              {ex.title}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '2px solid #ddd', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['editor', 'results', 'cfg'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '3px solid #4CAF50' : '3px solid transparent',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
                color: activeTab === tab ? '#4CAF50' : '#666',
              }}
            >
              {tab === 'editor' && '✏️ Code Editor'}
              {tab === 'results' && '📊 Analysis Results'}
              {tab === 'cfg' && '🔀 Control Flow'}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Tab */}
      {activeTab === 'editor' && (
        <div>
          <div style={{ marginBottom: '15px', display: 'flex', gap: '10px' }}>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              style={{
                padding: '10px 30px',
                background: loading ? '#ccc' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              {loading ? '⏳ Analyzing...' : '🚀 Analyze Code'}
            </button>
            <button
              onClick={clearCode}
              style={{
                padding: '10px 30px',
                background: '#fff',
                color: '#333',
                border: '1px solid #ddd',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              🗑️ Clear
            </button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter JavaScript code here..."
            style={{
              width: '100%',
              height: '400px',
              padding: '15px',
              fontSize: '14px',
              fontFamily: 'monospace',
              border: '1px solid #ddd',
              borderRadius: '5px',
              resize: 'vertical',
            }}
          />

          {error && (
            <div
              style={{
                marginTop: '15px',
                padding: '15px',
                background: '#ffebee',
                color: '#c62828',
                borderRadius: '5px',
                border: '1px solid #ef5350',
              }}
            >
              ❌ {error}
            </div>
          )}
        </div>
      )}

      {/* Results Tab */}
      {activeTab === 'results' && (
        <div>
          {!results ? (
            <div
              style={{
                padding: '40px',
                textAlign: 'center',
                color: '#999',
                fontSize: '18px',
              }}
            >
              No analysis results yet. Click "Analyze Code" to see results.
            </div>
          ) : (
            <div>
              {/* Summary */}
              <div
                style={{
                  marginBottom: '20px',
                  padding: '20px',
                  background: '#e3f2fd',
                  borderRadius: '8px',
                  border: '1px solid #90caf9',
                }}
              >
                <h3 style={{ marginBottom: '10px', fontSize: '20px' }}>📈 Analysis Summary</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                  <div>
                    <strong>Total Lines:</strong> {results.totalLines}
                  </div>
                  <div>
                    <strong>Statements:</strong> {results.summary.totalStatements}
                  </div>
                  <div>
                    <strong>Variables:</strong> {results.summary.variables.join(', ') || 'None'}
                  </div>
                </div>
              </div>

              {/* Line by Line Analysis */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '15px', fontSize: '20px' }}>📝 Line-by-Line Analysis</h3>
                <div
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f5f5f5' }}>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', width: '60px' }}>
                          Line
                        </th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>
                          Code
                        </th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', width: '200px' }}>
                          Live Variables
                        </th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', width: '150px' }}>
                          GEN
                        </th>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', width: '150px' }}>
                          KILL
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.lineByLine.map((line) => (
                        <tr
                          key={line.line}
                          style={{
                            background: line.isStatement ? '#fff' : '#fafafa',
                            borderBottom: '1px solid #eee',
                          }}
                        >
                          <td style={{ padding: '8px 12px', fontFamily: 'monospace', color: '#666' }}>
                            {line.line}
                          </td>
                          <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontSize: '13px' }}>
                            {line.code || <span style={{ color: '#ccc' }}>(empty)</span>}
                          </td>
                          <td style={{ padding: '8px 12px' }}>
                            {line.liveVariables.length > 0 ? (
                              <span
                                style={{
                                  background: '#4CAF50',
                                  color: 'white',
                                  padding: '4px 8px',
                                  borderRadius: '3px',
                                  fontSize: '12px',
                                }}
                              >
                                {line.liveVariables.join(', ')}
                              </span>
                            ) : (
                              <span style={{ color: '#999', fontSize: '12px' }}>-</span>
                            )}
                          </td>
                          <td style={{ padding: '8px 12px', fontSize: '12px', color: '#666' }}>
                            {line.gen.length > 0 ? line.gen.join(', ') : '-'}
                          </td>
                          <td style={{ padding: '8px 12px', fontSize: '12px', color: '#666' }}>
                            {line.kill.length > 0 ? line.kill.join(', ') : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Statement Details */}
              <div>
                <h3 style={{ marginBottom: '15px', fontSize: '20px' }}>🔬 Statement Details</h3>
                {results.statements.map((stmt) => (
                  <div
                    key={stmt.id}
                    style={{
                      marginBottom: '15px',
                      padding: '15px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      background: '#fff',
                    }}
                  >
                    <div style={{ marginBottom: '8px' }}>
                      <strong>Line {stmt.line}:</strong>{' '}
                      <code style={{ background: '#f5f5f5', padding: '2px 6px', borderRadius: '3px' }}>
                        {stmt.code}
                      </code>
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <strong>Type:</strong> {stmt.type}
                      </div>
                      <div>
                        <strong>Statement ID:</strong> {stmt.id}
                      </div>
                      <div>
                        <strong>Live IN:</strong>{' '}
                        <span style={{ color: '#4CAF50' }}>
                          {stmt.liveIn.length > 0 ? `{${stmt.liveIn.join(', ')}}` : '∅'}
                        </span>
                      </div>
                      <div>
                        <strong>Live OUT:</strong>{' '}
                        <span style={{ color: '#2196F3' }}>
                          {stmt.liveOut.length > 0 ? `{${stmt.liveOut.join(', ')}}` : '∅'}
                        </span>
                      </div>
                      <div>
                        <strong>GEN:</strong> {stmt.gen.length > 0 ? `{${stmt.gen.join(', ')}}` : '∅'}
                      </div>
                      <div>
                        <strong>KILL:</strong> {stmt.kill.length > 0 ? `{${stmt.kill.join(', ')}}` : '∅'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CFG Tab */}
      {activeTab === 'cfg' && (
        <div>
          {!results ? (
            <div
              style={{
                padding: '40px',
                textAlign: 'center',
                color: '#999',
                fontSize: '18px',
              }}
            >
              No control flow graph yet. Click "Analyze Code" first.
            </div>
          ) : (
            <div>
              <h3 style={{ marginBottom: '15px', fontSize: '20px' }}>🔀 Control Flow Graph</h3>
              <div
                style={{
                  padding: '20px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  background: '#fff',
                }}
              >
                {results.cfg.map((node, idx) => (
                  <div
                    key={node.id}
                    style={{
                      marginBottom: '15px',
                      padding: '15px',
                      background: '#f9f9f9',
                      border: '2px solid #4CAF50',
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                      Statement {node.id} (Line {node.line})
                    </div>
                    <div style={{ fontSize: '14px', fontFamily: 'monospace', marginBottom: '8px' }}>
                      {results.statements.find((s) => s.id === node.id)?.code}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      {node.successor !== null ? (
                        <span>
                          ↓ Successor: Statement {node.successor}
                        </span>
                      ) : (
                        <span style={{ color: '#999' }}>⬛ Exit Node</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Documentation */}
      <div
        style={{
          marginTop: '40px',
          padding: '20px',
          background: '#f5f5f5',
          borderRadius: '8px',
          borderLeft: '4px solid #4CAF50',
        }}
      >
        <h3 style={{ marginBottom: '15px', fontSize: '20px' }}>📖 How It Works</h3>
        <div style={{ fontSize: '15px', lineHeight: '1.6', color: '#555' }}>
          <p style={{ marginBottom: '10px' }}>
            <strong>Live Variable Analysis</strong> is a backward dataflow analysis technique that determines
            which variables are "live" at each program point.
          </p>
          <p style={{ marginBottom: '10px' }}>
            A variable is <strong>live</strong> at a program point if its current value may be used in the future
            before being redefined.
          </p>
          <ul style={{ marginLeft: '20px', marginBottom: '10px' }}>
            <li><strong>GEN Set:</strong> Variables that are used (referenced) in a statement</li>
            <li><strong>KILL Set:</strong> Variables that are defined (assigned) in a statement</li>
            <li><strong>Live IN:</strong> Variables that are live at the entry of a statement</li>
            <li><strong>Live OUT:</strong> Variables that are live at the exit of a statement</li>
          </ul>
          <p style={{ marginBottom: '10px' }}>
            <strong>Formula:</strong> IN[s] = GEN[s] ∪ (OUT[s] - KILL[s])
          </p>
          <p>
            This tool uses <strong>Babel</strong> for parsing JavaScript into an AST, builds a simplified control flow graph,
            and performs iterative backward analysis to compute live variables at each program point.
          </p>
        </div>
      </div>
    </div>
  );
}
