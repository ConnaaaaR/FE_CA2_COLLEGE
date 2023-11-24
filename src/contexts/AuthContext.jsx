import { useContext, createContext, useState } from "react";

const AuthContext = createContext(null);

export function useAuth() {
	const val = useContext(AuthContext);
	return val;
}

export function AuthProvider(props) {
	const [authenticated, setAuthenticated] = useState(
		Boolean(localStorage.getItem("token"))
	);

	return (
		<AuthContext.Provider
			value={{
				authenticated,
				onAuthenticated: (auth, token) => {
					setAuthenticated(true);

					if (auth && token) {
						localStorage.setItem("token", token);
					} else if (!auth) {
						localStorage.removeItem("token");
					}
				},
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
}
