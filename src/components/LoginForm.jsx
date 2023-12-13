import React from "react";
import axios from "../config/api";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const LoginForm = () => {
	const [form, setForm] = useState({ email: "", password: "" });
	const [error, setError] = useState({});
	const { onAuthenticated } = useAuth();

	const sendForm = async () => {
		try {
			const response = await axios.post("/login", form);
			onAuthenticated(true, response.data.token);
		} catch (err) {
			setError(err.response.data.error);
		}
	};

	const handleForm = (e) => {
		const { name, value } = e.target;
		setForm((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	return (
		<main className="container mx-auto max-w-3xl my-5">
			<section className="flex flex-col py-1/3 gap-3 bg-base-300 rounded-2xl p-5 mx-auto items-center prose prose-slate">
				<img
					className="mx-auto"
					src="/Fingerprint-rafiki.svg"
					alt="Fingerprint"
					width="50%"
				/>
				<h2 className="text-3xl m-0">Login</h2>

				<div className="form-group">
					<label className="label">
						<span className="label-text">Email:</span>
					</label>
					<input
						className="input input-bordered w-full"
						type="text"
						name="email"
						onChange={handleForm}
						value={form.email}
					/>
					{error.email && <span className="text-error">{error.email}</span>}

					<label className="label">
						<span className="label-text">Password:</span>
					</label>
					<input
						className="input input-bordered w-full"
						type="password"
						name="password"
						onChange={handleForm}
						value={form.password}
					/>
					{error.password && (
						<span className="text-error">{error.password}</span>
					)}

					<button
						type="submit"
						className="btn btn-outline my-2 w-full"
						onClick={sendForm}
					>
						Login
					</button>
				</div>

				<Link to="/register">No account? Register Here!</Link>
			</section>
		</main>
	);
};

export default LoginForm;
