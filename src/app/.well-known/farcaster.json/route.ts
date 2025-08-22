function withValidProperties(
  properties: Record<string, undefined | string | string[] | boolean>
) {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) =>
      Array.isArray(value)
        ? value.length > 0
        : value !== undefined && value !== null && value !== ""
    )
  );
}

export async function GET() {
  const URL =
    process.env.NEXT_PUBLIC_URL || "https://hypeya-miniapp.vercel.app";
  return Response.json({
    accountAssociation: {
      header: process.env.FARCASTER_HEADER || "",
      payload: process.env.FARCASTER_PAYLOAD || "",
      signature: process.env.FARCASTER_SIGNATURE || "",
    },
    frame: withValidProperties({
      version: "1",
      name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "HYPEYA",
      subtitle:
        process.env.NEXT_PUBLIC_APP_SUBTITLE || "Tendencias virales y memes",
      description:
        process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
        "¡Descubre lo más viral y actual en ¡HYPEYA!: memes, tendencias y cultura web fresca para que siempre estés a la vanguardia.",
      imageUrl:
        process.env.NEXT_PUBLIC_APP_OG_IMAGE || `${URL}/images/hypeya-hero.png`,
      screenshotUrls: [],
      iconUrl:
        process.env.NEXT_PUBLIC_APP_ICON || `${URL}/images/hypeya-logo.png`,
      splashImageUrl:
        process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE ||
        `${URL}/images/hypeya-hero.png`,
      splashBackgroundColor:
        process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || "#000000",
      homeUrl: URL,
      webhookUrl: `${URL}/api/webhook`,
      primaryCategory:
        process.env.NEXT_PUBLIC_APP_PRIMARY_CATEGORY || "news-media",
      tags: [],
      heroImageUrl:
        process.env.NEXT_PUBLIC_APP_HERO_IMAGE ||
        `${URL}/images/hypeya-logo.png`,
      tagline:
        process.env.NEXT_PUBLIC_APP_TAGLINE || "Tendencias virales y memes",
      ogTitle:
        process.env.NEXT_PUBLIC_APP_OG_TITLE || "HYPEYA - Tendencias virales",
      ogDescription:
        process.env.NEXT_PUBLIC_APP_OG_DESCRIPTION ||
        "Descubre lo más viral en HYPEYA: memes, tendencias y cultura web fresca.",
      ogImageUrl:
        process.env.NEXT_PUBLIC_APP_OG_IMAGE || `${URL}/images/hypeya-logo.png`,
      // use only while testing
      noindex: true,
    }),
  });
}
