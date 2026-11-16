"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
type GalleryItem = {
    id: string;
    image: string;
    permalink: string;
    alt: string;
};

const mockVideoItems = Array.from({ length: 8 }, (_, index) => ({
    id: `video-${index + 1}`,
    image: `https://placehold.co/836x524?text=Video+${index + 1}`,
    videoUrl: "https://www.youtube.com/watch?v=oPX2FmM3nUY",
    channel: ["AMÉRICA TV", "CANAL 9", "TV PÚBLICA", "C5N"][index % 4],
    date: `${14 + index} de Agosto, 2025`,
    channelLogo: "/tv.png",
}));

type VideoItem = (typeof mockVideoItems)[number];

function getYouTubeEmbedUrl(videoUrl: string) {
    const url = new URL(videoUrl);
    const videoId =
        url.searchParams.get("v") ||
        url.pathname.split("/").filter(Boolean).pop();

    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
}

function getValidTweetUrl(rawUrl: string) {
    try {
        const url = new URL(rawUrl);
        const validHost = [
            "x.com",
            "www.x.com",
            "twitter.com",
            "www.twitter.com",
        ].includes(url.hostname.toLowerCase());
        const match = url.pathname.match(/^\/([^/]+)\/status\/(\d+)/);

        if (!validHost || !match) return null;
        return `https://x.com/${match[1]}/status/${match[2]}`;
    } catch {
        return null;
    }
}

function SliderArrow({
    direction,
    onClick,
}: {
    direction: "prev" | "next";
    onClick: () => void;
}) {
    const isPrevious = direction === "prev";

    return (
        <button
            className={`EnTodosLados__navigation EnTodosLados__navigation--${direction}`}
            type="button"
            aria-label={isPrevious ? "Ver anteriores" : "Ver siguientes"}
            onClick={onClick}
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
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            </svg>
        </button>
    );
}

export function Block({
    kilometers = 174630,
    title = "EN TODOS LADOS",
    photos = [],
    videos = mockVideoItems,
    tweets = [],
}: {
    kilometers?: number;
    title?: string;
    photos?: GalleryItem[];
    videos?: VideoItem[];
    tweets?: string[];
}) {
    const [activeVideo, setActiveVideo] = useState<string | null>(null);
    const [kilometerAnimationStarted, setKilometerAnimationStarted] =
        useState(false);
    const [kilometerDigitsVisible, setKilometerDigitsVisible] = useState(false);
    const kilometersRef = useRef<HTMLDivElement | null>(null);
    const videosSwiperRef = useRef<SwiperInstance | null>(null);
    const tweetsSwiperRef = useRef<SwiperInstance | null>(null);
    const kilometerDigits = kilometers.toLocaleString("es-AR");
    const tweetUrls = tweets
        .map(getValidTweetUrl)
        .filter((url): url is string => Boolean(url));
    const renderTweet = (url: string) => (
        <blockquote
            className="twitter-tweet"
            data-conversation="none"
            data-cards="hidden"
            data-dnt="true"
        >
            <a href={url}>Ver esta publicación en X</a>
        </blockquote>
    );

    useEffect(() => {
        const element = kilometersRef.current;
        if (!element || kilometerAnimationStarted) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                setKilometerAnimationStarted(true);
                observer.disconnect();
            },
            { threshold: 0.35 },
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [kilometerAnimationStarted]);

    useEffect(() => {
        if (!kilometerAnimationStarted) return;

        // Let the initial zero positions render before applying the target offsets.
        const frame = window.requestAnimationFrame(() => {
            setKilometerDigitsVisible(true);
        });

        return () => window.cancelAnimationFrame(frame);
    }, [kilometerAnimationStarted]);

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
        <section className="EnTodosLados" id="todos-lados">
            <div className="container">
                <h2>
                    <div
                        ref={kilometersRef}
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
                                                    transform: `translateY(-${kilometerDigitsVisible ? Number(character) * 10 : 0}%)`,
                                                    transitionDelay:
                                                        kilometerAnimationStarted
                                                            ? `${index * 100}ms`
                                                            : "0ms",
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
                    </div>{" "}
                    km
                    <span className="line2">{title}</span>
                </h2>

                <div className="EnTodosLados__grid">
                    {photos.map((item) => {
                        const image = <img src={item.image} alt={item.alt} />;

                        return item.permalink ? (
                            <a
                                className="EnTodosLados__item"
                                href={item.permalink}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`Ver foto: ${item.alt}`}
                                key={item.id}
                            >
                                {image}
                            </a>
                        ) : (
                            <div className="EnTodosLados__item" key={item.id}>
                                {image}
                            </div>
                        );
                    })}
                </div>

                <div className="EnTodosLados__videos" id="medios">
                    <SliderArrow
                        direction="prev"
                        onClick={() => videosSwiperRef.current?.slidePrev()}
                    />
                    <Swiper
                        modules={[Pagination]}
                        onSwiper={(swiper) => {
                            videosSwiperRef.current = swiper;
                        }}
                        pagination={{ clickable: true }}
                        slidesPerView={3}
                        spaceBetween={24}
                        breakpoints={{
                            0: { slidesPerView: 1 },
                            640: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                    >
                        {videos.map((item) => (
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
                                            onClick={() => {
                                                if (item.videoUrl)
                                                    setActiveVideo(
                                                        item.videoUrl,
                                                    );
                                            }}
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
                                                src={item.channelLogo}
                                                alt={`Video de ${item.channel}`}
                                            />
                                        </div>
                                    </div>
                                </article>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <SliderArrow
                        direction="next"
                        onClick={() => videosSwiperRef.current?.slideNext()}
                    />
                </div>

                <div className="hr"></div>

                <div
                    className={`EnTodosLados__tweets${
                        tweetUrls.length > 3
                            ? " EnTodosLados__tweets--slider"
                            : ""
                    }`}
                >
                    {tweetUrls.length > 3 ? (
                        <>
                            <SliderArrow
                                direction="prev"
                                onClick={() =>
                                    tweetsSwiperRef.current?.slidePrev()
                                }
                            />
                            <Swiper
                                modules={[Pagination]}
                                onSwiper={(swiper) => {
                                    tweetsSwiperRef.current = swiper;
                                }}
                                pagination={{ clickable: true }}
                                slidesPerView={3}
                                spaceBetween={24}
                                breakpoints={{
                                    0: { slidesPerView: 1 },
                                    640: { slidesPerView: 2 },
                                    1024: { slidesPerView: 3 },
                                }}
                            >
                                {tweetUrls.map((url) => (
                                    <SwiperSlide key={url}>
                                        {renderTweet(url)}
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <SliderArrow
                                direction="next"
                                onClick={() =>
                                    tweetsSwiperRef.current?.slideNext()
                                }
                            />
                        </>
                    ) : (
                        tweetUrls.map((url) => (
                            <div key={url}>{renderTweet(url)}</div>
                        ))
                    )}
                    {tweetUrls.length > 0 && (
                        <Script
                            src="https://platform.x.com/widgets.js"
                            strategy="lazyOnload"
                            onReady={() => {
                                const xWindow = window as Window & {
                                    twttr?: { widgets?: { load: () => void } };
                                };
                                xWindow.twttr?.widgets?.load();
                            }}
                        />
                    )}
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
