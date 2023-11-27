import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "../../config/api";

const Create = () => {
	const navigate = useNavigate();
	const [form, setForm] = useState({});
	const [errors, setErrors] = useState();
	const token = localStorage.getItem("token");
	const [date, setDate] = useState();

	const handleForm = (e) => {
		setForm((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	const getTimestamp = () => {
		let timeStr = new Date(Date.now() * 1000).toLocaleTimeString();
		console.log(timeStr);
		setDate(timeStr);
	};

	const isRequired = (fields) => {
		const validationErrors = {};
		let isValid = true;

		fields.forEach((field) => {
			if (!form[field]) {
				isValid = false;
				validationErrors[field] = { message: `${field} is required!` };
			}
		});

		setErrors(validationErrors);
		return isValid;
	};

	const submitForm = (e) => {
		e.preventDefault();

		if (isRequired(["name", "address", "phone", "email"])) {
			axios
				.post(`/lecturers/`, form, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((response) => {
					navigate(`/enrolments`);
				})
				.catch((err) => {
					console.error(err.response.data);
				});
		}
	};

	useEffect(() => {
		getTimestamp();
	}, []);

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
			<div>
				phone:{" "}
				<input
					className="input input-bordered w-full max-w-xs"
					type="number"
					onChange={handleForm}
					value={form.phone}
					name="phone"
				/>
			</div>
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
			<div>
				Time Stamp:{" "}
				<input
					className="input input-bordered w-full max-w-xs"
					type="email"
					onChange={handleForm}
					value={date}
					name="time"
					disabled
				/>
			</div>

			<button type="submit" className="btn btn-outline">
				Submit
			</button>
		</form>
	);
};

export default Create;
