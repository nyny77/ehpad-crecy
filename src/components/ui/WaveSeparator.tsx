"use client";

interface WaveSeparatorProps {
    position?: "top" | "bottom";
    className?: string;
}

export default function WaveSeparator({ position = "top", className = "text-white" }: WaveSeparatorProps) {
    if (position === "top") {
        // Wave pointing UP - sits above the section, intrudes into previous section
        return (
            <div
                className={`absolute top-0 left-0 w-full z-10 pointer-events-none ${className}`}
                style={{ transform: 'translateY(-100%)' }}
            >
                <svg
                    className="w-full h-12 sm:h-16 md:h-20"
                    viewBox="0 0 1440 100"
                    preserveAspectRatio="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill="currentColor"
                        d="M0,100 L0,50 Q360,0 720,50 T1440,50 L1440,100 Z"
                    />
                </svg>
            </div>
        );
    }

    // Wave pointing DOWN - sits at bottom of section, creates curved bottom edge
    return (
        <div className={`absolute bottom-0 left-0 w-full z-10 pointer-events-none ${className}`}>
            <svg
                className="w-full h-12 sm:h-16 md:h-20"
                viewBox="0 0 1440 100"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill="currentColor"
                    d="M0,0 Q360,100 720,50 T1440,50 L1440,100 L0,100 Z"
                />
            </svg>
        </div>
    );
}
