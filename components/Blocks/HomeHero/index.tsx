import { Icon } from "@/components/Blocks/Icon";
import { Container } from "@/components/Layout/Container";

export const HomeHero = () => {
    return (
        <section className="HomeHero">
            <div className="HomeHero__bg desktop">
                <img src="/gk.jpg" alt="" />
            </div>
            <div className="HomeHero__bg mobile">
                <img src="/gk.jpg" alt="" />
            </div>

            <Container>
                <h1>
                    <Icon icon="logohero" keepColors={true} />
                    <span className="alt">Gabriel Katopodis</span>
                    dice, hace y está
                </h1>
            </Container>
        </section>
    );
};
