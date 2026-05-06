import React, { useState } from "react";
import "./Problems.css";

const difficultyColor = {
  Easy: "var(--accent-primary, #00ff88)",
  Medium: "var(--accent-secondary, #00d4ff)",
  Hard: "var(--accent-danger, #ff3366)",
};

const ProblemModal = ({ problem, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  if (!problem) return null;

  const handleSubmit = () => {
    // Placeholder: in real app, grab circuit from CircuitForge and validate
    setSubmitted(true);
  };

  const handleOpenCircuitForge = () => {
    // Opens the CircuitForge module; replace with your actual route/modal open logic
    alert("CircuitForge is opening...\nBuild your circuit, then come back and click Submit.");
  };

  return (
    <div className="prob-modal-overlay" onClick={onClose}>
      <div
        className="prob-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="prob-modal-header">
          <div>
            <span className="prob-id">#{problem.id}</span>
            <h2 className="prob-modal-title">{problem.title}</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span
              className="prob-difficulty"
              style={{ color: difficultyColor[problem.difficulty], fontSize: "1rem" }}
            >
              {problem.difficulty}
            </span>
            <button className="prob-close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="prob-modal-body">
          {/* Left Column */}
          <div className="prob-modal-left">
            <section className="prob-section">
              <h4>Description</h4>
              <p>{problem.description}</p>
            </section>

            <section className="prob-section">
              <h4>Boolean Equations</h4>
              <div className="prob-equations">
                {problem.equations.map((eq, i) => (
                  <code key={i} className="prob-eq">{eq}</code>
                ))}
              </div>
            </section>

            <section className="prob-section">
              <h4>Truth Table</h4>
              <div className="prob-table-wrap">
                <table className="prob-truth-table">
                  <thead>
                    <tr>
                      {Object.keys(problem.truthTable[0]).map((col) => (
                        <th key={col}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {problem.truthTable.map((row, i) => (
                      <tr key={i}>
                        {Object.values(row).map((val, j) => (
                          <td key={j} className={typeof val === "number" && val === 1 ? "cell-one" : ""}>
                            {String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {showHint && (
              <section className="prob-section prob-hint">
                <h4>💡 Hint</h4>
                <p>{problem.hint}</p>
              </section>
            )}

            <button
              className="prob-hint-btn"
              onClick={() => setShowHint((v) => !v)}
            >
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
          </div>

          {/* Right Column — CircuitForge panel */}
          <div className="prob-modal-right">
            <div className="prob-forge-panel">
              <div className="prob-forge-icon">⚡</div>
              <h4>Build in CircuitForge</h4>
              <p>
                Open the CircuitForge module, construct your circuit using the
                required gates, then submit for evaluation.
              </p>

              <div className="prob-io-info">
                <div>
                  <span className="prob-io-label">Inputs</span>
                  <div className="prob-io-pills">
                    {problem.inputs.map((inp) => (
                      <span key={inp} className="prob-io-pill input-pill">{inp}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="prob-io-label">Outputs</span>
                  <div className="prob-io-pills">
                    {problem.outputs.map((out) => (
                      <span key={out} className="prob-io-pill output-pill">{out}</span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                className="prob-forge-btn"
                onClick={handleOpenCircuitForge}
              >
                🔧 Open CircuitForge
              </button>

              <div className="prob-divider" />

              {!submitted ? (
                <>
                  <p className="prob-submit-info">
                    Finished building? Click submit to check your circuit.
                  </p>
                  <button className="prob-submit-btn" onClick={handleSubmit}>
                    ✅ Submit Circuit
                  </button>
                </>
              ) : (
                <div className="prob-success">
                  <div className="prob-success-icon">🎉</div>
                  <h4>Circuit Submitted!</h4>
                  <p>Your design has been recorded. Great work!</p>
                  <button
                    className="prob-reset-btn"
                    onClick={() => setSubmitted(false)}
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemModal;
