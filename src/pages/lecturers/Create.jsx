import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";

import axios from "../../config/api";

const Create = () => {
	const navigate = useNavigate();
	const [form, setForm] = useState({});
	const [errors, setErrors] = useState({});

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
		<div className="rounded-xl bg-base-300 w-1/2">
			<form
				onSubmit={submitForm}
				className="form-control mx-auto w-100 max-w-md"
			>
				<h2 className="text-xl p-5 text-center">Create New Lecturer</h2>
				<div className="form-group">
					<label className="label">
						<span className="label-text">Name:</span>
					</label>
					<input
						className="input input-bordered w-full"
						type="text"
						onChange={handleForm}
						value={form.name}
						name="name"
					/>
				</div>
				{errors.name && <span className="text-error">{errors.name}</span>}
				<div className="form-group">
					<label className="label">
						<span className="label-text">Address:</span>
					</label>
					<input
						className="input input-bordered w-full"
						type="text"
						onChange={handleForm}
						value={form.address}
						name="address"
					/>
				</div>
				{errors.address && <span className="text-error">{errors.address}</span>}
				<div className="form-group">
					<label className="label">
						<span className="label-text">Phone:</span>
					</label>
					<input
						id="phone"
						className="input input-bordered w-full"
						type="text"
						onChange={handleForm}
						value={form.phone}
						name="phone"
						placeholder="0xx-xxxxxxx"
					/>
				</div>
				{errors.phone && <span className="text-error">{errors.phone}</span>}
				<div className="form-group">
					<label className="label">
						<span className="label-text">Email:</span>
					</label>
					<input
						className="input input-bordered w-full"
						type="email"
						onChange={handleForm}
						value={form.email}
						name="email"
					/>
				</div>
				{errors.email && <span className="text-error">{errors.email}</span>}

				<button className="btn my-5 btn-primary" type="submit">
					Submit
				</button>
			</form>
		</div>
	);
};

export default Create;
