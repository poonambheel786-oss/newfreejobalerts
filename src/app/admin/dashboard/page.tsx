import { redirect } from "next/navigation";

export default function RedirectPage() {
  redirect("/control-panel/dashboard");
}
