"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Icon } from "@/components/Icon";

const mockGalleryItems = Array.from({ length: 8 }, (_, index) => ({
    id: `gallery-${index + 1}`,
    image: `https://placehold.co/540x708?text=Foto+${index + 1}`,
    comments: 15 + index,
    permalink: "",
    alt: `Foto de maqueta ${index + 1}`,
}));

type GalleryItem = (typeof mockGalleryItems)[number];

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
        const validHost = ["x.com", "www.x.com", "twitter.com", "www.twitter.com"].includes(
            url.hostname.toLowerCase(),
        );
        const match = url.pathname.match(/^\/([^/]+)\/status\/(\d+)/);

        if (!validHost || !match) return null;
        return `https://x.com/${match[1]}/status/${match[2]}`;
    } catch {
        return null;
    }
}

export function Block({
    kilometers = 174630,
    title = "EN TODOS LADOS",
    videos = mockVideoItems,
    tweets = [],
}: {
    kilometers?: number;
    title?: string;
    videos?: VideoItem[];
    tweets?: string[];
}) {
    const [activeVideo, setActiveVideo] = useState<string | null>(null);
    const [currentKilometers, setCurrentKilometers] = useState(kilometers);
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(mockGalleryItems);
    const kilometerDigits = currentKilometers.toLocaleString("es-AR");
    const tweetUrls = tweets
        .map(getValidTweetUrl)
        .filter((url): url is string => Boolean(url));

    useEffect(() => {
        setCurrentKilometers(kilometers);
    }, [kilometers]);

    useEffect(() => {
        let cancelled = false;

        fetch("/api/instagram/media")
            .then((response) => {
                if (!response.ok) throw new Error("Instagram media is unavailable.");
                return response.json();
            })
            .then((result: {
                data?: Array<{
                    id: string;
                    caption?: string;
                    media_type?: string;
                    media_url?: string;
                    thumbnail_url?: string;
                    permalink?: string;
                    comments_count?: number;
                }>;
            }) => {
                if (cancelled || !result.data?.length) return;
                const items = result.data
                    .filter((item) => item.media_url || item.thumbnail_url)
                    .map((item) => ({
                        id: item.id,
                        image: item.media_type === "VIDEO"
                            ? item.thumbnail_url || item.media_url || ""
                            : item.media_url || item.thumbnail_url || "",
                        comments: item.comments_count ?? 0,
                        permalink: item.permalink || "",
                        alt: item.caption?.trim() || "Publicación de Instagram",
                    }));
                if (items.length) setGalleryItems(items);
            })
            .catch(() => {
                // Keep the local mock gallery visible until Instagram is connected.
            });

        return () => {
            cancelled = true;
        };
    }, []);

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
                    <span className="line2">{title}</span>
                </h2>

                <div className="EnTodosLados__grid">
                    {galleryItems.map((item) => (
                        <div className="EnTodosLados__item" key={item.id}>
                            {item.permalink ? (
                                <a href={item.permalink} target="_blank" rel="noreferrer">
                                    <img src={item.image} alt={item.alt} />
                                </a>
                            ) : (
                                <img src={item.image} alt={item.alt} />
                            )}
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
                </div>

                <div className="hr"></div>

                <div className="EnTodosLados__tweets">
                    {tweetUrls.map((url) => (
                        <blockquote
                            className="twitter-tweet"
                            data-conversation="none"
                            data-cards="hidden"
                            data-dnt="true"
                            key={url}
                        >
                            <a href={url}>Ver esta publicación en X</a>
                        </blockquote>
                    ))}
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
