import { ytThumb } from "@/lib/labels";

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function videoObject(v: { id: string; name: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: v.name,
    description: v.description,
    thumbnailUrl: [ytThumb(v.id), ytThumb(v.id, "hqdefault")],
    embedUrl: `https://www.youtube-nocookie.com/embed/${v.id}`,
    contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
    publisher: { "@type": "Organization", name: "be-front" },
  };
}
