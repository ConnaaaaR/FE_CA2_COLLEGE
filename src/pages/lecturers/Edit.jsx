import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../config/api";
import { useAlert } from "../../contexts/AlertContext";

const Edit = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { showAlert } = useAlert();
	const [lecturer, setLecturer] = useState(null);
	const [form, setForm] = useState({
		name: "",
		address: "",
		phone: "",
		email: "",
	});
	const [errors, setErrors] = useState();
	const token = localStorage.getItem("token");

	useEffect(() => {
		axios
			.get(`/lecturers/${id}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
			.then((response) => {
				setLecturer(response.data.data);
				setForm({
					...form,
					name: response.data.data.name,
					address: response.data.data.address,
					phone: response.data.data.phone,
					email: response.data.data.email,
				});
			})
			.catch((err) => {
				console.error(err.response.data);
				setErrors(err.response.data.message);
			});
	}, [id, token]);

	const handleForm = (e) => {
		setForm((prevState) => ({
			...prevState,
			[e.target.name]: e.target.value,
		}));
	};

	const isRequired = (fields) => {
		let isValid = true;
		let newErrors = {};

		fields.forEach((field) => {
			if (!form[field]) {
				isValid = false;
				newErrors[field] = `${field} is required!`;
			}
		});

		setErrors(newErrors);
		return isValid;
	};

	const submitForm = (e) => {
		e.preventDefault();

		if (isRequired(["name", "address", "phone", "email"])) {
			axios
				.put(`/lecturers/${id}`, form)
				.then(() => {
					showAlert("success", "Lecturer edited successfully!");
					navigate(`/lecturer/${id}`);
				})
				.catch((err) => {
					console.error(err.response.data);
					showAlert("error", "An unexpected error occurred!");
					setErrors(err.response.data);
				});
		}
	};

	if (!lecturer) return <h3>Course not found!</h3>;

	return (
		<form onSubmit={submitForm}>
			<div>
				Name:{" "}
				<input
					className="input input-bordered w-full max-w-xs"
					type="text"
					onChange={handleForm}
					value={form.name}
					name="name"
				/>
			</div>
			<div>
				Address:{" "}
				<textarea
					className="textarea textarea-bordered h-40 w-full max-w-xs"
					type="text"
					onChange={handleForm}
					value={form.address}
					name="address"
				/>
			</div>
			<div>
				Phone:{" "}
				<input
					className="input input-bordered w-full max-w-xs"
					type="text"
					onChange={handleForm}
					value={form.phone}
					name="phone"
				/>
			</div>
			<div>
				Email:{" "}
				<input
					className="input input-bordered w-full max-w-xs"
					type="text"
					onChange={handleForm}
					value={form.email}
					name="email"
				/>
			</div>

			<button type="submit" className="btn btn-outline">
				Update Lecturer
			</button>
		</form>
	);
};

export default Edit;
