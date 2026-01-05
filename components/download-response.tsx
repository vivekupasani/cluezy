"use client";

import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Download } from "lucide-react";
import { marked } from "marked";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const DownloadResponse = ({ message, chatId }: { message: string; chatId: string }) => {

    const downloadAsPdf = async () => {
        const html = marked.parse(message)

        const container = document.createElement("div")
        container.id = "pdf-export-root"

        container.innerHTML = await html

        /* ===== FORCE LIGHT THEME ===== */
        Object.assign(container.style, {
            background: "#ffffff",
            color: "#111827",
            width: "800px",
            padding: "32px",
            position: "fixed",
            left: "-9999px",
            top: "0",
            fontFamily:
                "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            lineHeight: "1.7",
            fontSize: "14px",
        })

        /* ===== SCOPED STYLES (NO GLOBAL EFFECTS) ===== */
        const style = document.createElement("style")
        style.innerHTML = `
    #pdf-export-root h1 {
      font-size: 28px;
      font-weight: 700;
      margin: 24px 0 12px;
    }

    #pdf-export-root h2 {
      font-size: 22px;
      font-weight: 600;
      margin: 20px 0 10px;
    }

    #pdf-export-root h3 {
      font-size: 18px;
      font-weight: 600;
      margin: 18px 0 8px;
    }

    #pdf-export-root p {
      margin: 10px 0;
    }

    #pdf-export-root ul,
    #pdf-export-root ol {
      padding-left: 20px;
      margin: 10px 0;
    }

    #pdf-export-root li {
      margin: 6px 0;
    }

    #pdf-export-root blockquote {
      border-left: 4px solid #e5e7eb;
      padding-left: 12px;
      margin: 12px 0;
      color: #374151;
      font-style: italic;
    }

    #pdf-export-root code {
      background: #f3f4f6;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 13px;
      font-family: monospace;
    }

    #pdf-export-root pre {
      background: #f3f4f6;
      padding: 14px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 16px 0;
      font-size: 13px;
    }

    #pdf-export-root pre code {
      background: transparent;
      padding: 0;
    }

    #pdf-export-root hr {
      border: none;
      border-top: 1px solid #e5e7eb;
      margin: 24px 0;
    }
  `

        container.appendChild(style)
        document.body.appendChild(container)

        /* ===== RENDER ===== */
        const canvas = await html2canvas(container, {
            scale: 2,
            backgroundColor: "#ffffff",
            useCORS: true,
        })

        const imgData = canvas.toDataURL("image/png")

        const pdf = new jsPDF("p", "mm", "a4")
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        const imgWidth = pdfWidth
        const imgHeight = (canvas.height * pdfWidth) / canvas.width

        let heightLeft = imgHeight
        let position = 0

        // Add first page
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight

        // Add additional pages if needed
        while (heightLeft > 0) {
            position = heightLeft - imgHeight // This creates a negative offset to "scroll" the image
            pdf.addPage()
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
            heightLeft -= pageHeight
        }

        pdf.save(`${chatId}.pdf`)

        document.body.removeChild(container)
    }

    const downloadAsMarkdown = () => {
        const blob = new Blob([message], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${chatId}.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const downloadAsDocx = async () => {
        const tokens = marked.lexer(message);
        const children: Paragraph[] = [];

        tokens.forEach((token: any) => {
            if (token.type === "heading") {
                children.push(
                    new Paragraph({
                        text: token.text,
                        heading:
                            token.depth === 1
                                ? HeadingLevel.HEADING_1
                                : token.depth === 2
                                    ? HeadingLevel.HEADING_2
                                    : HeadingLevel.HEADING_3,
                        spacing: {
                            before: 240,
                            after: 120,
                        },
                    })
                );
            } else if (token.type === "paragraph") {
                children.push(
                    new Paragraph({
                        children: [new TextRun(token.text)],
                        spacing: {
                            after: 200,
                        },
                    })
                );
            } else if (token.type === "list") {
                token.items.forEach((item: any) => {
                    children.push(
                        new Paragraph({
                            text: item.text,
                            bullet: { level: 0 },
                            spacing: {
                                after: 100,
                            },
                        })
                    );
                });
            }
        });

        const doc = new Document({
            sections: [{
                properties: {
                    page: {
                        margin: {
                            top: 1440,    // 1 inch
                            right: 1440,
                            bottom: 1440,
                            left: 1440,
                        },
                    },
                },
                children
            }]
        });
        const blob = await Packer.toBlob(doc);

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${chatId}.docx`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className="rounded-full h-8 w-8 ring-0"
                            type="button"
                            variant="ghost"
                            size="icon">
                            <Download size={14} className="text-foreground/70 hover:text-foreground transition-colors" />
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>

                <TooltipContent side="bottom" className="text-xs">Export</TooltipContent>
            </Tooltip>

            <DropdownMenuContent align="end" className="rounded-lg">
                <DropdownMenuItem onClick={downloadAsPdf} className="rounded-lg h-8 text-foreground/80 transition-colors cursor-pointer">
                    <DropdownMenuLabel className="text-xs">PDF</DropdownMenuLabel>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={downloadAsMarkdown} className="rounded-lg h-8 text-foreground/80 transition-colors cursor-pointer">
                    <DropdownMenuLabel className="text-xs">Markdown</DropdownMenuLabel>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={downloadAsDocx} className="rounded-lg h-8 text-foreground/80 transition-colors cursor-pointer">
                    <DropdownMenuLabel className="text-xs">DOCX</DropdownMenuLabel>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
