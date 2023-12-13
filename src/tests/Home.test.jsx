import React from "react";
import { render, waitFor } from "@testing-library/react";
import axios from "../config/api";
import Home from "../pages/Home";
import { AuthProvider } from "../contexts/AuthContext";

jest.mock("../config/api", () => ({
	get: jest.fn(),
}));

describe("Home", () => {
	beforeEach(() => {
		axios.get.mockReset();
	});

	it("renders without crashing", () => {
		render(
			<AuthProvider>
				<Home />
			</AuthProvider>
		);
	});

	it("fetches data and displays statistics when authenticated", async () => {
		const courses = [
			{ id: 1, name: "Course 1" },
			{ id: 2, name: "Course 2" },
		];
		const lecturers = [
			{ id: 1, name: "Lecturer 1" },
			{ id: 2, name: "Lecturer 2" },
		];
		const enrollments = [
			{ id: 1, created_at: new Date().toISOString() },
			{ id: 2, created_at: new Date().toISOString() },
		];

		axios.get.mockImplementation((url) => {
			switch (url) {
				case "/courses":
					return Promise.resolve({ data: { data: courses } });
				case "/lecturers":
					return Promise.resolve({ data: { data: lecturers } });
				case "/enrolments":
					return Promise.resolve({ data: { data: enrollments } });
				default:
					return Promise.reject(new Error("Invalid URL"));
			}
		});

		const { getByText } = render(
			<AuthProvider authenticated={true}>
				<Home />
			</AuthProvider>
		);

		await waitFor(() => {
			expect(axios.get).toHaveBeenCalledTimes(3);
			expect(axios.get).toHaveBeenCalledWith("/courses");
			expect(axios.get).toHaveBeenCalledWith("/lecturers");
			expect(axios.get).toHaveBeenCalledWith("/enrolments");
			expect(getByText("Number of courses")).toBeInTheDocument();
			expect(getByText("Number of Lecturers")).toBeInTheDocument();
			expect(getByText("Active Enrollments")).toBeInTheDocument();
			expect(getByText("Enrollments Percentage")).toBeInTheDocument();
		});
	});

	it("displays loading spinner when loading data", () => {
		const { getByTestId } = render(
			<AuthProvider authenticated={true}>
				<Home />
			</AuthProvider>
		);

		expect(getByTestId("loading-spinner")).toBeInTheDocument();
	});

	it("displays login form when not authenticated", () => {
		const { getByLabelText } = render(
			<AuthProvider authenticated={false}>
				<Home />
			</AuthProvider>
		);

		expect(getByLabelText(/email/i)).toBeInTheDocument();
		expect(getByLabelText(/password/i)).toBeInTheDocument();
	});
});
