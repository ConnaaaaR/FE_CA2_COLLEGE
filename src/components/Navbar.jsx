import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
const Navbar = () => {
	const { authenticated, onAuthenticated } = useAuth();
	const navigate = useNavigate();

	const [theme, setTheme] = useState(
		localStorage.getItem("theme") || "cupcake"
	);

	const handleThemeChange = () => {
		const newTheme = theme === "cupcake" ? "synthwave" : "cupcake";
		setTheme(newTheme);
	};

	const logout = () => {
		onAuthenticated(false);
		navigate("/");
	};

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem("theme", theme);
	}, [theme]);

	return (
		<>
			<div className="navbar bg-base-100 justify-evenly">
				<div className=" md:flex-1 hidden md:inline-flex">
					<Link to="/" className="btn btn-ghost text-xl font-normal">
						class
						<span className="bg-neutral rounded p-1 font-bold text-neutral-content">
							Coord
						</span>
					</Link>
				</div>
				<div className="flex-none gap-8">
					{authenticated ? (
						<button className="btn btn-outline" onClick={logout}>
							Logout
						</button>
					) : (
						""
					)}
					<div className="flex-none gap-8">
						<label
							className="flex cursor-pointer gap-2 "
							aria-label="Theme toggle"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								alt="light mode symbol"
							>
								<circle cx="12" cy="12" r="5" />
								<path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
							</svg>

							<input
								type="checkbox"
								className="toggle  theme-controller"
								onChange={handleThemeChange}
								checked={theme === "synthwave"}
								aria-checked={theme === "synthwave"}
								aria-label="Toggle for dark and light mode"
							/>

							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								alt="dark mode symbol"
							>
								<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
							</svg>
						</label>
					</div>
					<label
						htmlFor="my-drawer-2"
						className="btn btn-ghost drawer-button lg:hidden"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							className="inline-block w-5 h-5 stroke-current"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 6h16M4 12h16M4 18h16"
							></path>
						</svg>
					</label>
				</div>
			</div>
		</>
	);
};

export default Navbar;
