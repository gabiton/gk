import type { FC } from "react";
import { asText, isFilled } from "@prismicio/client";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { Block } from "./Block";

export type LoQueCreoProps = SliceComponentProps<Content.LoQueCreoSlice>;

const LoQueCreo: FC<LoQueCreoProps> = ({ slice }) => {
    const slides = slice.primary.items.map((item, index) => ({
        title: item.title || "",
        description: asText(item.description),
        image: isFilled.image(item.image)
            ? item.image.url
            : `https://placehold.co/1060x786?text=Lo+que+creo+${index + 1}`,
        href: isFilled.link(item.link) ? (item.link.url ?? "#") : "#",
    }));

    return (
        <Block
            title={slice.primary.title || undefined}
            viewAllHref={
                isFilled.link(slice.primary.view_all_link)
                    ? (slice.primary.view_all_link.url ?? "#")
                    : "#"
            }
            slides={slides.length > 0 ? slides : undefined}
        />
    );
};

export default LoQueCreo;
