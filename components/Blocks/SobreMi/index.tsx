"use client";

import { useEffect, useRef, useState } from "react";
import type { RichTextField } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import type { Swiper as SwiperInstance } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

type VideoItem = {
    id: number;
    videoUrl: string;
    title: string;
};

const mockSlides: VideoItem[] = Array.from({ length: 6 }, (_, index) => ({
    id: index + 1,
    videoUrl: "https://www.youtube.com/watch?v=oPX2FmM3nUY",
    title: "Título de maqueta " + (index + 1),
}));

function getYouTubeVideoId(videoUrl: string) {
    if (!videoUrl) return "oPX2FmM3nUY";

    const url = new URL(videoUrl);
    return (
        url.searchParams.get("v") ||
        url.pathname.split("/").filter(Boolean).pop() ||
        "oPX2FmM3nUY"
    );
}

function getYouTubeThumbnailUrl(videoUrl: string) {
    return (
        "https://img.youtube.com/vi/" +
        getYouTubeVideoId(videoUrl) +
        "/hqdefault.jpg"
    );
}

function getYouTubeEmbedUrl(videoUrl: string) {
    return (
        "https://www.youtube-nocookie.com/embed/" +
        getYouTubeVideoId(videoUrl) +
        "?autoplay=1&rel=0"
    );
}

export function SobreMi({
    title = "SOBRE MÍ",
    image = "/sobremi.jpg",
    text,
    videos = mockSlides,
}: {
    title?: string;
    image?: string;
    text?: RichTextField;
    videos?: VideoItem[];
}) {
    const swiperRef = useRef<SwiperInstance | null>(null);
    const [activeVideo, setActiveVideo] = useState<string | null>(null);

    useEffect(() => {
        if (!activeVideo) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setActiveVideo(null);
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [activeVideo]);

    return (
        <section className="SobreMi">
            <div className="container">
                <div className="SobreMi__top">
                    <div className="SobreMi__top__tag">{title}</div>
                </div>
                <div className="SobreMi__content">
                    <figure>
                        <img src={image} alt="" />
                    </figure>
                    <div className="SobreMi__content__text">
                        {text ? (
                            <PrismicRichText field={text} />
                        ) : (
                            <>
                                <p>
                                    Gabriel Katopodis es una persona de diálogo
                                    y trabajo que dice, hace y está. Una forma de
                                    hacer política comprometida con la gente. Es
                                    abogado, futbolero, familiero y peronista.
                                    Está casado con Nancy y es papá de Aylén y
                                    Santiago.
                                </p>
                                <p>
                                    Hoy se desempeña como ministro de
                                    Infraestructura y Servicios Públicos de la
                                    Provincia de Buenos Aires; ocupó el mismo
                                    cargo en Obras Públicas de la Nación y fue
                                    intendente del municipio de Gral. San
                                    Martín durante dos mandatos consecutivos.
                                </p>
                                <p>
                                    Su recorrido se construye todos los días,
                                    caminando la provincia, gestionando,
                                    escuchando y militando. Siempre cerca.
                                </p>
                                <p>
                                    <strong>
                                        Conocé su mirada y sus ideas sobre los
                                        temas que defiende.
                                    </strong>
                                </p>
                            </>
                        )}
                    </div>
                </div>

                <div className="SobreMi__slider">
                    <button
                        className="SobreMi__slider__navigation SobreMi__slider__navigation--prev"
                        type="button"
                        aria-label="Ver anteriores"
                        onClick={() => swiperRef.current?.slidePrev()}
                    >
                        <svg
                            width="11"
                            height="18"
                            viewBox="0 0 11 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1.5 1.5L8.651 8.65104L1.5 15.802"
                                stroke="currentColor"
                                stroke-width="3"
                                stroke-linecap="round"
                            />
                        </svg>
                    </button>
                    <Swiper
                        className="SobreMi__slider__swiper"
                        modules={[Pagination]}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        slidesPerView={3}
                        spaceBetween={24}
                        breakpoints={{
                            0: { slidesPerView: 1 },
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        pagination={{ clickable: true }}
                    >
                        {videos.map((slide) => (
                            <SwiperSlide key={slide.id}>
                                <article className="SobreMi__slider__item">
                                    <img
                                        src={getYouTubeThumbnailUrl(
                                            slide.videoUrl,
                                        )}
                                        alt=""
                                    />
                                    <button
                                        className="SobreMi__slider__play"
                                        type="button"
                                        aria-label={
                                            "Reproducir: " + slide.title
                                        }
                                        onClick={() => {
                                            if (slide.videoUrl)
                                                setActiveVideo(slide.videoUrl);
                                        }}
                                    >
                                        Reproducir
                                    </button>
                                </article>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <button
                        className="SobreMi__slider__navigation SobreMi__slider__navigation--next"
                        type="button"
                        aria-label="Ver siguientes"
                        onClick={() => swiperRef.current?.slideNext()}
                    >
                        <svg
                            width="11"
                            height="18"
                            viewBox="0 0 11 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1.5 1.5L8.651 8.65104L1.5 15.802"
                                stroke="currentColor"
                                stroke-width="3"
                                stroke-linecap="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {activeVideo && (
                <div
                    className="SobreMi__videoPopup"
                    onClick={(event) => {
                        if (event.target === event.currentTarget)
                            setActiveVideo(null);
                    }}
                >
                    <div
                        className="SobreMi__videoPopup__dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Reproductor de video"
                    >
                        <button
                            className="SobreMi__videoPopup__close"
                            type="button"
                            aria-label="Cerrar video"
                            onClick={() => setActiveVideo(null)}
                        >
                            ×
                        </button>
                        <div className="SobreMi__videoPopup__player">
                            <iframe
                                src={getYouTubeEmbedUrl(activeVideo)}
                                title="Video sobre mí"
                                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}