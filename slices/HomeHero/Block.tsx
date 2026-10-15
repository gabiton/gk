import { isFilled } from "@prismicio/client";
import type { Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";

import { Icon } from "@/components/Icon";
import { Container } from "@/components/Layout/Container";

type BlockProps = {
    tagline?: string;
    desktopImage?: Content.HomeHeroSlice["primary"]["desktop_image"];
    mobileImage?: Content.HomeHeroSlice["primary"]["mobile_image"];
    sliceType?: string;
    sliceVariation?: string;
};

export function Block({
    tagline = "dice, hace y está",
    desktopImage,
    mobileImage,
    sliceType,
    sliceVariation,
}: BlockProps) {
    return (
        <section
            className="HomeHero"
            data-slice-type={sliceType}
            data-slice-variation={sliceVariation}
        >
            <div className="HomeHero__bg desktop">
                {desktopImage && isFilled.image(desktopImage) ? (
                    <PrismicNextImage
                        field={desktopImage}
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
                {mobileImage && isFilled.image(mobileImage) ? (
                    <PrismicNextImage
                        field={mobileImage}
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
                    {tagline}
                </h1>
            </Container>
        </section>
    );
}