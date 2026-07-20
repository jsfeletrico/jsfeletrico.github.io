import { useEffect } from "react";

type SeoProps = {
  title: string;
  description: string;
  url: string;
  image?: string;
};

const OG_IMAGE_PADRAO = "https://jsfeletrico.com/manus-storage/og_image_0ee5027e.jpg";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Atualiza o título da aba e as meta tags de compartilhamento (Open Graph /
 * Twitter Card) conforme a página atual. Como o site é uma SPA, as tags do
 * index.html servem de padrão e este hook as sobrescreve por rota.
 */
export function useSeo({ title, description, url, image = OG_IMAGE_PADRAO }: SeoProps) {
  useEffect(() => {
    document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", image);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);
  }, [title, description, url, image]);
}
