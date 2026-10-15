import type { Metadata } from "next";
import "../scss/main.scss";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
export const metadata: Metadata = {
    title: {
        default: "Nombre del sitio",
        template: "%s | Nombre del sitio",
    },
    description: "",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Domine:wght@400..700&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <Header></Header>
                {children}
                <Footer></Footer>
            </body>
        </html>
    );
}
