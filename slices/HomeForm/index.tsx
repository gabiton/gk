import type { FC } from "react";
import { isFilled } from "@prismicio/client";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { Block } from "./Block";

export type HomeFormProps = SliceComponentProps<Content.HomeFormSlice>;

const HomeForm: FC<HomeFormProps> = ({ slice }) => (
    <Block
        title={slice.primary.title || undefined}
        backgroundVideo={
            isFilled.linkToMedia(slice.primary.background_video)
                ? (slice.primary.background_video.url ?? undefined)
                : undefined
        }
        sliceType={slice.slice_type}
        sliceVariation={slice.variation}
    />
);

export default HomeForm;
