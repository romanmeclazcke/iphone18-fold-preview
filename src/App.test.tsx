import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

afterEach(cleanup);

describe("App", () => {
  it("shows an inline error for invalid URLs", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText("Website URL"), { target: { value: "not a url" } });
    fireEvent.click(screen.getByRole("button", { name: "Load site" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid public URL");
  });

  it("loads a normalized URL in the preview", () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText("Website URL"), { target: { value: "example.com" } });
    fireEvent.click(screen.getByRole("button", { name: "Load site" }));
    expect(screen.getByTitle("Preview of https://example.com/")).toHaveAttribute("src", "https://example.com/");
  });
});
