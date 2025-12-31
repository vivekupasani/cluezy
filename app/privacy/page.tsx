import Link from "next/link";
import { SiInstagram, SiLinkedin, SiX } from "react-icons/si";

import { ArrowLeft } from "lucide-react";

interface PrivacySection {
    id: number;
    title: string;
    content: string;
}

const privacy: PrivacySection[] = [
    {
        id: 1,
        title: "Information We Collect",
        content:
            "We collect information that you provide directly to us as well as information collected automatically when you use our Service. When you register for an account or interact with Cluezy, you may share personal details such as your name, email address, and other contact information. You may also provide data related to the searches or queries you submit through the platform. Additionally, we automatically collect certain technical information such as your IP address, browser type, device details, operating system, and interaction data. We may use cookies and similar technologies to better understand how you use our Service and to enhance your experience."
    },
    {
        id: 2,
        title: "How We Use Your Information",
        content:
            "We use your information to operate, maintain, and improve the Service. This includes managing your account, delivering accurate AI-powered responses, and offering customer support. We may analyze user behavior to refine search accuracy, improve performance, and introduce new features. Occasionally, we may contact you with important updates or promotional information, though you can opt out of marketing communications at any time. We also use your data to comply with legal obligations and to enforce our Terms of Use."
    },
    {
        id: 3,
        title: "Data Sharing",
        content:
            "We do not sell, rent, or trade your personal information. However, we may share it with trusted third-party service providers who help us run and improve the Service. Information may also be shared when required by law or to protect our rights, safety, or property. In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of that transaction."
    },
    {
        id: 4,
        title: "Security Measures",
        content:
            "We use appropriate security measures to protect your information from unauthorized access, disclosure, or destruction. While we take every precaution to keep your data safe, no system is completely secure, and we cannot guarantee absolute protection."
    },
    {
        id: 5,
        title: "Your Choices",
        content:
            "You have control over your personal information. You can access and update your account details, opt out of promotional emails, or request account deactivation by contacting our support team."
    },
    {
        id: 6,
        title: "Children’s Privacy",
        content:
            "Cluezy is not intended for children under 13. We do not knowingly collect personal information from minors. If you believe we have collected such data, please contact us so we can take the necessary steps to delete it."
    },
    {
        id: 7,
        title: "Changes to This Privacy Policy",
        content:
            "We may update this Privacy Policy from time to time to reflect operational, legal, or regulatory changes. Updated versions will be posted on this page with a new effective date."
    },
    {
        id: 8,
        title: "Contact Us",
        content:
            "If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at 📧 cluezyai@gmail.com."
    },
    {
        id: 9,
        title: "Acknowledgment",
        content:
            "By using the Cluezy Service, you acknowledge that you have read, understood, and agree to this Privacy Policy."
    }
];

export default async function PrivacyPage() {
    return (
        <div className="h-screen overflow-y-auto CustomScrollbar">
            <div className="max-w-2xl flex flex-col mx-auto px-4">
                <Link
                    href="/"
                    className="group mt-10 md:mt-16 flex gap-2 items-center cursor-pointer">
                    <ArrowLeft size={18} className="text-foreground/70 group-hover:text-foreground" />
                    <p className="txt-grad group-hover:text-foreground text-sm">Back</p>
                </Link>

                <div className="mt-10 flex flex-col justify-center items-center text-center">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-tr from-foreground to-foreground/60">
                        Privacy Policy
                    </h1>
                    <h3 className="text-xs bg-clip-text text-transparent bg-gradient-to-tr from-foreground/90 to-foreground/60">
                        By using our service, you agree to our Privacy Policy
                    </h3>
                </div>

                <div className="mt-10 flex flex-col">
                    <span className="text-sm text-foreground/80 mb-2 leading-relaxed">
                        At Cluezy, we take your privacy seriously and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you access and use our AI-powered search and answer engine (collectively referred to as the “Service”). By using Cluezy, you agree to the collection and use of your information in accordance with this Privacy Policy.
                    </span>
                    {privacy.map((term) => (
                        <div key={term.id} className="py-3">
                            <h2 className="text-xl border-b border-border pb-2 font-semibold bg-clip-text text-transparent bg-gradient-to-tr from-foreground/95 to-foreground/85">{term.title}</h2>
                            <p className="mt-2 text-sm text-foreground/80">{term.content}</p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-2 mb-10 justify-center items-center">
                    <div className="flex gap-4">
                        <Link href="https://x.com/v1vekupasani" className="hover:cursor-pointer">
                            <SiX />
                        </Link>
                        <Link href="https://www.linkedin.com/company/cluezy/" className="hover:cursor-pointer">
                            <SiLinkedin />
                        </Link>
                        <Link href="https://www.instagram.com/v1vekupasani/" className="hover:cursor-pointer">
                            <SiInstagram />
                        </Link>
                    </div>
                    <span className="text-xs mt-2">
                        © 2025 Cluezy. All rights reserved.
                    </span>
                </div>
            </div>
        </div >
    );
}
