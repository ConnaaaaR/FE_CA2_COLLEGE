import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "../config/api";
import LoginForm from "../components/LoginForm";
import { AuthProvider } from "../contexts/AuthContext";

jest.mock("../config/api", () => ({
	interceptors: {
		request: {
			use: jest.fn(),
		},
	},
	post: jest.fn(),
}));

describe("LoginForm", () => {
	it("renders without crashing", () => {
		render(
			<AuthProvider>
				<LoginForm />
			</AuthProvider>
		);
	});

	it("updates state when input fields change", () => {
		const { getByLabelText } = render(
			<AuthProvider>
				<LoginForm />
			</AuthProvider>
		);

		fireEvent.change(getByLabelText(/email/i), {
			target: { value: "test@test.com" },
		});
		fireEvent.change(getByLabelText(/password/i), {
			target: { value: "password" },
		});

		expect(getByLabelText(/email/i).value).toBe("test@test.com");
		expect(getByLabelText(/password/i).value).toBe("password");
	});

	it("submits the form and calls the API", async () => {
		axios.post.mockResolvedValue({ data: { token: "fake_token" } });

		const { getByLabelText, getByRole } = render(
			<AuthProvider>
				<LoginForm />
			</AuthProvider>
		);

		fireEvent.change(getByLabelText(/email/i), {
			target: { value: "test@test.com" },
		});
		fireEvent.change(getByLabelText(/password/i), {
			target: { value: "password" },
		});
		fireEvent.click(getByRole("button", { name: /login/i }));

		await waitFor(() =>
			expect(axios.post).toHaveBeenCalledWith("/login", {
				email: "test@test.com",
				password: "password",
			})
		);
	});

	it("displays error message when API call fails", async () => {
		axios.post.mockRejectedValue({
			response: {
				data: { error: { email: "Email error", password: "Password error" } },
			},
		});

		const { getByLabelText, getByRole, findByText } = render(
			<AuthProvider>
				<LoginForm />
			</AuthProvider>
		);

		fireEvent.change(getByLabelText(/email/i), {
			target: { value: "test@test.com" },
		});
		fireEvent.change(getByLabelText(/password/i), {
			target: { value: "password" },
		});
		fireEvent.click(getByRole("button", { name: /login/i }));

		const emailError = await findByText("Email error");
		const passwordError = await findByText("Password error");

		expect(emailError).toBeInTheDocument();
		expect(passwordError).toBeInTheDocument();
	});
});
