import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function PlaybookPage() {
    return (
        <div className="h-full w-full overflow-y-auto CustomScrollbar bg-background">
            {/* Sticky Header */}
            {/* <div className="sticky top-0 z-20 border-b border-border/40 bg-background/80 backdrop-blur-md">
                <div className="max-w-2xl  px-4 py-4">
                    <Link href="/" className="group flex items-center gap-2 w-fit">
                        <ArrowLeft size={18} className="text-foreground/70 group-hover:text-foreground" />
                        <span className="text-sm txt-grad group-hover:text-foreground">
                            Back
                        </span>
                    </Link>
                </div>
            </div> */}

            {/* Main Content */}
            <div className="max-w-2xl mx-auto px-4 py-10 pb-20">
                {/* Title */}
                <div className="mt-10 text-center">
                    <h1 className="text-4xl pb-1 font-bold bg-clip-text text-transparent bg-gradient-to-tr from-foreground to-foreground/60">
                        Playbook
                    </h1>
                    <p className="mt-2 text-xs pb-1 bg-clip-text text-transparent bg-gradient-to-tr from-foreground/90 to-foreground/60">
                        A comprehensive guide to using Cluezy&apos;s agentic research capabilities
                    </p>
                </div>

                {/* Sections */}
                <div className="mt-12 grid gap-12">
                    {/* Core Search Capabilities */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-tr from-foreground to-foreground/80">
                            Core Search Capabilities
                        </h2>

                        <Accordion type="single" collapsible>
                            <AccordionItem value="web-search">
                                <AccordionTrigger className="text-sm">
                                    Web Search (search)
                                </AccordionTrigger>
                                <AccordionContent className="space-y-2 text-sm text-foreground/80 leading-relaxed">
                                    <p><strong>Purpose:</strong> Find information on current events, news, and general topics.</p>
                                    <p><strong>When to use:</strong> When you need broad internet results.</p>
                                    <div className="bg-muted/50 p-3 rounded-md text-xs font-mono border border-border/50">
                                        Examples: "Latest AI developments", "Explain quantum entanglement"
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="academic-search">
                                <AccordionTrigger className="text-sm">
                                    Academic Search (academicSearch)
                                </AccordionTrigger>
                                <AccordionContent className="space-y-2 text-sm text-foreground/80 leading-relaxed">
                                    <p><strong>Purpose:</strong> Locate peer-reviewed research papers and studies.</p>
                                    <p><strong>When to use:</strong> For scientific or scholarly research.</p>
                                    <div className="bg-muted/50 p-3 rounded-md text-xs font-mono border border-border/50">
                                        Examples: "CRISPR gene editing research", "Climate change marine studies"
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="video-search">
                                <AccordionTrigger className="text-sm">
                                    Video Search (videoSearch)
                                </AccordionTrigger>
                                <AccordionContent className="space-y-2 text-sm text-foreground/80 leading-relaxed">
                                    <p><strong>Purpose:</strong> Discover YouTube videos by topic.</p>
                                    <p><strong>When to use:</strong> When you want video tutorials or reviews.</p>
                                    <div className="bg-muted/50 p-3 rounded-md text-xs font-mono border border-border/50">
                                        Examples: "Italian pasta cooking tutorials", "Tech reviews on YouTube"
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="youtube-analysis">
                                <AccordionTrigger className="text-sm">
                                    YouTube Video Analysis (youtubeVideoAnalysis)
                                </AccordionTrigger>
                                <AccordionContent className="space-y-2 text-sm text-foreground/80 leading-relaxed">
                                    <p><strong>Purpose:</strong> Extract transcript, timestamps, and metadata from a YouTube URL.</p>
                                    <p><strong>When to use:</strong> When analyzing a specific YouTube video.</p>
                                    <div className="bg-muted/50 p-3 rounded-md text-xs font-mono border border-border/50">
                                        Example: "Analyze this video: https://youtube.com/watch?v=..."
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>

                    {/* Content Retrieval */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-tr from-foreground to-foreground/80">
                            Content Retrieval & Analysis
                        </h2>

                        <Accordion type="single" collapsible>
                            <AccordionItem value="retrieve">
                                <AccordionTrigger className="text-sm">
                                    Content Retrieval (retrieve)
                                </AccordionTrigger>
                                <AccordionContent className="space-y-2 text-sm text-foreground/80 leading-relaxed">
                                    <p><strong>Purpose:</strong> Read and extract content from a given URL.</p>
                                    <p><strong>When to use:</strong> When you want summaries or insights from articles.</p>
                                    <div className="bg-muted/50 p-3 rounded-md text-xs font-mono border border-border/50">
                                        Examples: "Summarize this blog", "Extract key points from this article"
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="product-search">
                                <AccordionTrigger className="text-sm">
                                    Product Search (productSearch)
                                </AccordionTrigger>
                                <AccordionContent className="space-y-2 text-sm text-foreground/80 leading-relaxed">
                                    <p><strong>Purpose:</strong> Identify products and find similar items.</p>
                                    <p><strong>When to use:</strong> When you provide a product or image URL.</p>
                                    <div className="bg-muted/50 p-3 rounded-md text-xs font-mono border border-border/50">
                                        Examples: "Find similar products", "Where can I buy this?"
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>

                    {/* PDF Upload & Intelligence */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-tr from-foreground to-foreground/80">
                            PDF Upload & Intelligence
                        </h2>

                        <Accordion type="single" collapsible>
                            <AccordionItem value="pdf-summarize">
                                <AccordionTrigger className="text-sm">
                                    PDF Summarization (pdfSummarize)
                                </AccordionTrigger>
                                <AccordionContent className="space-y-2 text-sm text-foreground/80 leading-relaxed">
                                    <p><strong>Purpose:</strong> Generate a concise summary of an uploaded PDF.</p>
                                    <p><strong>When to use:</strong> When the document is long and you want quick insights.</p>
                                    <div className="bg-muted/50 p-3 rounded-md text-xs font-mono border border-border/50">
                                        Examples: "Summarize this PDF", "Give me key takeaways"
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="pdf-chat">
                                <AccordionTrigger className="text-sm">
                                    Chat with PDF (pdfChat)
                                </AccordionTrigger>
                                <AccordionContent className="space-y-2 text-sm text-foreground/80 leading-relaxed">
                                    <p><strong>Purpose:</strong> Ask questions and have a conversation with the PDF content.</p>
                                    <p><strong>When to use:</strong> When you need specific answers from the document.</p>
                                    <div className="bg-muted/50 p-3 rounded-md text-xs font-mono border border-border/50">
                                        Examples: "What does section 3 explain?", "Summarize page 12"
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>

                    {/* Specialized Document Search */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-tr from-foreground to-foreground/80">
                            Specialized Document Search
                        </h2>

                        <Accordion type="single" collapsible>
                            <AccordionItem value="pdf-search">
                                <AccordionTrigger className="text-sm">
                                    PDF Search (pdfSearch)
                                </AccordionTrigger>
                                <AccordionContent className="space-y-2 text-sm text-foreground/80 leading-relaxed">
                                    <p><strong>Purpose:</strong> Locate PDF documents.</p>
                                    <p><strong>When to use:</strong> When you explicitly want PDFs.</p>
                                    <div className="bg-muted/50 p-3 rounded-md text-xs font-mono border border-border/50">
                                        Examples: "Machine learning PDFs", "Technical documentation PDFs"
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="doc-search">
                                <AccordionTrigger className="text-sm">
                                    Word Document Search (docSearch)
                                </AccordionTrigger>
                                <AccordionContent className="space-y-2 text-sm text-foreground/80 leading-relaxed">
                                    <p><strong>Purpose:</strong> Locate Word documents.</p>
                                    <p><strong>When to use:</strong> When you need DOC/DOCX files.</p>
                                    <div className="bg-muted/50 p-3 rounded-md text-xs font-mono border border-border/50">
                                        Examples: "Resume templates", "Business plan docs"
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="ppt-search">
                                <AccordionTrigger className="text-sm">
                                    PowerPoint Search (pptSearch)
                                </AccordionTrigger>
                                <AccordionContent className="space-y-2 text-sm text-foreground/80 leading-relaxed">
                                    <p><strong>Purpose:</strong> Locate PowerPoint presentations.</p>
                                    <p><strong>When to use:</strong> When you need slides.</p>
                                    <div className="bg-muted/50 p-3 rounded-md text-xs font-mono border border-border/50">
                                        Examples: "Marketing strategy PPTs", "Pitch deck templates"
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>

                    {/* Utility Tools */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-tr from-foreground to-foreground/80">
                            Utility Tools
                        </h2>

                        <Accordion type="single" collapsible>
                            <AccordionItem value="weather">
                                <AccordionTrigger className="text-sm">
                                    Weather (weather)
                                </AccordionTrigger>
                                <AccordionContent className="text-sm text-foreground/80">
                                    Examples: "Weather in London", "Forecast for tomorrow"
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="datetime">
                                <AccordionTrigger className="text-sm">
                                    Date & Time (datetime)
                                </AccordionTrigger>
                                <AccordionContent className="text-sm text-foreground/80">
                                    Examples: "Current date and time", "Days until Christmas"
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>

                    {/* Interactive */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-tr from-foreground to-foreground/80">
                            Interactive Capabilities
                        </h2>

                        <Accordion type="single" collapsible>
                            <AccordionItem value="ask-question">
                                <AccordionTrigger className="text-sm">
                                    Ask Question (ask_question)
                                </AccordionTrigger>
                                <AccordionContent className="text-sm text-foreground/80 leading-relaxed">
                                    Used when more clarification is required to refine a query.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>
                </div>
            </div>
        </div>
    )
}
