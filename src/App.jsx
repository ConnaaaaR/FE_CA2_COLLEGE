import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";

function App() {
	const { authenticated, onAuthenticated } = useAuth();
	let protectedRoutes;

	useEffect(() => {
		if (localStorage.getItem("token")) {
			onAuthenticated(true);
		}
	}, []);

	if (authenticated) {
		protectedRoutes = (
			<>
				<Route path="/courses/create" element={<CoursesCreate />} />
				<Route path="/courses/:id/edit" element={<CoursesEdit />} />
				<Route path="/courses/:id" element={<CoursesShow />} />
			</>
		);
	}
	return (
		<>
			<Router>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/courses" element={<CoursesIndex />} />
					{protectedRoutes}

					<Route path="*" element={<pageNotFound />} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
