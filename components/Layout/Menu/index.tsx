"use client";

import { MobileMenuButton } from "../Header/MobileMenuButton";
import { Icon } from "@/components/Icon";
import {
    defaultNavigationItems,
    defaultSocialLinks,
    type NavigationItem,
    type SocialLink,
} from "../siteSettings";

export function Menu({
    items = defaultNavigationItems,
    socialLinks = defaultSocialLinks,
}: {
    items?: NavigationItem[];
    socialLinks?: SocialLink[];
}) {
    return (
        <nav className="main-menu" aria-label="Navegación principal">
            <MobileMenuButton />
            <div className="main-menu__cont">
                <ul className="main-menu__menu">
                    {items.map((item, index) => (
                        <li key={`${item.label}-${index}`}>
                            <a href={item.href}>{item.label}</a>
                        </li>
                    ))}
                </ul>

                <div className="main-menu__social">
                    {socialLinks.map((social) => (
                        <a
                            href={social.url}
                            aria-label={social.network}
                            key={social.network}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Icon icon={social.network} />
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
}
