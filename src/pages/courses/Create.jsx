import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";

import axios from "../../config/api";

const Create = () => {
	const navigate = useNavigate();
	const [form, setForm] = useState({});
	const [errors, setErrors] = useState();
	const token = localStorage.getItem("token");

	const handleForm = (e) => {
		setForm((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	const validateCode = (code) => {
		const codePattern = /^[A-Za-z]{2}\d{3}$/;
		return codePattern.test(code);
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

		if (form["level"] && form["level"] < 7) {
			isValid = false;
			validationErrors["level"] = { message: "Level must be at least 7!" };
		}

		if (form["code"] && !validateCode(form["code"])) {
			isValid = false;
			validationErrors["code"] = {
				message: "Code must be in the format AA123!",
			};
		}

		setErrors(validationErrors);
		return isValid;
	};

	const submitForm = (e) => {
		e.preventDefault();

		if (isRequired(["title", "description", "code", "points", "level"])) {
			axios
				.post(`/courses/`, form, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((response) => {
					navigate(`/courses`);
				})
				.catch((err) => {
					console.error(err.response.data);
				});
		}
	};

	return (
		<form onSubmit={submitForm}>
			<div>
				title:{" "}
				<input
					className="input input-bordered w-full max-w-xs"
					type="text"
					onChange={handleForm}
					value={form.title}
					name="title"
				/>
			</div>
			<div>
				description:{" "}
				<input
					className="input input-bordered w-full max-w-xs"
					type="text"
					onChange={handleForm}
					value={form.description}
					name="description"
				/>
			</div>
			<div>
				code:{" "}
				<input
					className="input input-bordered w-full max-w-xs"
					type="text"
					onChange={handleForm}
					value={form.code}
					name="code"
					pattern="^[A-Za-z]{2}\d{3}$"
					title="Code must be in the format AA123"
				/>
			</div>
			<div>
				points:{" "}
				<input
					className="input input-bordered w-full max-w-xs"
					type="number"
					onChange={handleForm}
					value={form.points}
					name="points"
				/>
			</div>
			<div>
				level:{" "}
				<input
					className="input input-bordered w-full max-w-xs"
					type="number"
					onChange={handleForm}
					value={form.level}
					name="level"
					min="7"
					step="1"
					required
				/>
			</div>
			<button type="submit" className="btn btn-outline">
				Submit
			</button>
		</form>
	);
};

export default Create;
