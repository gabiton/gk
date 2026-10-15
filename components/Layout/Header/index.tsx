import Link from "next/link";
import { Menu } from "../Menu";
import { Icon } from "@/components/Blocks/Icon";

export const Header = () => {
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
                        <a href="">
                            <Icon icon="facebook" />
                        </a>
                        <a href="">
                            <Icon icon="x" />
                        </a>
                        <a href="">
                            <Icon icon="instagram" />
                        </a>
                        <a href="">
                            <Icon icon="youtube" />
                        </a>
                        <a href="">
                            <Icon icon="tiktok" />
                        </a>
                    </div>
                    <Menu></Menu>
                </div>
            </div>
        </header>
    );
};
