import './ConfirmationModal.css'

const ConfirmationModal = ({ show, onConfirm, onCancel, title, message }) => {
  if (!show) {
    return null; // Don't render if not visible
  }

  return (
    <div className="modal-overlay"> {/* Styling for overlay */}
      <div className="modal-content"> {/* Styling for modal box */}
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onConfirm}>Confirm</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal