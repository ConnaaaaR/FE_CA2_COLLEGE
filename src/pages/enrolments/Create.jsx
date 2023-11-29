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

	const getDateStamp = () => {
		const now = new Date();
		return now.toISOString().split("T")[0];
	};

	const getTimeStamp = () => {
		const now = new Date();
		return now.toTimeString().split(" ")[0];
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const timeStampedForm = {
			...form,
			date: getDateStamp(),
			time: getTimeStamp(),
		};
		console.log(timeStampedForm);
		axios
			.post("/enrolments", timeStampedForm, {
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
		<div className="rounded-xl bg-base-300 h-1/2 w-1/2">
			<h2 className="text-xl p-5 text-center">Create New Enrolment</h2>
			<form
				onSubmit={handleSubmit}
				className="form-control mx-auto w-100 max-w-md"
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

				<button className="btn my-5 btn-primary" type="submit">
					Create Enrolment
				</button>
			</form>
		</div>
	);
};

export default Create;
