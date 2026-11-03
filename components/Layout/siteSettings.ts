import { isFilled } from "@prismicio/client";
import type { Content } from "@prismicio/client";

export type SocialNetwork = "facebook" | "x" | "instagram" | "youtube" | "tiktok";

export type NavigationItem = {
    label: string;
    href: string;
};

export type SocialLink = {
    network: SocialNetwork;
    url: string;
    handle: string;
};

export const defaultNavigationItems: NavigationItem[] = [
    { label: "Inicio", href: "/" },
    { label: "Formá parte", href: "#" },
    { label: "En todos lados", href: "#" },
    { label: "En esto creo", href: "#" },
    { label: "Sobre mí", href: "#" },
];

export const defaultSocialLinks: SocialLink[] = [
    { network: "facebook", url: "#", handle: "@GKatopodis" },
    { network: "x", url: "#", handle: "@GabrielKatopodis" },
    { network: "instagram", url: "#", handle: "@GabrielKatopodis" },
    { network: "youtube", url: "#", handle: "@Gabriel_katopodis" },
    { network: "tiktok", url: "#", handle: "@GKatopodis" },
];

const socialNetworks: SocialNetwork[] = [
    "facebook",
    "x",
    "instagram",
    "youtube",
    "tiktok",
];

export function mapSiteSettings(data: Content.SettingsDocument["data"]) {
    const menuItems = data.menu_items
        .filter((item) => item.label)
        .map((item) => ({
            label: item.label || "",
            href: isFilled.link(item.link) ? item.link.url || "#" : "#",
        }));

    const socialLinks = data.social_links.flatMap((item) => {
        const network = item.network;
        if (
            !network ||
            !socialNetworks.includes(network as SocialNetwork) ||
            !isFilled.link(item.url)
        ) {
            return [];
        }

        return [
            {
                network: network as SocialNetwork,
                url: item.url.url || "#",
                handle: item.handle || "",
            },
        ];
    });

    return {
        menuItems: menuItems.length ? menuItems : defaultNavigationItems,
        socialLinks: socialLinks.length ? socialLinks : defaultSocialLinks,
    };
}
