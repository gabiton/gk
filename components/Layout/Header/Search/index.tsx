"use client";

import { useState, type FormEvent } from "react";

type SearchProps = {
  onSearch?: (query: string) => void;
  placeholder?: string;
};

/** Accessible search form; connect onSearch to the project's search provider. */
export function Search({ onSearch, placeholder = "Buscar" }: SearchProps) {
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch?.(query.trim());
  }

  return (
    <form className="header__search" role="search" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="site-search">Buscar en el sitio</label>
      <input
        id="site-search"
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button type="submit">Buscar</button>
    </form>
  );
}
