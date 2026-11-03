import type { Metadata } from "next";
import "../scss/main.scss";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { PrismicPreview } from "@prismicio/next";
import { createClient, repositoryName } from "@/prismicio";
import {
    defaultNavigationItems,
    defaultSocialLinks,
    mapSiteSettings,
} from "@/components/Layout/siteSettings";
export const metadata: Metadata = {
    title: {
        default: "Gabriel Katopodis",
        template: "%s | Gabriel Katopodis",
    },
    description: "",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    let siteSettings = {
        menuItems: defaultNavigationItems,
        socialLinks: defaultSocialLinks,
    };

    try {
        const settings = await createClient().getSingle("settings");
        siteSettings = mapSiteSettings(settings.data);
    } catch {
        // Use the local defaults until the Settings singleton is published.
    }

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
                <Header
                    menuItems={siteSettings.menuItems}
                    socialLinks={siteSettings.socialLinks}
                />
                {children}
                <Footer
                    menuItems={siteSettings.menuItems}
                    socialLinks={siteSettings.socialLinks}
                />
                <PrismicPreview repositoryName={repositoryName} />
            </body>
        </html>
    );
}
