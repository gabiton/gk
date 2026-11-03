import Link from "next/link";
import { Menu } from "../Menu";
import { Icon } from "@/components/Icon";
import {
    defaultNavigationItems,
    defaultSocialLinks,
    type NavigationItem,
    type SocialLink,
} from "../siteSettings";

export const Header = ({
    menuItems = defaultNavigationItems,
    socialLinks = defaultSocialLinks,
}: {
    menuItems?: NavigationItem[];
    socialLinks?: SocialLink[];
}) => {
    return (
        <header className="header">
            <div className="container">
                <div className="header__left">
                    <Link className="header__left__logo" href="/">
                        <Icon icon="logo" />
                    </Link>
                </div>

                <div className="header__right">
                    <div className="header__social">
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
                    <Menu items={menuItems} socialLinks={socialLinks} />
                </div>
            </div>
        </header>
    );
};
