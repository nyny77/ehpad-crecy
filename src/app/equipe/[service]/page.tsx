import { SERVICES_EXTENDED } from "@/lib/services-data";
import ServiceDetailClient from "./ServiceDetailClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
    return SERVICES_EXTENDED.map((service) => ({
        service: service.id,
    }));
}

interface PageProps {
    params: Promise<{ service: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { service: serviceId } = await params;
    const service = SERVICES_EXTENDED.find((item) => item.id === serviceId);
    if (!service) return {};

    return {
        title: `${service.title} | Équipe de l’EHPAD de Crécy`,
        description: service.shortDescription,
        openGraph: {
            title: `${service.title} | EHPAD de Crécy`,
            description: service.shortDescription,
            images: [service.image],
        },
    };
}

export default async function ServiceDetailPage({ params }: PageProps) {
    const { service: serviceId } = await params;

    // Find the service data on the server
    const service = SERVICES_EXTENDED.find((s) => s.id === serviceId);

    if (!service) {
        notFound();
    }

    const currentIndex = SERVICES_EXTENDED.findIndex((s) => s.id === serviceId);
    const prevService = currentIndex > 0 ? SERVICES_EXTENDED[currentIndex - 1] : null;
    const nextService = currentIndex < SERVICES_EXTENDED.length - 1 ? SERVICES_EXTENDED[currentIndex + 1] : null;

    return (
        <ServiceDetailClient
            service={service}
            prevService={prevService}
            nextService={nextService}
        />
    );
}
