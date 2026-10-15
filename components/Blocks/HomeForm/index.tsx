import { Icon } from "@/components/Blocks/Icon";
import { Container } from "@/components/Layout/Container";

export const HomeForm = () => {
    return (
        <section className="HomeForm">
            <div className="HomeForm__bg">
                <video
                    src="/samplevideo.mp4"
                    autoPlay
                    muted
                    playsInline
                ></video>
            </div>

            <Container>
                <h2>HACER Y ESTAR</h2>
                <form action="">
                    <div className="field">
                        <input type="text" placeholder="Nombre" />
                    </div>
                    <div className="field">
                        <input type="text" placeholder="Correo electrónico " />
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
