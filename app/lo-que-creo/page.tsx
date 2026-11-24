import Link from "next/link";
import { isFilled, type Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";

import { Container } from "@/components/Layout/Container";
import { createClient } from "@/prismicio";

export default async function NoticiasArchive() {
    const client = createClient();
    const [homepage, allPosts] = await Promise.all([
        client.getSingle("homepage"),
        client.getAllByType("post", {
            orderings: {
                field: "document.first_publication_date",
                direction: "desc",
            },
        }),
    ]);
    const loQueCreoSlice = homepage.data.slices.find(
        (slice): slice is Content.LoQueCreoSlice =>
            slice.slice_type === "lo_que_creo",
    );
    const orderedPostIds =
        loQueCreoSlice?.primary.items
            .map((item) => item.post)
            .filter(isFilled.contentRelationship)
            .map((post) => post.id) ?? [];
    const postsById = new Map(allPosts.map((post) => [post.id, post]));
    const featuredPostIds = new Set(orderedPostIds);
    const featuredPosts = [...featuredPostIds].flatMap((id) => {
        const post = postsById.get(id);
        return post ? [post] : [];
    });
    const remainingPosts = allPosts.filter(
        (post) => !featuredPostIds.has(post.id),
    );
    const posts = [...featuredPosts, ...remainingPosts];

    return (
        <main className="postsArchive pageContent">
            <Container>
                <h1 className="postsArchive__title">Lo que creo</h1>
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
                                        href={`/lo-que-creo/${post.uid}`}
                                    ></Link>
                                    <figure className="postsArchive__card__image">
                                        {isFilled.image(
                                            post.data.featured_image,
                                        ) ? (
                                            <PrismicNextImage
                                                field={post.data.featured_image}
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
