function ErrorState({ message }) {
  return (
    <div className="state-box error">
      {message || "Something went wrong while loading data."}
    </div>
  );
}

export default ErrorState;