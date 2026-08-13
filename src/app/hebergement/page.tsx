import HebergementClient from "./HebergementClient";

export const metadata = {
    title: "Tarifs et Hébergement | EHPAD de Crécy",
    description: "Découvrez nos chambres simples et doubles, ainsi que nos tarifs d'hébergement et tarifs dépendance.",
};

export default function HebergementPage() {
    return (
        <main>
            <HebergementClient />
        </main>
    );
}
