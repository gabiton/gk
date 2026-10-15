"use client";
// Icon.tsx
// React: https://react.dev/reference/react
// useEffect/useState: https://react.dev/reference/react/useState

"use client";

import { useState, useEffect } from "react";

export const Icon = ({
    icon,
    keepColors = false,
}: {
    icon: string;
    keepColors?: boolean;
}) => {
    const [svgContent, setSvgContent] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/icons/${icon}.svg`)
            .then((res) => {
                if (!res.ok) throw new Error(`Icon "${icon}" not found`);
                return res.text();
            })
            .then((text) => {
                if (!text.trim().startsWith("<svg"))
                    throw new Error(`Invalid SVG for "${icon}"`);

                const normalized = keepColors
                    ? text
                    : text
                          .replace(
                              /fill="(?!none)[^"]*"/g,
                              'fill="currentColor"',
                          )
                          .replace(
                              /stroke="(?!none)[^"]*"/g,
                              'stroke="currentColor"',
                          );
                setSvgContent(normalized);
            })
            .catch((err) => {
                console.warn(err.message);
                setSvgContent(null);
            });
    }, [icon]);

    if (!svgContent)
        return (
            <span style={{ display: "inline-block", width: 20, height: 20 }} />
        );

    return (
        <span
            className={`icon icon-${icon}`}
            dangerouslySetInnerHTML={{ __html: svgContent }}
        />
    );
};
