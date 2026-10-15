import type { FC } from "react";
import { isFilled } from "@prismicio/client";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { Block } from "./Block";

export type EnTodosLadosProps = SliceComponentProps<Content.EnTodosLadosSlice>;

const EnTodosLados: FC<EnTodosLadosProps> = ({ slice }) => {
    const videos = slice.primary.videos.map((video, index) => ({
        id: `video-${index + 1}`,
        image: isFilled.image(video.image)
            ? video.image.url
            : `https://placehold.co/836x524?text=Video+${index + 1}`,
        videoUrl: isFilled.link(video.video_url)
            ? (video.video_url.url ?? "")
            : "",
        channel: video.title || "",
        date: video.date || "",
        channelLogo: isFilled.image(video.channel_logo)
            ? video.channel_logo.url
            : "/tv.png",
    }));

    return (
        <Block
            kilometers={slice.primary.kilometers ?? undefined}
            title={slice.primary.title || "EN TODOS LADOS"}
            videos={videos.length > 0 ? videos : undefined}
        />
    );
};

export default EnTodosLados;
