"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Icon } from "../Icon";

const galleryItems = Array.from({ length: 8 }, (_, index) => ({
    id: `gallery-${index + 1}`,
    image: `https://placehold.co/540x708?text=Foto+${index + 1}`,
    comments: 15 + index,
    reposts: 8 + index,
}));

const videoItems = Array.from({ length: 8 }, (_, index) => ({
    id: `video-${index + 1}`,
    image: `https://placehold.co/836x524?text=Video+${index + 1}`,
    videoUrl: "https://www.youtube.com/watch?v=Ri-o4xi3zRk",
    channel: ["AMÉRICA TV", "CANAL 9", "TV PÚBLICA", "C5N"][index % 4],
    date: `${14 + index} de Agosto, 2025`,
}));

function getYouTubeEmbedUrl(videoUrl: string) {
    const url = new URL(videoUrl);
    const videoId =
        url.searchParams.get("v") ||
        url.pathname.split("/").filter(Boolean).pop();

    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
}

export function EnTodosLados({ kilometers = 174630 }: { kilometers?: number }) {
    const [activeVideo, setActiveVideo] = useState<string | null>(null);
    const [currentKilometers, setCurrentKilometers] = useState(kilometers);
    const kilometerDigits = currentKilometers.toLocaleString("es-AR");

    useEffect(() => {
        setCurrentKilometers(kilometers);
    }, [kilometers]);

    useEffect(() => {
        const interval = window.setInterval(() => {
            setCurrentKilometers((current) => current + 1);
        }, 2500);

        return () => window.clearInterval(interval);
    }, []);

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
        <section className="EnTodosLados">
            <div className="container">
                <h2>
                    <div
                        className="EnTodosLados__km"
                        aria-label={kilometerDigits}
                    >
                        <span className="EnTodosLados__km__srOnly">
                            {kilometerDigits}
                        </span>
                        <span aria-hidden="true">
                            {kilometerDigits
                                .split("")
                                .map((character, index) =>
                                    /\d/.test(character) ? (
                                        <span
                                            className="EnTodosLados__km__digit"
                                            key={index}
                                        >
                                            <span
                                                className="EnTodosLados__km__digit__strip"
                                                style={{
                                                    transform: `translateY(-${Number(character) * 10}%)`,
                                                    transitionDelay: `${index * 70}ms`,
                                                }}
                                            >
                                                {Array.from(
                                                    { length: 10 },
                                                    (_, digit) => (
                                                        <span key={digit}>
                                                            {digit}
                                                        </span>
                                                    ),
                                                )}
                                            </span>
                                        </span>
                                    ) : (
                                        <span
                                            className="EnTodosLados__km__dot"
                                            key={index}
                                        >
                                            {character}
                                        </span>
                                    ),
                                )}
                        </span>
                    </div>
                    km
                    <span className="line2">EN TODOS LADOS</span>
                </h2>

                <div className="EnTodosLados__grid">
                    {galleryItems.map((item) => (
                        <div className="EnTodosLados__item" key={item.id}>
                            <img
                                src={item.image}
                                alt={`Foto de maqueta ${item.id}`}
                            />
                            <div className="EnTodosLados__item__stats">
                                <div>
                                    <Icon icon="like" />
                                </div>
                                <div>
                                    <Icon icon="comment" />
                                    {item.comments}
                                </div>
                                <div>
                                    <Icon icon="repost" />
                                    {item.reposts}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="EnTodosLados__videos">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        navigation
                        pagination={{ clickable: true }}
                        slidesPerView={3}
                        spaceBetween={24}
                        breakpoints={{
                            0: { slidesPerView: 1 },
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                    >
                        {videoItems.map((item) => (
                            <SwiperSlide key={item.id}>
                                <article className="EnTodosLados__videos__item">
                                    <figure>
                                        <img
                                            src={item.image}
                                            alt={`Video de ${item.channel}`}
                                        />
                                        <button
                                            className="EnTodosLados__videos__play"
                                            type="button"
                                            aria-label={`Reproducir video de ${item.channel}`}
                                            onClick={() =>
                                                setActiveVideo(item.videoUrl)
                                            }
                                        >
                                            Reproducir
                                        </button>
                                    </figure>
                                    <div className="EnTodosLados__videos__item__content">
                                        <div className="EnTodosLados__videos__item__content__left">
                                            <h3>{item.channel}</h3>
                                            <div className="date">
                                                {item.date}
                                            </div>
                                        </div>
                                        <div
                                            className="EnTodosLados__videos__item__content__right"
                                            aria-hidden="true"
                                        >
                                            <img
                                                src={item.image}
                                                alt={`Video de ${item.channel}`}
                                            />
                                        </div>
                                    </div>
                                </article>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="hr"></div>

                <div className="EnTodosLados__tweets">
                    <div className="EnTodosLados__tweet">
                        <div className="EnTodosLados__tweet__top">
                            <div className="EnTodosLados__tweet__top__xlogo">
                                <Icon icon="x" />
                            </div>
                            <figure>
                                <img
                                    src="https://placehold.co/836x524"
                                    alt=""
                                />
                            </figure>
                            <div>
                                <strong>
                                    Gabriel Katopodis
                                    <Icon icon="verified" keepColors={true} />
                                </strong>
                                <span>@gkatopodis</span>
                            </div>
                        </div>
                        <div className="EnTodosLados__tweet__content">
                            <p>CASI 3 AÑOS SIN OBRA PÚBLICA</p>
                            <p>
                                Es muy grave por el estado de las rutas, por la
                                falta de infraestructura hídrica, porque
                                destruye empleo y, fundamentalmente, porque no
                                nos permite desarrollarnos.
                            </p>
                        </div>
                        <div className="EnTodosLados__tweet__meta">
                            <p>00:00 AM · Jan 0, 0000 · Twitter for iPhone</p>
                            <div className="EnTodosLados__tweet__meta__itesm">
                                <div className="EnTodosLados__tweet__meta__itesm__item">
                                    <strong>28</strong> Retweets
                                </div>
                                <div className="EnTodosLados__tweet__meta__itesm__item">
                                    <strong>28</strong> Quote tweets
                                </div>
                                <div className="EnTodosLados__tweet__meta__itesm__item">
                                    <strong>28</strong> Likes
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {activeVideo && (
                <div
                    className="EnTodosLados__videoPopup"
                    onClick={(event) => {
                        if (event.target === event.currentTarget)
                            setActiveVideo(null);
                    }}
                >
                    <div
                        className="EnTodosLados__videoPopup__dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Reproductor de video"
                    >
                        <button
                            className="EnTodosLados__videoPopup__close"
                            type="button"
                            aria-label="Cerrar video"
                            onClick={() => setActiveVideo(null)}
                        >
                            ×
                        </button>
                        <div className="EnTodosLados__videoPopup__player">
                            <iframe
                                src={getYouTubeEmbedUrl(activeVideo)}
                                title="Video de En todos lados"
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
