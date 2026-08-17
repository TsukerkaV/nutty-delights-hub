import { Outlet, createFileRoute } from "@tanstack/react-router";
import { CheckoutShell } from "@/components/checkout/CheckoutShell";

export const Route = createFileRoute("/checkout")({
  component: CheckoutLayout,
});

function CheckoutLayout() {
  return (
    <CheckoutShell>
      <Outlet />
    </CheckoutShell>
  );
}
