import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { filter, isFilled, type Content } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";

import { Container } from "@/components/Layout/Container";
import { createClient } from "@/prismicio";

type PostPageProps = {
    params: Promise<{ uid: string }>;
};

async function getPost(uid: string) {
    const client = createClient();

    try {
        return await client.getByUID("post", uid);
    } catch {
        notFound();
    }
}

export async function generateMetadata({
    params,
}: PostPageProps): Promise<Metadata> {
    const { uid } = await params;
    const post = await getPost(uid);

    return {
        title: post.data.meta_title || post.data.title || "Noticia",
        description: post.data.meta_description || post.data.excerpt || "",
        openGraph: isFilled.image(post.data.meta_image)
            ? { images: [post.data.meta_image.url] }
            : undefined,
    };
}

export async function generateStaticParams() {
    const client = createClient();
    const posts = await client.getAllByType("post");

    return posts.map((post) => ({ uid: post.uid }));
}

async function getRelatedPosts(post: Awaited<ReturnType<typeof getPost>>) {
    const client = createClient();
    const orderings = {
        field: "document.first_publication_date",
        direction: "desc" as const,
    };

    const taggedPosts = post.tags.length
        ? await client.getBySomeTags<Content.PostDocument>(post.tags, {
              filters: [
                  filter.at("document.type", "post"),
                  filter.not("document.id", post.id),
              ],
              pageSize: 10,
              orderings,
          })
        : { results: [] };

    const selected = [...taggedPosts.results];
    if (selected.length < 3) {
        const latestPosts = await client.getAllByType("post", { orderings });
        for (const candidate of latestPosts) {
            if (
                candidate.id !== post.id &&
                !selected.some((related) => related.id === candidate.id)
            ) {
                selected.push(candidate);
            }
            if (selected.length === 3) break;
        }
    }

    return selected.slice(0, 3);
}

export default async function PostPage({ params }: PostPageProps) {
    const { uid } = await params;
    const post = await getPost(uid);
    const relatedPosts = await getRelatedPosts(post);
    const title = post.data.title || "Sin título";

    return (
        <main className="postDetail pageContent">
            <Container>
                <article className="postDetail__article">
                    <Link className="postDetail__back" href="/noticias">
                        Volver a noticias
                    </Link>
                    <h1 className="postDetail__title">{title}</h1>
                    {post.data.excerpt && (
                        <p className="postDetail__excerpt">
                            {post.data.excerpt}
                        </p>
                    )}
                    {isFilled.image(post.data.featured_image) && (
                        <figure className="postDetail__image">
                            <PrismicNextImage
                                field={post.data.featured_image}
                                alt=""
                                fill
                                priority
                                sizes="(max-width: 900px) 100vw, 1244px"
                            />
                        </figure>
                    )}
                    {isFilled.richText(post.data.body) && (
                        <div className="postDetail__body">
                            <PrismicRichText field={post.data.body} />
                        </div>
                    )}
                </article>
                <section
                    className="postDetail__related"
                    aria-labelledby="related-posts-title"
                >
                    <h2 id="related-posts-title">Seguir leyendo</h2>
                    {relatedPosts.length > 0 ? (
                        <div className="postsArchive__grid">
                            {relatedPosts.map((relatedPost) => (
                                <article
                                    className="postsArchive__card"
                                    key={relatedPost.id}
                                >
                                    <Link
                                        className="postsArchive__card__link"
                                        href={`/noticias/${relatedPost.uid}`}
                                    >
                                        <figure className="postsArchive__card__image">
                                            {isFilled.image(
                                                relatedPost.data.featured_image,
                                            ) ? (
                                                <PrismicNextImage
                                                    field={
                                                        relatedPost.data
                                                            .featured_image
                                                    }
                                                    alt=""
                                                    fill
                                                    sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                                                />
                                            ) : (
                                                <span aria-hidden="true" />
                                            )}
                                        </figure>
                                        <h3>
                                            {relatedPost.data.title ||
                                                "Sin título"}
                                        </h3>
                                        {relatedPost.data.excerpt && (
                                            <p>{relatedPost.data.excerpt}</p>
                                        )}
                                        <span className="postsArchive__card__readMore">
                                            Leer más
                                        </span>
                                    </Link>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <p className="postsArchive__empty">
                            Todavía no hay otras publicaciones.
                        </p>
                    )}
                </section>
            </Container>
        </main>
    );
}
