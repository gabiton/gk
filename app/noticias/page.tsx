import Link from "next/link";
import { isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";

import { Container } from "@/components/Layout/Container";
import { createClient } from "@/prismicio";

export default async function NoticiasArchive() {
    const client = createClient();
    const posts = await client.getAllByType("post", {
        orderings: {
            field: "document.first_publication_date",
            direction: "desc",
        },
    });

    return (
        <main className="postsArchive pageContent">
            <Container>
                <h1 className="postsArchive__title">Noticias</h1>
                {posts.length > 0 ? (
                    <div className="postsArchive__grid">
                        {posts.map((post) => {
                            const title = post.data.title || "Sin título";

                            return (
                                <article
                                    className="postsArchive__card"
                                    key={post.id}
                                >
                                    <Link
                                        className="postsArchive__card__link"
                                        href={`/noticias/${post.uid}`}
                                    >
                                        <figure className="postsArchive__card__image">
                                            {isFilled.image(
                                                post.data.featured_image,
                                            ) ? (
                                                <PrismicNextImage
                                                    field={
                                                        post.data.featured_image
                                                    }
                                                    alt=""
                                                    fill
                                                    sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                                                />
                                            ) : (
                                                <span aria-hidden="true" />
                                            )}
                                        </figure>
                                        <h2>{title}</h2>
                                        {post.data.excerpt && (
                                            <p>{post.data.excerpt}</p>
                                        )}
                                        <span className="postsArchive__card__readMore">
                                            Leer más
                                        </span>
                                    </Link>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <p className="postsArchive__empty">
                        Todavía no hay publicaciones.
                    </p>
                )}
            </Container>
        </main>
    );
}
