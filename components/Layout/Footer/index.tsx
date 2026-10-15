import { Icon } from "@/components/Icon";

const blockClass = "footer";
export function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <Icon icon="logohero" />
                <div className="footer__col">
                    <p>
                        Lorem ipsum lorem <br /> ipsum lore lorem ipsum{" "}
                    </p>
                </div>
                <div className="footer__col social">
                    <a href="">
                        <Icon icon="facebook" />
                        @GKatopodis
                    </a>
                    <a href="">
                        <Icon icon="x" />
                        @GabrielKatopodis
                    </a>
                    <a href="">
                        <Icon icon="instagram" />
                        @GabrielKatopodis
                    </a>
                    <a href="">
                        <Icon icon="youtube" />
                        @Gabriel_katopodis
                    </a>
                    <a href="">
                        <Icon icon="tiktok" />
                        @GKatopodis
                    </a>
                </div>
            </div>
        </footer>
    );
}
