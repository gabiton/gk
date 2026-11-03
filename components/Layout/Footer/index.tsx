import { Icon } from "@/components/Icon";
import {
    defaultNavigationItems,
    defaultSocialLinks,
    type NavigationItem,
    type SocialLink,
} from "../siteSettings";

export function Footer({
    menuItems = defaultNavigationItems,
    socialLinks = defaultSocialLinks,
}: {
    menuItems?: NavigationItem[];
    socialLinks?: SocialLink[];
}) {
    return (
        <footer className="footer">
            <div className="container">
                <Icon icon="logohero" />
                <div className="footer__col">
                    <ul>
                        {menuItems.map((item, index) => (
                            <li key={`${item.label}-${index}`}>
                                <a href={item.href}>{item.label}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="footer__col social">
                    {socialLinks.map((social) => (
                        <a
                            href={social.url}
                            key={social.network}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Icon icon={social.network} />
                            {social.handle || social.network}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
