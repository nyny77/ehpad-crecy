import React from 'react';

interface SectionProps {
    children: React.ReactNode;
    className?: string;
    id?: string;
}

export default function Section({ children, className = "", id }: SectionProps) {
    return (
        <section id={id} className={`relative ${className}`}>
            {children}
        </section>
    );
}
