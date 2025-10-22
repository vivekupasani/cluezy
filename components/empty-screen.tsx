import { Atom, BookOpenCheck, Bot, Brain, Code, DollarSign, FileText, Heart, Laptop, Layers, Leaf, MessageSquare, Recycle, Signal, Sparkles, TrendingUp, Wallet } from 'lucide-react';
import { Button } from './ui';

const latestTrendingQuestions = [
  { heading: 'Quantum computing for cybersecurity', message: 'How is quantum computing transforming cybersecurity in 2025?', icon: Atom },
  { heading: 'Agentic AI skills', message: 'Why are Agentic AI skills considered critical for tech professionals now?', icon: Brain },
  { heading: '5G-enabled SaaS products', message: 'What new SaaS products are emerging thanks to 5G expansion?', icon: Signal },
  { heading: 'Ethical AI in education', message: 'How are policymakers applying ethical AI to public education this year?', icon: BookOpenCheck },
  { heading: 'Sustainable SaaS innovations', message: 'What are the top sustainable SaaS innovations in 2025?', icon: Leaf },
  { heading: 'Startup ideas: Remote working tools', message: 'What are the most successful tech startup ideas for remote working?', icon: Laptop },
  { heading: 'FinTech API opportunities', message: 'What new FinTech APIs are disrupting the payments industry?', icon: Wallet },
  { heading: 'AI-powered content optimization', message: 'How does AI enhance content optimization for SaaS platforms?', icon: FileText },
  { heading: 'Micro-SaaS advantages', message: 'Why is micro-SaaS gaining popularity among entrepreneurs?', icon: Layers },
  { heading: 'Summary: https://arxiv.org/pdf/2501.05707', message: 'Summary: https://arxiv.org/pdf/2501.05707', icon: FileText }
];

const trendingQuestions = [
  { heading: 'What is Agentic AI?', message: 'What is Agentic AI and why is it trending in 2025?', icon: Bot },
  { heading: 'Best AI for coding', message: 'Which AI tools are best for coding tasks in 2025?', icon: Code },
  { heading: 'Generative AI applications', message: 'What are the most impactful generative AI applications this year?', icon: Sparkles },
  { heading: 'Quantum computing breakthroughs', message: 'What are the latest breakthroughs in quantum computing?', icon: Atom },
  { heading: 'Top AI startups 2025', message: 'Which AI startups are making headlines in 2025?', icon: TrendingUp },
  { heading: 'AI for therapy and wellbeing', message: 'How is AI being used for therapy and personal wellbeing?', icon: Heart },
  { heading: '5G’s impact on technology', message: 'How is 5G transforming tech and business in 2025?', icon: Signal },
  { heading: 'Sustainable technology trends', message: 'Which sustainable technologies are gaining momentum this year?', icon: Recycle },
  { heading: 'AI agents vs Chatbots', message: 'How are AI agents different from traditional chatbots?', icon: MessageSquare },
  { heading: 'Investment trends in SaaS', message: 'What are the current trends in SaaS startup investments?', icon: DollarSign }
];

export function EmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
  return (
    <div className={`relative w-full mt-2 overflow-hidden ${className}`}>
      {/* Fade effect overlays */}
      <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-28 sm:w-44 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-28 sm:w-44 bg-gradient-to-l from-background to-transparent" />

      <div className="relative w-full bg-background px-2 sm:px-4 py-2 sm:py-3">

        {/* Top Row → Right to Left */}
        <div className="marquee">
          <div className="marquee-content flex gap-2.5 sm:gap-4">
            {latestTrendingQuestions.concat(latestTrendingQuestions).map((message, index) => (
              <Button
                key={`row1-${index}`}
                className="h-6 sm:h-7 text-xs sm:text-sm font-normal text-foreground whitespace-nowrap bg-transparent hover:bg-card px-3 py-1.5 rounded-xl flex-shrink-0"
                name={message.message}
                onClick={async () => submitMessage(message.message)}
              >
                <div className="flex items-center gap-2">
                  <message.icon size={16} className="text-muted-foreground" />
                  {message.message}
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Bottom Row → Left to Right */}
        <div className="marquee-reverse mt-3 sm:mt-3">
          <div className="marquee-content flex gap-2.5 sm:gap-4">
            {trendingQuestions.concat(trendingQuestions).map((message, index) => (
              <Button
                key={`row2-${index}`}
                className="h-6 sm:h-7 text-xs sm:text-sm font-normal text-foreground whitespace-nowrap bg-transparent hover:bg-card px-3 rounded-xl flex-shrink-0"
                name={message.message}
                onClick={async () => submitMessage(message.message)}
              >
                <div className="flex items-center gap-2">
                  {/* <message.icon size={16} className="text-muted-foreground" /> */}
                  {message.message}
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee {
          overflow: hidden;
          position: relative;
        }

        .marquee-content {
          animation: marquee 130s linear infinite;
          display: flex;
          width: max-content;
        }

        /* Pause on hover (any button inside) */
        .marquee-content:hover {
          animation-play-state: paused;
        }

        .marquee-reverse .marquee-content {
          animation: marquee-reverse 90s linear infinite;
        }

        /* Pause reverse animation on hover */
        .marquee-reverse .marquee-content:hover {
          animation-play-state: paused;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        @media (max-width: 640px) {
          .marquee-content {
            animation-duration: 130s;
          }
          .marquee-reverse .marquee-content {
            animation-duration: 100s;
          }
        }
      `}</style>
    </div>
  )
}
