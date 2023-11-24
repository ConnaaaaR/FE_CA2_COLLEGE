import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";

import axios from "../../config/api";

const Edit = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [course, setCourse] = useState(null);
	const [form, setForm] = useState({});
	const [errors, setErrors] = useState();
	const token = localStorage.getItem("token");

	useEffect(() => {
		axios
			.get(`/courses/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
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
				.put(`/courses/${id}`, form, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((response) => {
					navigate(`/courses/${id}`).catch((err) => {
						console.error(err.response.data.message);
					});
				});
		}
	};

	if (!course) return <h3>Course not found!</h3>;

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
				/>
			</div>
			<div>
				points:{" "}
				<input
					className="input input-bordered w-full max-w-xs"
					type="text"
					onChange={handleForm}
					value={form.points}
					name="points"
				/>
			</div>
			<div>
				level:{" "}
				<input
					className="input input-bordered w-full max-w-xs"
					type="text"
					onChange={handleForm}
					value={form.level}
					name="level"
				/>
			</div>
			<button type="submit" className="btn btn-outline">
				Submit
			</button>
		</form>
	);
};

export default Edit;
