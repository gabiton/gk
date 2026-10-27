import { asLink, isFilled } from "@prismicio/client";
import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";

import { createClient } from "@/prismicio";

import { Block } from "./Block";

export type LoQueCreoProps = SliceComponentProps<Content.LoQueCreoSlice>;

const LoQueCreo = async ({ slice }: LoQueCreoProps) => {
    const postRelations = slice.primary.items
        .map((item) => item.post)
        .filter(isFilled.contentRelationship);

    const client = createClient();
    const posts = postRelations.length
        ? (
              await client.getByIDs<Content.PostDocument>(
                  postRelations.map((relation) => relation.id),
              )
          ).results
        : [];
    const postsById = new Map(posts.map((post) => [post.id, post]));

    const slides = postRelations.flatMap((relation) => {
        const post = postsById.get(relation.id);
        if (!post) return [];

        return [
            {
                title: post.data.title || "",
                description: post.data.excerpt || "",
                image: isFilled.image(post.data.featured_image)
                    ? post.data.featured_image.url
                    : "https://placehold.co/1060x786?text=Noticia",
                href: asLink(post) || `/noticias/${post.uid}`,
            },
        ];
    });

    return (
        <Block
            title={slice.primary.title || undefined}
            viewAllHref={
                isFilled.link(slice.primary.view_all_link)
                    ? (slice.primary.view_all_link.url ?? "#")
                    : "#"
            }
            slides={slides}
        />
    );
};

export default LoQueCreo;
