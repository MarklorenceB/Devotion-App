// 2. LogoutForm.tsx - Server component wrapper for the logout action
import { signOut } from "@/auth";
import LogoutButton from "./LogoutButton";

export default function LogoutForm() {
  const handleLogout = async () => {
    "use server";
    await signOut({ redirectTo: "/" });
  };

  return (
    <form action={handleLogout}>
      <LogoutButton
        onLogout={() => {
          // This will trigger the form submission
          const form = document.querySelector(
            "form[action]"
          ) as HTMLFormElement;
          if (form) form.requestSubmit();
        }}
      />
    </form>
  );
}
