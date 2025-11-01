'use client'

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog"
import { Button } from "./ui"
import { DialogHeader } from "./ui/dialog"


interface RateLimitDialogProps {
    rateLimitDialogOpen: boolean
    setRateLimitDialogOpen: (open: boolean) => void
    rateLimitMessage?: string
}

export const RateLimitDialog = ({
    rateLimitDialogOpen,
    setRateLimitDialogOpen,
    rateLimitMessage,
}: RateLimitDialogProps) => {
    return (
        <Dialog open={rateLimitDialogOpen} onOpenChange={setRateLimitDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Daily Limit Reached</DialogTitle>
                    <DialogDescription>
                        {rateLimitMessage ||
                            "You’ve reached the daily limit. Please log in for unlimited access."}
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setRateLimitDialogOpen(false)}>
                        Close
                    </Button>
                    <Button onClick={() => (window.location.href = '/login')}>
                        Login
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
