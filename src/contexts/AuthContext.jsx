import { useContext, createContext, useState } from "react";

const AuthContext = createContext(null);

export function useAuth() {
	const val = useContext(authContext);
	return val;
}

export function AuthProvider(props) {
	const [authenticated, setAuthenticated] = useState(false);

	return (
		<AuthContext.Provider
			value={{
				authenticated,
				onAuthenticated: (auth, token) => {
					setAuthenticated(true);

					if (auth && token) {
						localStorage.setItem("token", token);
					} else if (auth) {
						localStorage.removeItem("token");
					}
				},
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
}
