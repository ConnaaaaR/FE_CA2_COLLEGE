import React, { createContext, useState, useContext } from "react";

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
	const [alert, setAlert] = useState({
		isOpen: false,
		type: "",
		message: "",
	});
	
	const [modal, setModal] = useState({
		isModalOpen: false,
		modalContent: null,
		onConfirm: null,
	});

	const showAlert = (type, message) => {
		setAlert({ isOpen: true, type, message });
		setTimeout(
			() => setAlert({ isOpen: false, type: "", message: "" }),
			150000
		);
	};

	const closeAlert = () => {
		setAlert({ isOpen: false, type: "", message: "" });
	};

	const openModal = (content, confirmAction) => {
		setModal({
			isModalOpen: true,
			modalContent: content,
			onConfirm: confirmAction,
		});
	};

	const closeModal = () => {
		setModal({ isModalOpen: false, modalContent: null, onConfirm: null });
	};

	return (
		<AlertContext.Provider
			value={{ alert, showAlert, closeAlert, modal, openModal, closeModal }}
		>
			{children}
		</AlertContext.Provider>
	);
};
