import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, Link, useNavigate } from "react-router-dom";

const RegisterForm = () => {
	const authenticated = useAuth();
	const navigate = useNavigate();
	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [error, setError] = useState(null);
	const { onAuthenticated } = useAuth();
	const sendForm = () => {
		if (form.password !== form.confirmPassword) {
			setError("Passwords Do Not Match!");
			return;
		}
		axios
			.post("https://college-api.vercel.app/api/register", {
				name: form.name,
				email: form.email,
				password: form.password,
			})
			.then((res) => {
				onAuthenticated(true, res.data.token);
				Navigate();
			})
			.catch((err) => {
				console.error(err.response.data.message);
			});
	};

	useEffect(() => {
		if (authenticated) {
			navigate("/");
		}
	}, []);

	const handleForm = (e) => {
		setForm((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};
	return (
		<>
			<main className="container mx-auto max-w-3xl my-5  ">
				<section className="flex flex-col py-1/3 gap-3 bg-base-300 rounded-2xl p-5 mx-auto items-center prose prose-slate ">
					<img
						className="mx-auto"
						src="/Fingerprint-rafiki.svg"
						alt=""
						width="50%"
					/>
					<h2 className="text-3xl m-0">Register New Account</h2>
					<p>{error}</p>
					Email:{" "}
					<input
						className="input input-bordered w-full max-w-sm"
						type="text"
						name="email"
						onChange={handleForm}
						value={form.email}
					/>
					Password:{" "}
					<input
						className="input input-bordered w-full max-w-sm"
						type="password"
						name="password"
						onChange={handleForm}
						value={form.password}
					/>
					Confirm Password
					<input
						className="input input-bordered w-full max-w-sm"
						type="password"
						name="confirmPassword"
						onChange={handleForm}
						value={form.confirmPassword}
					/>
					<button
						type="submit"
						className="btn btn-outline w-full max-w-sm"
						onClick={sendForm}
					>
						Login
					</button>
					<Link to="/">Already have an account? Login Here!</Link>
				</section>
			</main>
		</>
	);
};

export default RegisterForm;
