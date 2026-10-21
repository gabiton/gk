import { Container } from "@/components/Layout/Container";

import { Form } from "./Form";

type BlockProps = {
    title?: string;
    backgroundVideo?: string;
    sliceType?: string;
    sliceVariation?: string;
};

export function Block({
    title = "HACER Y ESTAR",
    backgroundVideo = "/samplevideo.mp4",
    sliceType,
    sliceVariation,
}: BlockProps) {
    return (
        <section
            className="HomeForm"
            data-slice-type={sliceType}
            data-slice-variation={sliceVariation}
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
                <h2>{title}</h2>
                <Form />
            </Container>
        </section>
    );
}
