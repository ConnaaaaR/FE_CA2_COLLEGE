import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Create from "../pages/lecturers/Create";
import axios from "../config/api";

jest.mock("../config/api");
const renderWithRouter = (component) => {
	return {
		...render(<Router>{component}</Router>),
	};
};

describe("Create Component", () => {
	it("renders correctly", () => {
		renderWithRouter(<Create />);
		expect(screen.getByText("Create New Lecturer")).toBeInTheDocument();
		expect(screen.getByLabelText("Name:")).toBeInTheDocument();
		expect(screen.getByLabelText("Address:")).toBeInTheDocument();
		expect(screen.getByLabelText("Phone:")).toBeInTheDocument();
		expect(screen.getByLabelText("Email:")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
	});

	it("updates form state on input change", () => {
		renderWithRouter(<Create />);
		const nameInput = screen.getByLabelText("Name:");
		fireEvent.change(nameInput, { target: { value: "John Doe" } });
		expect(nameInput.value).toBe("John Doe");
	});

	it("validates fields correctly", async () => {
		renderWithRouter(<Create />);
		const submitButton = screen.getByRole("button", { name: /submit/i });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText("name is required!")).toBeInTheDocument();
			expect(screen.getByText("address is required!")).toBeInTheDocument();
			expect(screen.getByText("email is required!")).toBeInTheDocument();
		});
	});

	it("validates phone field correctly", async () => {
		renderWithRouter(<Create />);

		const phoneInput = screen.getByLabelText("Phone:");
		fireEvent.change(phoneInput, { target: { value: "invalid-phone" } });

		const submitButton = screen.getByRole("button", { name: /submit/i });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(
				screen.getByText("Phone number must be in 0xx-xxxxxxx format!")
			).toBeInTheDocument();
		});
	});

	it("submits the form correctly", async () => {
		axios.post.mockResolvedValue({});

		renderWithRouter(<Create />);
		const nameInput = screen.getByLabelText("Name:");
		fireEvent.change(nameInput, { target: { value: "John Doe" } });
		const addressInput = screen.getByLabelText("Address:");
		fireEvent.change(addressInput, { target: { value: "123 Main St" } });
		const phoneInput = screen.getByLabelText("Phone:");
		fireEvent.change(phoneInput, { target: { value: "012-3456789" } });
		const emailInput = screen.getByLabelText("Email:");
		fireEvent.change(emailInput, { target: { value: "john@example.com" } });

		const submitButton = screen.getByRole("button", { name: /submit/i });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(axios.post).toHaveBeenCalledWith(`/lecturers/`, {
				name: "John Doe",
				address: "123 Main St",
				phone: "012-3456789",
				email: "john@example.com",
			});
		});
	});
});
