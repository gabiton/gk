import type { FC } from "react";
import { isFilled } from "@prismicio/client";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { Block } from "./Block";

export type HomeHeroProps = SliceComponentProps<Content.HomeHeroSlice>;

const HomeHero: FC<HomeHeroProps> = ({ slice }) => (
    <Block
        tagline={slice.primary.tagline || undefined}
        desktopImage={
            isFilled.image(slice.primary.desktop_image)
                ? slice.primary.desktop_image
                : undefined
        }
        mobileImage={
            isFilled.image(slice.primary.mobile_image)
                ? slice.primary.mobile_image
                : undefined
        }
        sliceType={slice.slice_type}
        sliceVariation={slice.variation}
    />
);

export default HomeHero;
