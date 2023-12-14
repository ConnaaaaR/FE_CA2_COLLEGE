import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../../contexts/AlertContext";
import axios from "../../config/api";

const Create = () => {
	const navigate = useNavigate();
	const { showAlert } = useAlert();
	const [form, setForm] = useState({});
	const [errors, setErrors] = useState({});

	const handleForm = (e) => {
		setForm((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	const validateCode = (code) => {
		const codePattern = /^[A-Z]{2}\d{3}$/;
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
				.post(`/courses/`, form)
				.then(() => {
					showAlert("success", "Course Created Successfully!");
					navigate(`/courses`);
				})
				.catch((err) => {
					console.error(err.response.data);
				});
		}
	};

	return (
		<div className="rounded-xl p-2 bg-base-300 w-full sm:w-1/2">
			<h2 className="text-xl p-5 text-center">Create New Course</h2>

			<form
				onSubmit={submitForm}
				className="form-control mx-auto w-100 max-w-md"
			>
				<div className="form-group">
					<label className="label">
						<span className="label-text">Title:</span>
					</label>
					<input
						className="input input-bordered w-full "
						type="text"
						onChange={handleForm}
						value={form.title}
						name="title"
					/>
				</div>
				{errors.title && <span className="text-error">{errors.title}</span>}
				<div className="form-group">
					<label className="label">
						<span className="label-text">Description:</span>
					</label>
					<input
						className="input input-bordered w-full "
						type="text"
						onChange={handleForm}
						value={form.description}
						name="description"
					/>
				</div>
				{errors.description && (
					<span className="text-error">{errors.description}</span>
				)}
				<div className="form-group[">
					<label className="label">
						<span className="label-text">Code:</span>
					</label>
					<input
						className="input input-bordered w-full "
						type="text"
						onChange={handleForm}
						value={form.code}
						name="code"
						pattern="^[A-Za-z]{2}\d{3}$"
						title="Code must be in the format AA123"
					/>
				</div>
				{errors.code && <span className="text-error">{errors.code}</span>}
				<div className="form-group">
					<label className="label">
						<span className="label-text">Points:</span>
					</label>
					<input
						className="input input-bordered w-full "
						type="number"
						onChange={handleForm}
						value={form.points}
						name="points"
					/>
				</div>
				<div className="form-group">
					<label className="label">
						<span className="label-text">Level:</span>
					</label>
					<input
						className="input input-bordered w-full "
						type="number"
						onChange={handleForm}
						value={form.level}
						name="level"
						min="7"
						step="1"
						required
					/>
				</div>
				{errors.level && <span className="text-error">{errors.level}</span>}
				<button className="btn my-5 btn-primary" type="submit">
					Create Course
				</button>
			</form>
		</div>
	);
};

export default Create;
