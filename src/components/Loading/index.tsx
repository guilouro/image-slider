function Loading() {
  return (
    <svg
      className="loading"
      width="30"
      height="30"
      viewBox="0 0 50 50"
      style={{
        animation: "spin 1s linear infinite",
      }}
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke="#3498db"
        strokeWidth="5"
        fill="none"
        strokeDasharray="80"
        strokeDashoffset="20"
      />
    </svg>
  );
}

export default Loading;
