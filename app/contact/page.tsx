"use client"
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useState } from 'react';
import { SiInstagram, SiLinkedin, SiX } from 'react-icons/si';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleSubmit = (e: any) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
    };

    const handleChange = (e: any) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <h1 className="text-4xl font-bold">Lets Have a Chat</h1>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Have questions about Cluezy, feature suggestions? We’d love to hear from you
                    </p>
                </div>

                {/* Form */}
                <div className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">
                                First name
                            </label>
                            <Input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Jonathan"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">
                                Last name
                            </label>
                            <Input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="James"
                            />
                        </div>
                    </div>

                    {/* Email and Phone */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">
                                Email
                            </label>
                            <Input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Jonathan2718@gmail.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">
                                Phone number
                            </label>
                            <Input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+x xxx xxx xxxx"
                            />
                        </div>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm text-muted-foreground mb-2">
                            Message
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Hey I have some issues activating my account..."
                            rows={4}
                            className="w-full bg-background border border-input rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 rounded-lg transition-colors duration-200"
                    >
                        Send message
                    </button>

                    {/* Social Icons */}
                    <div className="flex flex-col gap-2 mb-10 justify-center items-center">
                        <div className="flex gap-4">
                            <Link href="" className="hover:cursor-pointer">
                                <SiX />
                            </Link>
                            <Link href="https://www.linkedin.com/company/cluezy/" className="hover:cursor-pointer">
                                <SiLinkedin />
                            </Link>
                            <Link href="" className="hover:cursor-pointer">
                                <SiInstagram />
                            </Link>
                        </div>
                        <span className="text-xs mt-2">
                            © 2025 Cluezy. All rights reserved.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}