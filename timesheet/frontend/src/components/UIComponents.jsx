const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.3)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const box = {
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  textAlign: "center"
};


export function AlertPopup({ message, onClose }) {
  if (!message) 
    return null;

  return (
    <div style={overlay}>
      <div style={box}>
        <p>{message}</p>
        <button onClick={onClose}>OK</button>
      </div>
    </div>
  );
}
