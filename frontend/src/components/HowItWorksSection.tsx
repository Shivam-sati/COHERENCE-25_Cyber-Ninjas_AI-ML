
import { Card, CardContent } from "@/components/ui/card";

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Upload Resumes",
      description: "Drag and drop multiple resume formats, including PDF, DOCX, and images."
    },
    {
      number: "02",
      title: "AI Analysis",
      description: "Our AI engine extracts key information and analyzes candidate profiles in seconds."
    },
    {
      number: "03",
      title: "Match to Jobs",
      description: "Intelligent algorithms match candidates to relevant job openings based on skills and experience."
    },
    {
      number: "04",
      title: "Rank & Compare",
      description: "Review ranked candidates with detailed comparisons and AI-generated insights."
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Our streamlined process makes resume screening fast, accurate, and bias-free.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="border-0 shadow-lg card-glass group hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="mb-4 text-4xl font-bold text-resume-blue group-hover:text-resume-purple transition-colors">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-16 relative">
          <div className="absolute -inset-0.5 bg-gradient-primary rounded-xl blur-lg opacity-30"></div>
          <div className="card-glass p-1 relative">
            <div className="rounded-lg overflow-hidden">
              <img
                src="https://placehold.co/1200x500/7209B7/FFFFFF.webp?text=Resume+Analysis+Flow"
                alt="How ResumeAI works"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
