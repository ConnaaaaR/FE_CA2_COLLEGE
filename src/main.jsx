import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { AlertProvider } from "./contexts/AlertContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<AuthProvider>
			<AlertProvider>
				<App />
			</AlertProvider>
		</AuthProvider>
	</React.StrictMode>
);
