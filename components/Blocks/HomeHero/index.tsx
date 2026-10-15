import { Icon } from "@/components/Blocks/Icon";
import { Container } from "@/components/Layout/Container";

export const HomeHero = () => {
    return (
        <section className="HomeHero">
            <div className="HomeHero__bg">
                <img src="https://placeholders.io/400/300" alt="" />
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
