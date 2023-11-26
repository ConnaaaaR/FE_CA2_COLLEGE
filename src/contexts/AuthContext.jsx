import { useContext, createContext, useState, useEffect } from "react";

const AuthContext = createContext({
	authenticated: false,
	onAuthenticated: () => {},
});

export function useAuth() {
	return useContext(AuthContext);
}

export function AuthProvider({ children }) {
	const [authenticated, setAuthenticated] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("token");
		token ? setAuthenticated(true) : null;
	}, []);

	const onAuthenticated = (auth, token) => {
		if (auth && token) {
			localStorage.setItem("token", token);
			setAuthenticated(true);
		} else if (!auth) {
			localStorage.removeItem("token");
			setAuthenticated(false);
		}
	};

	return (
		<AuthContext.Provider value={{ authenticated, onAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
}
