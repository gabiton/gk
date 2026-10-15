import { SliceZone } from "@prismicio/react";

import { EnTodosLados } from "@/components/Blocks/EnTodosLados";
import { HomeForm } from "@/components/Blocks/HomeForm";
import { LoQueCreo } from "@/components/Blocks/loQueCreo";
import { SobreMi } from "@/components/Blocks/SobreMi";
import { createClient } from "@/prismicio";
import { components } from "@/slices";

export default async function Home() {
    const client = createClient();
    const homepage = await client.getSingle("homepage");
    const hasHomeFormSlice = homepage.data.slices.some(
        (slice) => slice.slice_type === "home_form",
    );

    return (
        <>
            <SliceZone slices={homepage.data.slices} components={components} />
        </>
    );
}
