import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../contexts/AlertContext";

import axios from "../../config/api";

const Edit = () => {
	const { id } = useParams();
	const { showAlert } = useAlert();
	const navigate = useNavigate();
	const [enrolment, setEnrolment] = useState(null);
	const [courses, setCourses] = useState(null);
	const [lecturers, setLecturers] = useState(null);
	const [loading, setLoading] = useState(false);

	const [form, setForm] = useState({});
	const [errors, setErrors] = useState({});
	const token = localStorage.getItem("token");

	useEffect(() => {
		setLoading(true);
		axios
			.get(`/enrolments/${id}`)
			.then((response) => {
				setEnrolment(response.data.data);
				// set the initial form state with the fetched enrolment data
				setForm({
					status: response.data.data.status,
					course_id: response.data.data.course_id,
					lecturer_id: response.data.data.lecturer_id,
				});
			})
			.catch((error) => {
				setLoading(false);
				console.error("Error fetching enrolment", error);
			});
	}, [id, token]);

	useEffect(() => {
		axios
			.get("/courses")
			.then((response) => {
				setCourses(response.data.data);
			})
			.catch((error) => {
				console.error("Error fetching courses", error);
			});
		axios
			.get("/lecturers")
			.then((response) => {
				setLecturers(response.data.data);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching lecturers", error);
			});
	}, []);

	const handleForm = (e) => {
		setForm((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	const getDateStamp = () => {
		const now = new Date();
		return now.toISOString().split("T")[0];
	};

	const getTimeStamp = () => {
		const now = new Date();
		return now.toTimeString().split(" ")[0];
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

		if (isRequired(["status", "course_id", "lecturer_id"])) {
			const timeStampedForm = {
				...form,
				date: getDateStamp(),
				time: getTimeStamp(),
			};
			axios
				.put(`/enrolments/${id}`, timeStampedForm)
				.then(() => {
					showAlert("success", "Enrollment Updated Successfully!");
					navigate(-1);
				})
				.catch((error) => {
					if (error.response && error.response.data.errors) {
						setErrors(error.response.data.errors);
					} else {
						console.error("An unexpected error occurred", error);
					}
				});
		}
	};

	if (loading)
		return <span className="loading loading-spinner loading-lg"></span>;
	if (!loading && !enrolment)
		return <h3>Error fetching enrolment! Enrolment does not exist.</h3>;

	return (
		<div className="rounded-xl p-2 bg-base-300 w-full sm:w-1/2">
			<h2 className="text-xl p-5 text-center">Update Existing Enrollment</h2>

			<form
				onSubmit={submitForm}
				className="form-control mx-autow-100 max-w-md"
			>
				<div className="form-group ">
					<label className="label">
						<span className="label-text">Status:</span>
					</label>
					<select
						className="select select-bordered w-full"
						name="status"
						value={form.status}
						onChange={handleForm}
					>
						<option value="">Select Status</option>
						<option value="assigned">Assigned</option>
						<option value="career_break">Career Break</option>
						<option value="interested">Interested</option>
						<option value="associate">Associate</option>
					</select>
					{errors.status && <span className="text-error">{errors.status}</span>}
				</div>

				<div className="form-group ">
					<label className="label">
						<span className="label-text">Course:</span>
					</label>
					<select
						className="select select-bordered w-full"
						name="course_id"
						value={form.course_id}
						onChange={handleForm}
					>
						<option value="">Select a Course</option>
						{courses?.map((course) => (
							<option key={course.id} value={course.id}>
								{course.title}
							</option>
						))}
					</select>
					{errors.course_id && (
						<span className="text-error">{errors.course_id}</span>
					)}
				</div>

				<div className="form-group">
					<label className="label">
						<span className="label-text">Lecturer:</span>
					</label>
					<select
						className="select select-bordered w-full"
						name="lecturer_id"
						value={form.lecturer_id}
						onChange={handleForm}
					>
						<option value="">Select a Lecturer</option>
						{lecturers?.map((lecturer) => (
							<option key={lecturer.id} value={lecturer.id}>
								{lecturer.name}
							</option>
						))}
					</select>
					{errors.lecturer_id && (
						<span className="text-error">{errors.lecturer_id}</span>
					)}
				</div>

				<button className="btn my-5 btn-primary" type="submit">
					Edit Enrolment
				</button>
			</form>
		</div>
	);
};

export default Edit;
