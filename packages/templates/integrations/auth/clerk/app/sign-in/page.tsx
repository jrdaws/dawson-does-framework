import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>
        
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-none bg-transparent",
            },
          }}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
}

