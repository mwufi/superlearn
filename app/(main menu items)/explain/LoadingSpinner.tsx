import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function LoadingSpinner() {
    return (
        <div className="flex items-center gap-2 text-muted-foreground">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
                <Sparkles className="h-4 w-4" />
            </motion.div>
            <span>Thinking of a fun explanation...</span>
        </div>
    )
}