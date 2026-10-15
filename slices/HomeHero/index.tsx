import type { FC } from "react";
import { isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { Icon } from "@/components/Blocks/Icon";
import { Container } from "@/components/Layout/Container";

export type HomeHeroProps = SliceComponentProps<Content.HomeHeroSlice>;

const HomeHero: FC<HomeHeroProps> = ({ slice }) => (
    <section
        className="HomeHero"
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
    >
        <div className="HomeHero__bg desktop">
            {isFilled.image(slice.primary.desktop_image) ? (
                <PrismicNextImage
                    field={slice.primary.desktop_image}
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                />
            ) : (
                <img src="/gk.jpg" alt="" />
            )}
        </div>
        <div className="HomeHero__bg mobile">
            {isFilled.image(slice.primary.mobile_image) ? (
                <PrismicNextImage
                    field={slice.primary.mobile_image}
                    alt=""
                    fill
                    priority
                    sizes="100vw"
                />
            ) : (
                <img src="/gk.jpg" alt="" />
            )}
        </div>

        <Container>
            <h1>
                <Icon icon="logohero" keepColors />
                <span className="alt">Gabriel Katopodis</span>
                {slice.primary.tagline || "dice, hace y está"}
            </h1>
        </Container>
    </section>
);

export default HomeHero;
