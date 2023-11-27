import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../config/api";

const Create = () => {
	const navigate = useNavigate();
	const [form, setForm] = useState({
		date: "",
		time: "",
		status: "",
		course_id: "",
		lecturer_id: "",
	});
	const [errors, setErrors] = useState({});
	const [courses, setCourses] = useState([]);
	const [lecturers, setLecturers] = useState([]);
	const token = localStorage.getItem("token");

	useEffect(() => {
		axios
			.get("/courses", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				setCourses(response.data.data);
			})
			.catch((error) => {
				console.error("Error fetching courses", error);
			});
		axios
			.get("/lecturers", {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				setLecturers(response.data.data);
			})
			.catch((error) => {
				console.error("Error fetching lecturers", error);
			});
	}, [token]);

	const handleForm = (e) => {
		setForm((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		axios
			.post("/enrolments", form, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				navigate("/enrolments");
			})
			.catch((error) => {
				if (error.response && error.response.data.errors) {
					setErrors(error.response.data.errors);
				} else {
					console.error("An unexpected error occurred", error);
				}
			});
	};

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label>Date:</label>
				<input
					type="date"
					name="date"
					value={form.date}
					onChange={handleForm}
				/>
				{errors.date && <span className="text-error">{errors.date}</span>}
			</div>
			<div>
				<label>Time:</label>
				<input
					type="time"
					name="time"
					value={form.time}
					onChange={handleForm}
				/>
				{errors.time && <span className="text-error">{errors.time}</span>}
			</div>
			<div>
				<label>Status:</label>
				<select name="status" value={form.status} onChange={handleForm}>
					{/* Status options */}
					<option value="">Select Status</option>
					<option value="enrolled">Enrolled</option>
					<option value="completed">Completed</option>
					<option value="interested">Interested</option>
					{/* etc. */}
				</select>
				{errors.status && <span className="text-error">{errors.status}</span>}
			</div>
			<div>
				<label>Course:</label>
				<select name="course_id" value={form.course_id} onChange={handleForm}>
					<option value="">Select a Course</option>
					{courses.map((course) => (
						<option key={course.id} value={course.id}>
							{course.title}
						</option>
					))}
				</select>
				{errors.course_id && (
					<span className="text-error">{errors.course_id}</span>
				)}
			</div>
			<div>
				<label>Lecturer:</label>
				<select
					name="lecturer_id"
					value={form.lecturer_id}
					onChange={handleForm}
				>
					<option value="">Select a Lecturer</option>
					{lecturers.map((lecturer) => (
						<option key={lecturer.id} value={lecturer.id}>
							{lecturer.name}
						</option>
					))}
				</select>
				{errors.lecturer_id && (
					<span className="text-error">{errors.lecturer_id}</span>
				)}
			</div>
			<button type="submit">Create Enrolment</button>
		</form>
	);
};

export default Create;
