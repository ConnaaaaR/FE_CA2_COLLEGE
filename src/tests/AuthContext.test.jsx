import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AuthProvider, useAuth } from "../contexts/AuthContext";


function TestComponent() {
	const { authenticated, onAuthenticated } = useAuth();
	return (
		<div>
			{authenticated ? (
				<div data-testid="authenticated">Authenticated</div>
			) : (
				"Not authenticated"
			)}
			<button
				data-testid="authenticate"
				onClick={() => onAuthenticated(!authenticated, "fake_token")}
			>
				Toggle authentication
			</button>
		</div>
	);
}

describe("AuthProvider", () => {
	it("renders without crashing", () => {
		render(
			<AuthProvider>
				<TestComponent />
			</AuthProvider>
		);
	});

	it("sets authenticated state to true if token exists in localStorage", () => {
		const token = "fake_token";
		localStorage.setItem("token", token);

		render(
			<AuthProvider>
				<TestComponent />
			</AuthProvider>
		);

		expect(screen.getByTestId("authenticated")).toBeInTheDocument();
	});

	it("sets authenticated state to false if token does not exist in localStorage", () => {
		localStorage.removeItem("token");

		render(
			<AuthProvider>
				<TestComponent />
			</AuthProvider>
		);

		expect(screen.queryByTestId("authenticated")).toBeNull();
	});

	it("updates authenticated state and localStorage when onAuthenticated is called with auth=true and token", () => {
		localStorage.removeItem("token");

		render(
			<AuthProvider>
				<TestComponent />
			</AuthProvider>
		);

		fireEvent.click(screen.getByTestId("authenticate"));

		expect(localStorage.getItem("token")).toBe("fake_token");
		expect(screen.getByTestId("authenticated")).toBeInTheDocument();
	});

	it("updates authenticated state and removes token from localStorage when onAuthenticated is called with auth=false", () => {
		const token = "fake_token";
		localStorage.setItem("token", token);

		render(
			<AuthProvider>
				<TestComponent />
			</AuthProvider>
		);

		fireEvent.click(screen.getByTestId("authenticate"));

		expect(localStorage.getItem("token")).toBeNull();
		expect(screen.queryByTestId("authenticated")).toBeNull();
	});
});
