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
	const [errors, setErrors] = useState({});
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
		<div className="rounded-xl bg-base-300 w-1/2">
			<h2 className="text-xl p-5 text-center">Update Existing Lecturer</h2>
			<form
				onSubmit={submitForm}
				className="form-control mx-auto w-100 max-w-md"
			>
				<div className="form-group">
					<label className="label">
						<span className="label-text">Name:</span>
					</label>
					<input
						className="input input-bordered w-full "
						type="text"
						onChange={handleForm}
						value={form.name}
						name="name"
					/>
				</div>
				{errors.name && <span className="text-error">{errors.name}</span>}
				<div>
					<label className="label">
						<span className="label-text">Address:</span>
					</label>
					<textarea
						className="textarea textarea-bordered h-40 w-full "
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
						className="input input-bordered w-full "
						type="text"
						onChange={handleForm}
						value={form.phone}
						name="phone"
					/>
				</div>
				{errors.phone && <span className="text-error">{errors.phone}</span>}
				<div className="form-group">
					<label className="label">
						<span className="label-text">Email:</span>
					</label>
					<input
						className="input input-bordered w-full "
						type="text"
						onChange={handleForm}
						value={form.email}
						name="email"
					/>
				</div>
				{errors.email && <span className="text-error">{errors.email}</span>}
				<button type="submit" className="btn my-5 btn-primary">
					Update Lecturer
				</button>
			</form>
		</div>
	);
};

export default Edit;
