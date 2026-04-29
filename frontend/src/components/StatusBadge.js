function StatusBadge({ status }) {
  const normalizedStatus = String(status || "unknown").toLowerCase();

  return (
    <span className={`status-badge status-${normalizedStatus}`}>
      {normalizedStatus}
    </span>
  );
}

export default StatusBadge;