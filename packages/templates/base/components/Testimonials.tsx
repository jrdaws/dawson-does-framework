"use client";

interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
}

interface TestimonialsProps {
  title?: string;
  subtitle?: string;
  testimonials?: Testimonial[];
  layout?: "grid" | "carousel";
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    quote: "This has completely transformed how we build products. The speed and quality are unmatched.",
    author: "Sarah Chen",
    role: "CTO",
    company: "TechStart",
  },
  {
    quote: "We shipped our MVP in 2 weeks instead of 2 months. Absolutely game-changing for startups.",
    author: "Marcus Johnson",
    role: "Founder",
    company: "LaunchPad",
  },
  {
    quote: "The best developer experience I've ever had. Our team productivity increased by 3x.",
    author: "Emily Rodriguez",
    role: "Lead Developer",
    company: "InnovateCo",
  },
];

export function Testimonials({
  title = "What Our Customers Say",
  subtitle = "Don't just take our word for it",
  testimonials = DEFAULT_TESTIMONIALS,
  layout = "grid",
}: TestimonialsProps) {
  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{title}</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Testimonials Grid */}
        <div
          className={
            layout === "grid"
              ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              : "flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
          }
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 ${
                layout === "carousel" ? "min-w-[350px] snap-center" : ""
              }`}
            >
              {/* Quote icon */}
              <svg
                className="w-8 h-8 text-orange-500/50 mb-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>

              {/* Quote */}
              <p className="text-slate-300 mb-6 leading-relaxed italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                  {testimonial.avatar ? (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold text-sm">
                      {testimonial.author.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{testimonial.author}</p>
                  {(testimonial.role || testimonial.company) && (
                    <p className="text-slate-400 text-xs">
                      {testimonial.role}
                      {testimonial.role && testimonial.company && " at "}
                      {testimonial.company}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;

