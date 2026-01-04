import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Get started with {{projectName}} today
          </p>
        </div>
        
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-none bg-transparent",
            },
          }}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
        />
      </div>
    </div>
  );
}

