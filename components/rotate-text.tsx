import { MorphingText } from './ui/morphing-text';

const rotatingTexts = [
    "Your questions, answered.",
    "Need clarity? Just ask.",
    "Knowledge at your fingertips.",
    "Ideas explained, simply.",
    "Your AI study buddy.",
    "Answers made simple.",
    "Curious? Just type it."
]

export function RotatingText() {

    return <MorphingText texts={rotatingTexts} />;
}
