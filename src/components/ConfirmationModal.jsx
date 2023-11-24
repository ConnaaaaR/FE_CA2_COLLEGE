import React from "react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
	return (
		<div className={`modal ${isOpen ? "modal-open" : ""}`}>
			<div className="modal-box">
				{title && <h3 className="font-bold text-lg">{title}</h3>}
				{children && <p className="py-4">{children}</p>}
				<div className="modal-action">
					<button onClick={onConfirm} className="btn btn-error">
						Yes, Delete
					</button>
					<button onClick={onClose} className="btn btn-outline">
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmationModal;
