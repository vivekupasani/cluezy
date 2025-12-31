"use client"
import { useState } from 'react';

import { Button } from '@/components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactTab() {
    const [formData, setFormData] = useState({
        reason: 'select-reason',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (formData.reason === 'select-reason') {
            console.log('Please select a reason');
            return;
        }

        if (!formData.email || !formData.subject || !formData.message) {
            console.log('Please fill all required fields');
            return;
        }

        console.log('Form submitted:', {
            ...formData,
            timestamp: new Date().toISOString()
        });

        // Reset form after submission
        setFormData({
            reason: 'select-reason',
            email: '',
            subject: '',
            message: ''
        });

        // Show success message (you can replace this with a toast notification)
        alert('Thank you for your message! We will get back to you soon.');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Card className="w-full max-w-[600px] mx-auto rounded-xl bg-background border-0 shadow-none">
            <CardHeader className="text-center space-y-4">
                <CardTitle className="text-3xl font-bold txt-grad text-transparent">
                    Contact Us
                </CardTitle>
                <CardDescription className='text-muted-foreground text-base'>
                    You can contact us for any help, support, account recovery related requests or any business related discussions
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className='flex flex-col md:flex-row gap-4'>
                        <div className="grid gap-2 w-full">
                            <label htmlFor="reason" className="text-sm font-medium text-foreground">
                                Select Reason *
                            </label>
                            <select
                                id="reason"
                                name="reason"
                                className='border border-input bg-background h-10 px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
                                required
                                value={formData.reason}
                                onChange={handleChange}
                            >
                                <option value="select-reason">Select Reason</option>
                                <option value="payment">Payment</option>
                                <option value="model">Model Request</option>
                                <option value="feature">Feature Request</option>
                                <option value="bugs">Bugs</option>
                                <option value="feedback">Feedback</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="grid gap-2 w-full">
                            <label htmlFor="email" className="text-sm font-medium text-foreground">
                                Email Address *
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="subject" className="text-sm font-medium text-foreground">
                            Subject *
                        </label>
                        <Input
                            id="subject"
                            name="subject"
                            type="text"
                            placeholder="Reason for contacting"
                            required
                            value={formData.subject}
                            onChange={handleChange}
                            className="focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="message" className="text-sm font-medium text-foreground">
                            Message *
                        </label>
                        <Textarea
                            id="message"
                            name="message"
                            placeholder="I am writing this message to tell you that you built really cool product."
                            required
                            value={formData.message}
                            onChange={handleChange}
                            className="min-h-[120px] resize-vertical focus:ring-2 focus:ring-primary CustomScrollbar"
                            rows={6}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full text-primary-foreground font-medium py-2.5 transition-all duration-200"
                    >
                        Submit Message
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}