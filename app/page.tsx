import { EnTodosLados } from "@/components/Blocks/EnTodosLados";
import { HomeForm } from "@/components/Blocks/HomeForm";
import { HomeHero } from "@/components/Blocks/HomeHero";
import { LoQueCreo } from "@/components/Blocks/loQueCreo";
import { SobreMi } from "@/components/Blocks/SobreMi";

export default function Home() {
    return (
        <>
            <HomeHero />
            <HomeForm />
            <EnTodosLados />
            <LoQueCreo />
            <SobreMi />
        </>
    );
}
