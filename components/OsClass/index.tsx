"use client";

import { useEffect } from "react";

export const OsClass = () => {
    useEffect(() => {
        const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
        document.documentElement.classList.add(isMac ? "os-mac" : "os-win");
    }, []);

    return null;
};
