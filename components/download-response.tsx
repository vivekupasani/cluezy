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
        const html = marked.parse(message);
        const container = document.createElement("div");

        container.innerHTML = await html;
        container.style.width = "800px";
        container.style.padding = "24px";
        container.style.background = "white";
        container.style.position = "fixed";
        container.style.left = "-9999px";

        document.body.appendChild(container);

        const canvas = await html2canvas(container, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${chatId}.pdf`);

        document.body.removeChild(container);
    };

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
                    })
                );
            } else if (token.type === "paragraph") {
                children.push(
                    new Paragraph({
                        children: [new TextRun(token.text)],
                    })
                );
            } else if (token.type === "list") {
                token.items.forEach((item: any) => {
                    children.push(
                        new Paragraph({
                            text: item.text,
                            bullet: { level: 0 },
                        })
                    );
                });
            }
        });

        const doc = new Document({ sections: [{ children }] });
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
