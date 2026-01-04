"use client";

import Link from "next/link";

interface CTAProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
  variant?: "gradient" | "solid" | "outline";
}

export function CTA({
  title = "Ready to Get Started?",
  subtitle = "Join thousands of developers building amazing products",
  buttonText = "Start Building Free",
  buttonHref = "/signup",
  secondaryText,
  secondaryHref,
  variant = "gradient",
}: CTAProps) {
  const variants = {
    gradient: "bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500",
    solid: "bg-orange-500",
    outline: "bg-transparent border-2 border-orange-500",
  };

  return (
    <section className={`py-24 ${variants[variant]}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{title}</h2>

        {/* Subtitle */}
        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">{subtitle}</p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={buttonHref}
            className={`w-full sm:w-auto px-8 py-4 rounded-xl text-lg font-semibold transition-all ${
              variant === "outline"
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-white hover:bg-slate-100 text-slate-900"
            }`}
          >
            {buttonText}
          </Link>
          {secondaryText && secondaryHref && (
            <Link
              href={secondaryHref}
              className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/10 text-white border border-white/30 rounded-xl text-lg font-semibold transition-colors"
            >
              {secondaryText}
            </Link>
          )}
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex items-center justify-center gap-8 text-white/60 text-sm">
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Free forever plan
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            No credit card required
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Setup in 5 minutes
          </span>
        </div>
      </div>
    </section>
  );
}

export default CTA;

