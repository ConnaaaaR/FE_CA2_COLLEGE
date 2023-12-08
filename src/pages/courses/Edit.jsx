import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../contexts/AlertContext";
import axios from "../../config/api";

const Edit = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { showAlert } = useAlert();
	const [course, setCourse] = useState(null);
	const [form, setForm] = useState({
		title: "",
		description: "",
		code: "",
		points: "",
		level: "",
	});
	const [errors, setErrors] = useState({});

	useEffect(() => {
		axios
			.get(`/courses/${id}`)
			.then((response) => {
				setCourse(response.data.data);
				setForm(response.data.data);
			})
			.catch((err) => {
				console.error(err.response.data);
				setErrors(err.response.data.message);
			});
	}, [id]);

	const handleForm = (e) => {
		setForm((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	const isRequired = (fields) => {
		let inc = true;
		setErrors({});

		fields.forEach((field) => {
			if (!form[field]) {
				inc = false;
				setErrors((prevState) => ({
					...prevState,
					[field]: {
						message: `${field} is required!`,
					},
				}));
			}
		});
		return inc;
	};

	const submitForm = (e) => {
		e.preventDefault();

		if (isRequired(["title", "description", "code", "points", "level"])) {
			axios
				.put(`/courses/${id}`, form)
				.then((response) => {
					showAlert("success", "Course Edited Successfully!");
					navigate(`/courses/${id}`);
				})
				.catch((err) => {
					console.error(err.response.data.message);
					showAlert("error", "Failed to Edit Course!");
				});
		}
	};

	if (!course) return <h3>Course not found!</h3>;

	return (
		<div className="rounded-xl p-2 bg-base-300 w-full sm:w-1/2">
			<h2 className="text-xl p-5 text-center">Edit Existing Course</h2>

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
					Edit Course
				</button>
			</form>
		</div>
	);
};

export default Edit;
