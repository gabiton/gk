import type { FC } from "react";
import { isFilled } from "@prismicio/client";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { Container } from "@/components/Layout/Container";

export type HomeFormProps = SliceComponentProps<Content.HomeFormSlice>;

const HomeForm: FC<HomeFormProps> = ({ slice }) => {
    const backgroundVideo = isFilled.linkToMedia(slice.primary.background_video)
        ? slice.primary.background_video.url
        : "/samplevideo.mp4";

    return (
        <section
            className="HomeForm"
            data-slice-type={slice.slice_type}
            data-slice-variation={slice.variation}
        >
            <div className="HomeForm__bg">
                <video
                    src={backgroundVideo}
                    autoPlay
                    muted
                    playsInline
                    loop
                />
            </div>

            <Container>
                <h2>{slice.primary.title || "HACER Y ESTAR"}</h2>
                <form action="">
                    <div className="field">
                        <input type="text" placeholder="Nombre" />
                    </div>
                    <div className="field">
                        <input type="text" placeholder="Correo electrónico" />
                    </div>
                    <div className="field">
                        <input type="text" placeholder="Celular" />
                    </div>
                    <div className="field">
                        <input type="text" placeholder="Municipio" />
                    </div>
                    <div className="submit">
                        <button type="submit">Quiero ser parte</button>
                    </div>
                </form>
            </Container>
        </section>
    );
};

export default HomeForm;
