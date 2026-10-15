"use client";

import { useState } from "react";
import { MobileMenuButton } from "../Header/MobileMenuButton";
import { Icon } from "@/components/Blocks/Icon";

/** Site navigation. Supply project-specific links through `items`. */
export function Menu() {
    const [submenuOpen, setSubmenuOpen] = useState(false);

    return (
        <nav className="main-menu" aria-label="Navegación principal">
            <MobileMenuButton />
            <div className="main-menu__cont">
                <ul className="main-menu__menu">
                    <li>
                        <a href="">Inicio</a>
                    </li>
                    <li>
                        <a href="">Formá parte</a>
                    </li>
                    <li>
                        <a href="">En todos lados</a>
                    </li>
                    <li className={submenuOpen ? "open" : undefined}>
                        <a
                            href="#"
                            aria-expanded={submenuOpen}
                            onClick={(event) => {
                                event.preventDefault();
                                setSubmenuOpen((open) => !open);
                            }}
                        >
                            En esto creo
                        </a>
                        <ul>
                            <li>
                                <a href="">En esto creo</a>
                            </li>
                            <li>
                                <a href="">Estar y decidir</a>
                            </li>
                            <li>
                                <a href="">Distribución federal</a>
                            </li>
                            <li>
                                <a href="">Reactivar la economía</a>
                            </li>
                            <li>
                                <a href="">Es con Obra Pública</a>
                            </li>
                            <li>
                                <a href="">Vivir mejor, poder proyectar</a>
                            </li>
                            <li>
                                <a href="">La potencia de Buenos Aires</a>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <a href="">Sobre mi</a>
                    </li>
                </ul>

                <div className="main-menu__social">
                    <a href="">
                        <Icon icon="facebook" />
                    </a>
                    <a href="">
                        <Icon icon="x" />
                    </a>
                    <a href="">
                        <Icon icon="instagram" />
                    </a>
                    <a href="">
                        <Icon icon="youtube" />
                    </a>
                    <a href="">
                        <Icon icon="tiktok" />
                    </a>
                </div>
            </div>
        </nav>
    );
}
