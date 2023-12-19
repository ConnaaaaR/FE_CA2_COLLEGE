import axios from "../config/api";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useAlert } from "../contexts/AlertContext";
import AlertBanner from "./AlertBanner";

const RegisterForm = () => {
	// const authenticated = useAuth();
	const navigate = useNavigate();
	const { alert, showAlert, closeAlert, a } = useAlert();
	const { authenticated, onAuthenticated } = useAuth();
	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [error, setError] = useState({});

	const sendForm = () => {
		console.log(form);
		if (form.password !== form.confirmPassword) {
			setError("Passwords Do Not Match!");
			showAlert("error", "Passwords Do Not Match!");
			return;
		}

		axios
			.post("/register", form)
			.then((res) => {
				console.log(res);
				onAuthenticated(true, res.data.token);
				showAlert("success", "Registered Successfully!");
				navigate("/");
			})
			.catch((err) => {
				console.error(err.response);
				setError(err.response.data);
				// showAlert("error", err.response.data.name);
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
			<AlertBanner
				isOpen={alert.isOpen}
				onClose={closeAlert}
				status={alert.type}
				title={alert.message}
			/>
			<main className="container mx-auto max-w-3xl my-5  ">
				<section className="flex flex-col py-1/3 gap-3 bg-base-300 rounded-2xl p-5 mx-auto items-center prose prose-slate ">
					<img
						className="mx-auto"
						src="/Fingerprint-rafiki.svg"
						alt=""
						width="50%"
					/>
					<h2 className="text-3xl m-0">Register New Account</h2>
					<div className="form-group w-full">
						<label className="label">
							<span className="label-text">Name:</span>
						</label>
						<input
							className="input input-bordered w-full"
							type="text"
							name="name"
							onChange={handleForm}
							value={form.name}
						/>
						{error.name && <span className="text-error">{error.name}</span>}
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
							<span className="text-error"> &#13; {error.password}</span>
						)}
						<label className="label">
							<span className="label-text">Confirm Password:</span>
						</label>
						<input
							className="input input-bordered w-full"
							type="password"
							name="confirmPassword"
							onChange={handleForm}
							value={form.confirmPassword}
						/>
						<button
							type="submit"
							className="btn btn-outline w-full my-4"
							onClick={sendForm}
						>
							Login
						</button>
					</div>

					<Link to="/">Already have an account? Login Here!</Link>
				</section>
			</main>
		</>
	);
};

export default RegisterForm;
