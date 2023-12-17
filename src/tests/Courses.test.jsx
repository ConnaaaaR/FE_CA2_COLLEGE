import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import Index from "../pages/courses/Index";

jest.mock("axios");

describe("Index", () => {
	beforeEach(() => {
		axios.get.mockResolvedValue({
			data: [
				{
					id: 1,
					title: "Course 1",
					code: "CA456",
					description: "Course 1 description",
					points: 300,
					level: "10",
					enrolments: [],
				},
				{
					id: 2,
					title: "Course 2",
					code: "CA123",
					description: "Course 2 description",
					points: 400,
					level: "8",
					enrolments: [],
				},
			],
		});
	});

	it("renders the component without crashing", async () => {
		render(<Index />);
		expect(screen.getByText("All Courses")).toBeInTheDocument();
	});

	it("displays loading skeleton when courses are being fetched", async () => {
		render(<Index />);
		expect(screen.getAllByTestId("skeleton-row")).toHaveLength(15);
	});

	it("displays the courses when fetched successfully", async () => {
		render(<Index />);
		await waitFor(() => {
			expect(screen.getByText("Course 1")).toBeInTheDocument();
			expect(screen.getByText("Course 2")).toBeInTheDocument();
		});
	});

	it("toggles course selection when checkbox is clicked", async () => {
		render(<Index />);
		await waitFor(() => {
			const checkbox = screen.getByLabelText("Course 1");
			fireEvent.click(checkbox);
			expect(checkbox.checked).toBe(true);
			fireEvent.click(checkbox);
			expect(checkbox.checked).toBe(false);
		});
	});

	it("opens delete confirmation modal when delete button is clicked", async () => {
		render(<Index />);
		await waitFor(() => {
			const deleteButton = screen.getByText("Delete Selected");
			fireEvent.click(deleteButton);
			expect(
				screen.getByText(
					"Are you sure you want to delete the selected courses?"
				)
			).toBeInTheDocument();
		});
	});

	it("deletes selected courses and their enrollments when delete confirmation is confirmed", async () => {
		axios.delete.mockResolvedValueOnce({});
		render(<Index />);
		await waitFor(() => {
			const checkbox = screen.getByLabelText("Course 1");
			fireEvent.click(checkbox);
			const deleteButton = screen.getByText("Delete Selected");
			fireEvent.click(deleteButton);
			const confirmButton = screen.getByText("Confirm");
			fireEvent.click(confirmButton);
			expect(axios.delete).toHaveBeenCalledTimes(2);
			expect(axios.delete).toHaveBeenCalledWith("/enrolments/1");
			expect(axios.delete).toHaveBeenCalledWith("/courses/1");
		});
	});
});
