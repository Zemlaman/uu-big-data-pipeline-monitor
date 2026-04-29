function EmptyState({ message }) {
  return <div className="state-box">{message || "No data available."}</div>;
}

export default EmptyState;