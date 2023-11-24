import axios from "axios";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const RegisterForm = () => {
	const [form, setForm] = useState(null);
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
			})
			.catch((err) => {
				console.error(err.response.data.message);
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
			<p>{error}</p>
			name:{" "}
			<input type="text" name="name" onChange={handleForm} value={form.name} />
			Email:{" "}
			<input
				type="text"
				name="email"
				onChange={handleForm}
				value={form.email}
			/>
			Password:{" "}
			<input
				type="text"
				name="password"
				onChange={handleForm}
				value={form.password}
			/>
			Confirm Password:{" "}
			<input
				type="text"
				name="confirmPassword"
				onChange={handleForm}
				value={form.confirmPassword}
			/>
			<button type="submit" onClick={sendForm}>
				{" "}
				Register
			</button>
		</>
	);
};

export default RegisterForm;
