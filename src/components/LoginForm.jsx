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
				<section className="flex parent flex-col justify-self-center py-48 sm:flex-col  justify-evenly gap-2 bg-primary rounded-2xl p-5 items-center prose prose-slate ">
					<h2 className="text-3xl">Login</h2>
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
						{" "}
						Login
					</button>
					<Link to="/register"></Link>
				</section>
			</main>
		</>
	);
};

export default LoginForm;