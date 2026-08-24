import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import Home from "./page";

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("Generate button", () => {
  it("shows the Generate button in the idle state", () => {
    render(<Home />);

    expect(
      screen.getByRole("button", { name: "Generate" })
    ).toBeInTheDocument();

    expect(screen.getByText("idle")).toBeInTheDocument();
  });

  it("changes to loading after clicking Generate", () => {
    vi.useFakeTimers();

    render(<Home />);

    fireEvent.click(
      screen.getByRole("button", { name: "Generate" })
    );

    expect(
      screen.getByRole("button", { name: "Generating..." })
    ).toBeDisabled();

    expect(screen.getByText("loading")).toBeInTheDocument();
  });

  it("does not allow another click while loading", () => {
    vi.useFakeTimers();

    render(<Home />);

    const button = screen.getByRole("button", {
      name: "Generate",
    });

    fireEvent.click(button);

    const loadingButton = screen.getByRole("button", {
      name: "Generating...",
    });

    expect(loadingButton).toBeDisabled();

    fireEvent.click(loadingButton);

    expect(screen.getByText("loading")).toBeInTheDocument();
  });

  it("shows success when the simulated request succeeds", () => {
    vi.useFakeTimers();

    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.5);

    render(<Home />);

    fireEvent.click(
      screen.getByRole("button", { name: "Generate" })
    );

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(
      screen.getByRole("button", { name: "Generated!" })
    ).toBeInTheDocument();

    expect(screen.getByText("success")).toBeInTheDocument();
  });

  it("shows error when the simulated request fails", () => {
    vi.useFakeTimers();

    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.1);

    render(<Home />);

    fireEvent.click(
      screen.getByRole("button", { name: "Generate" })
    );

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(
      screen.getByRole("button", { name: "Try again" })
    ).toBeInTheDocument();

    expect(screen.getByText("error")).toBeInTheDocument();
  });

  it("can be focused with the keyboard", () => {
    render(<Home />);
    
    const button = screen.getByRole("button", {
        name: "Generate",
    });

  button.focus();

  expect(button).toHaveFocus();
});
});