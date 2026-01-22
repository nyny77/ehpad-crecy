import { SERVICES_EXTENDED } from "@/lib/services-data";
import ServiceDetailClient from "./ServiceDetailClient";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    return SERVICES_EXTENDED.map((service) => ({
        service: service.id,
    }));
}

interface PageProps {
    params: Promise<{ service: string }>;
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
