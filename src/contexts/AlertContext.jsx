import React, { createContext, useState, useContext } from "react";

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
	const [alert, setAlert] = useState({ isOpen: false, type: "", message: "" });

	const showAlert = (type, message) => {
		setAlert({ isOpen: true, type, message });
		setTimeout(() => setAlert({ isOpen: false, type: "", message: "" }), 15000);
	};

	const closeAlert = () => {
		setAlert({ isOpen: false, type: "", message: "" });
	};

	return (
		<AlertContext.Provider value={{ alert, showAlert, closeAlert }}>
			{children}
		</AlertContext.Provider>
	);
};
