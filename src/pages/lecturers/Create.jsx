import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";

import axios from "../../config/api";

const Create = () => {
	const navigate = useNavigate();
	const [form, setForm] = useState({});
	const [errors, setErrors] = useState({});
	const token = localStorage.getItem("token");

	const handleForm = (e) => {
		setForm((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	const validatePhoneFormat = (phone) => {
		const regex = /0\d{2}-\d{7}$/;
		return regex.test(phone);
	};

	const isRequired = (fields) => {
		const validationErrors = {};
		let isValid = true;

		fields.forEach((field) => {
			if (!form[field]) {
				isValid = false;
				validationErrors[field] = `${field} is required!`;
			} else if (field === "phone" && !validatePhoneFormat(form.phone)) {
				isValid = false;
				validationErrors[field] = `Phone number must be in 0xx-xxxxxxx format!`;
			}
		});

		setErrors(validationErrors);
		return isValid;
	};

	const submitForm = (e) => {
		e.preventDefault();

		if (isRequired(["name", "address", "phone", "email"])) {
			axios
				.post(`/lecturers/`, form)
				.then(() => {
					navigate(`/lecturers`);
				})
				.catch((err) => {
					console.error(err.response.data);
				});
		}
	};

	return (
		<form onSubmit={submitForm}>
			<div>
				name:{" "}
				<input
					className="input input-bordered w-full max-w-xs"
					type="text"
					onChange={handleForm}
					value={form.name}
					name="name"
				/>
			</div>
			<div>
				address:{" "}
				<input
					className="input input-bordered w-full max-w-xs"
					type="text"
					onChange={handleForm}
					value={form.address}
					name="address"
				/>
			</div>
			{errors.email && <span className="text-error">{errors.email}</span>}
			<div>
				Phone:{" "}
				<input
					id="phone"
					className="input input-bordered w-full max-w-xs"
					type="text"
					onChange={handleForm}
					value={form.phone}
					name="phone"
					placeholder="0xx-xxxxxxx"
					required
				/>
			</div>
			{errors.phone && <span className="text-error">{errors.phone}</span>}
			<div>
				email:{" "}
				<input
					className="input input-bordered w-full max-w-xs"
					type="email"
					onChange={handleForm}
					value={form.email}
					name="email"
				/>
			</div>

			<button type="submit" className="btn btn-outline">
				Submit
			</button>
		</form>
	);
};

export default Create;
