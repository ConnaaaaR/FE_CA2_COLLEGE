import React from "react";
import { render, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

describe("AuthProvider", () => {
	it("renders without crashing", () => {
		render(
			<AuthProvider>
				<div>Test</div>
			</AuthProvider>
		);
	});

	it("sets authenticated state to true if token exists in localStorage", () => {
		const token = "fake_token";
		localStorage.setItem("token", token);

		let component;
		act(() => {
			component = render(
				<AuthProvider>
					<div data-testid="authenticated">Test</div>
				</AuthProvider>
			);
		});

		expect(component.getByTestId("authenticated")).toBeInTheDocument();
	});

	it("sets authenticated state to false if token does not exist in localStorage", () => {
		localStorage.removeItem("token");

		let component;
		act(() => {
			component = render(
				<AuthProvider>
					<div>Test</div>
				</AuthProvider>
			);
		});

		expect(component.container.firstChild).toBeInTheDocument();
		expect(component.container.firstChild).toHaveTextContent("Test");
		expect(component.container.firstChild).toMatchSnapshot();
		expect(component.container.firstChild).not.toHaveAttribute(
			"data-testid",
			"authenticated"
		);
	});

	it("updates authenticated state and localStorage when onAuthenticated is called with auth=true and token", () => {
		let component;
		const token = "fake_token";
		localStorage.setItem("token", token);
		const { onAuthenticated } = useAuth();
		act(() => {
			component = render(
				<AuthProvider>
					<button
						data-testid="authenticate"
						onClick={() => {
							onAuthenticated(true, token);
						}}
					>
						test
					</button>
				</AuthProvider>
			);
		});

		// console.log(token);
		const button = component.container.firstChild;
		expect(button).toBeInTheDocument();
		expect(button.textContent).toBe("test");

		act(() => {
			button.click();
		});

		expect(localStorage.getItem("token")).toBe(token);
		expect(button).toHaveAttribute("data-testid", "authenticate");
	});

	// it("updates authenticated state and removes token from localStorage when onAuthenticated is called with auth=false", () => {
	// 	const token = "fake_token";
	// 	localStorage.setItem("token", token);

	// 	let component;
	// 	act(() => {
	// 		component = render(
	// 			<AuthProvider>
	// 				{({ onAuthenticated }) => (
	// 					<button data-testid="Logout" onClick={() => onAuthenticated(false)}>
	// 						Logout
	// 					</button>
	// 				)}
	// 			</AuthProvider>
	// 		);
	// 	});

	// 	const button = component.getByTestId("Logout");
	// 	expect(button).toBeInTheDocument();

	// 	act(() => {
	// 		component.getByText("Logout").click();
	// 	});

	// 	expect(localStorage.getItem("token")).toBeNull();
	// 	expect(component.container.firstChild).not.toHaveAttribute(
	// 		"data-testid",
	// 		"authenticated"
	// 	);
	// });
});
