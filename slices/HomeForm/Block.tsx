import { Container } from "@/components/Layout/Container";

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
}