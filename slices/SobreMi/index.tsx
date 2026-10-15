import type { FC } from "react";
import { isFilled } from "@prismicio/client";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { SobreMi as SobreMiBlock } from "@/components/Blocks/SobreMi";

export type SobreMiProps = SliceComponentProps<Content.SobreMiSlice>;

const SobreMi: FC<SobreMiProps> = ({ slice }) => {
    const videos = slice.primary.videos.map((video, index) => ({
        id: index + 1,
        videoUrl: isFilled.link(video.youtube_url) ? video.youtube_url.url : "",
        title: video.title || `Video ${index + 1}`,
    }));

    return (
        <SobreMiBlock
            title={slice.primary.title || undefined}
            image={
                isFilled.image(slice.primary.image)
                    ? slice.primary.image.url
                    : undefined
            }
            text={
                isFilled.richText(slice.primary.text)
                    ? slice.primary.text
                    : undefined
            }
            videos={videos.length > 0 ? videos : undefined}
        />
    );
};

export default SobreMi;
