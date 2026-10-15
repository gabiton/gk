"use client";

import { useRef } from "react";
import type { Swiper as SwiperInstance } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const mockSlides = [
    {
        title: "Gobernar es estar y decidir",
        description:
            "No alcanza con conocer los problemas: hay que trabajar para resolverlos.",
        image: "https://placehold.co/1060x786?text=Lo+que+creo+1",
        href: "#",
    },
    {
        title: "Escuchar para transformar",
        description:
            "Las mejores respuestas se construyen cerca de cada comunidad.",
        image: "https://placehold.co/1060x786?text=Lo+que+creo+2",
        href: "#",
    },
    {
        title: "Un futuro con oportunidades",
        description:
            "Cada decisión puede abrir nuevos caminos para todas las personas.",
        image: "https://placehold.co/1060x786?text=Lo+que+creo+3",
        href: "#",
    },
];

type SlideItem = {
    title: string;
    description: string;
    image: string;
    href: string;
};

export function Block({
    title = "LO QUE CREO",
    viewAllHref = "#",
    slides = mockSlides,
}: {
    title?: string;
    viewAllHref?: string;
    slides?: SlideItem[];
}) {
    const swiperRef = useRef<SwiperInstance | null>(null);

    return (
        <section className="loQueCreo">
            <div className="container">
                <div className="loQueCreo__top">
                    <div className="loQueCreo__tag">{title}</div>
                    <a href={viewAllHref}>Ver todos</a>
                </div>

                <div className="loQueCreo__carousel">
                    <button
                        className="loQueCreo__navigation loQueCreo__navigation--prev"
                        type="button"
                        aria-label="Ver contenido anterior"
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
                        className="loQueCreo__swiper"
                        modules={[Pagination]}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        pagination={{
                            el: ".loQueCreo__pagination",
                            clickable: true,
                        }}
                        slidesPerView={1}
                        loop
                    >
                        {slides.map((slide) => (
                            <SwiperSlide key={slide.title}>
                                <article className="loQueCreo__item">
                                    <figure>
                                        <img src={slide.image} alt="" />
                                    </figure>
                                    <div className="loQueCreo__item__content">
                                        <h2>{slide.title}</h2>
                                        <p>{slide.description}</p>
                                        <div className="button__cont">
                                            <a
                                                href={slide.href}
                                                className="button"
                                            >
                                                <span>Ver más...</span>
                                            </a>
                                        </div>
                                    </div>
                                </article>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <button
                        className="loQueCreo__navigation loQueCreo__navigation--next"
                        type="button"
                        aria-label="Ver contenido siguiente"
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
                    <div className="loQueCreo__pagination" />
                </div>
            </div>
        </section>
    );
}
