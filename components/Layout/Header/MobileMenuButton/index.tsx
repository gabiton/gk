"use client";

export const MobileMenuButton = () => {
    const handleClick = () => {
        document.body.classList.toggle("menu-open");
    };

    return (
        <button className="mobilemenubutton" type="button" aria-label="Abrir menú" onClick={handleClick}>
            <span></span>
            <span></span>
            <span></span>
        </button>
    );
};
