import { BookOpen, Clock, CloudRain, CloudSun, FileSearch, FileText, Globe, GraduationCap, MessageCircle, Search, ShoppingBag, ShoppingCart, Video, Youtube } from 'lucide-react';
import { Button } from './ui';

const latestTrendingQuestions = [
  { heading: 'Smart Search', message: 'What’s trending on the web right now?', icon: Search },
  { heading: 'Academic Research', message: 'Find recent papers on AI and machine learning.', icon: BookOpen },
  { heading: 'Document Insights', message: 'Retrieve key points from uploaded company documents.', icon: FileSearch },
  { heading: 'Video Discovery', message: 'Find YouTube videos explaining blockchain in simple terms.', icon: Video },
  { heading: 'Ask Anything', message: 'Ask questions about tech, science, or daily topics.', icon: MessageCircle },
  { heading: 'Weather Update', message: 'What’s the weather like in Mumbai today?', icon: CloudSun },
  { heading: 'YouTube Analysis', message: 'Summarize this YouTube video: https://youtu.be/example', icon: Youtube },
  { heading: 'Date & Time Tools', message: 'Convert 5 PM IST to EST instantly.', icon: Clock },
  { heading: 'Product Finder', message: 'Search for the best laptops under ₹70,000.', icon: ShoppingCart },
  { heading: 'File Search (PDF/DOC/PPT)', message: 'Summarize the content of this uploaded PDF.', icon: FileText }
];

const trendingQuestions = [
  { heading: 'Web Search Trends', message: 'Show me the latest news in artificial intelligence.', icon: Globe },
  { heading: 'Academic Papers', message: 'Find scholarly articles about climate change.', icon: GraduationCap },
  { heading: 'Retrieve from Docs', message: 'What does the policy document say about leave rules?', icon: FileSearch },
  { heading: 'Video Search', message: 'Find videos that explain Stripe integration in Next.js.', icon: Video },
  { heading: 'General Q&A', message: 'Explain clean architecture in Flutter.', icon: MessageCircle },
  { heading: 'Weather Forecast', message: 'Will it rain in Delhi tomorrow?', icon: CloudRain },
  { heading: 'YouTube Breakdown', message: 'Summarize this tech talk video from YouTube.', icon: Youtube },
  { heading: 'Time Conversion', message: 'What time is it in New York when it’s 10 AM in India?', icon: Clock },
  { heading: 'Product Comparison', message: 'Compare iPhone 15 vs Samsung S24.', icon: ShoppingBag },
  { heading: 'Search in Files', message: 'Find “financial report” inside this PDF document.', icon: FileText }
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
