import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = {
  title: "Sign Up - {{projectName}}",
  description: "Create a new account",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-muted-foreground mt-2">
            Get started with your free account
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}

