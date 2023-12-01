import axios from "axios";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const LoginForm = () => {
	const [form, setForm] = useState({
		email: "email@email.com",
		password: "password",
	});
	const [error, setError] = useState(null);
	const { onAuthenticated } = useAuth();

	const sendForm = () => {
		axios
			.post("https://college-api.vercel.app/api/login", {
				email: form.email,
				password: form.password,
			})
			.then((res) => {
				onAuthenticated(true, res.data.token);
			})
			.catch((err) => {
				console.error(err.message);
				setError(err.message);
			});
	};

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
					<h2 className="text-3xl m-0">Login</h2>
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
					<button
						type="submit"
						className="btn btn-outline w-full max-w-sm"
						onClick={sendForm}
					>
						Login
					</button>
					<Link to="/register">No account? Register Here!</Link>
				</section>
			</main>
		</>
	);
};

export default LoginForm;
