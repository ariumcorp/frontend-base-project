import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test-utils/renderWithProviders";
import { Severity } from "@/utils";
import { GlobalAlert } from "./GlobalAlert";

describe("GlobalAlert", () => {
  it("renders nothing when the alert queue is empty", () => {
    renderWithProviders(<GlobalAlert />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows the first alert in the queue", () => {
    renderWithProviders(<GlobalAlert />, {
      preloadedState: {
        alertSlice: {
          queue: [
            {
              id: "alert_1",
              message: "Guardado con éxito",
              severity: Severity.Success,
            },
          ],
        },
      },
    });

    expect(screen.getByText("Guardado con éxito")).toBeInTheDocument();
  });

  it("removes the alert when the user closes it", async () => {
    const user = userEvent.setup();
    renderWithProviders(<GlobalAlert />, {
      preloadedState: {
        alertSlice: {
          queue: [
            {
              id: "alert_1",
              message: "Guardado con éxito",
              severity: Severity.Success,
            },
          ],
        },
      },
    });

    await user.click(screen.getByRole("button", { name: /close/i }));

    expect(screen.queryByText("Guardado con éxito")).not.toBeInTheDocument();
  });
});
