import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import Home from "./page";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Website Inspector", () => {
  it("shows the Website Inspector in the idle state", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { name: "Website Inspector" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Inspect Website" })
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Website URL")).toBeInTheDocument();
  });

  it("shows an error when no URL is provided", () => {
    render(<Home />);

    fireEvent.click(
      screen.getByRole("button", { name: "Inspect Website" })
    );

    expect(
      screen.getByText("Please enter a website URL.")
    ).toBeInTheDocument();
  });

  it("changes to loading while the request is pending", async () => {
    const fetchMock = vi.fn(
      () =>
        new Promise<Response>(() => {
          // Keep request pending
        })
    );

    vi.stubGlobal("fetch", fetchMock);

    render(<Home />);

    const input = screen.getByLabelText("Website URL");
    const button = screen.getByRole("button", {
      name: "Inspect Website",
    });

    fireEvent.change(input, {
      target: { value: "https://example.com" },
    });

    fireEvent.click(button);

    expect(
      screen.getByRole("button", { name: "Inspecting..." })
    ).toBeDisabled();

    expect(
      screen.getByText("Inspecting website...")
    ).toBeInTheDocument();

    expect(
      screen.getByText("AI is calling the inspectWebsite tool.")
    ).toBeInTheDocument();
  });

  it("shows the inspection result when the API succeeds", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            title: "Example Domain",
            description: "This domain is for use in illustrative examples.",
            status: 200,
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
      )
    );

    render(<Home />);

    fireEvent.change(screen.getByLabelText("Website URL"), {
      target: { value: "https://example.com" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Inspect Website" })
    );

    await waitFor(() => {
      expect(
        screen.getByText("Website inspected successfully")
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Example Domain")).toBeInTheDocument();
    expect(screen.getByText("200 OK")).toBeInTheDocument();
    expect(
      screen.getByText(
        "This domain is for use in illustrative examples."
      )
    ).toBeInTheDocument();
  });

  it("shows an error when the API request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(
        new Error("The AI service returned an error.")
      )
    );

    render(<Home />);

    fireEvent.change(screen.getByLabelText("Website URL"), {
      target: { value: "https://example.com" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Inspect Website" })
    );

    await waitFor(() => {
      expect(
        screen.getByText("Inspection failed")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("The AI service returned an error.")
    ).toBeInTheDocument();
  });

  it("can be focused with the keyboard", () => {
    render(<Home />);

    const button = screen.getByRole("button", {
      name: "Inspect Website",
    });

    button.focus();

    expect(button).toHaveFocus();
  });
});