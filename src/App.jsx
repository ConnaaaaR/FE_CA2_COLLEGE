import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";

import Home from "./pages/Home";
import CoursesIndex from "./pages/courses/Index";
import CoursesEdit from "./pages/courses/Edit";
import CoursesShow from "./pages/courses/Show";
import CoursesCreate from "./pages/courses/Create";
import PageNotFound from "./pages/PageNotFound";
import RegisterForm from "./components/RegisterForm";
import Navbar from "./components/Navbar";
import Drawer from "./components/Drawer";

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
		<Router>
			<Navbar />
			<Routes>
				{/* Drawer will act as a layout component for these routes */}
				<Route index element={<Home />} />
				<Route path="register" element={<RegisterForm />} />
				<Route path="/" element={<Drawer />}>
					<Route path="courses" element={<CoursesIndex />} />
					{authenticated && (
						<>
							<Route path="courses/create" element={<CoursesCreate />} />
							<Route path="courses/:id/edit" element={<CoursesEdit />} />
							<Route path="courses/:id" element={<CoursesShow />} />
						</>
					)}
					{/* Catch-all route for undefined paths */}
					<Route path="*" element={<PageNotFound />} />
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
