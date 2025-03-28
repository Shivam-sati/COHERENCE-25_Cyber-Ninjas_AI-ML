
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-primary text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Hiring Process?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join hundreds of companies that have streamlined their recruitment with our AI-powered platform.
          </p>
          <Button asChild className="rounded-full h-12 px-8 text-base bg-white text-resume-blue hover:bg-white/90 transition-colors">
            <Link to="/signup">
              Get Started For Free
            </Link>
          </Button>
          <p className="mt-4 text-white/70 text-sm">
            No credit card required. 14-day free trial.
          </p>
        </div>
      </div>
    </section>
  );
}
