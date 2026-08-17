import { createFileRoute } from "@tanstack/react-router";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const Route = createFileRoute("/checkout/")({
  component: CheckoutForm,
});
