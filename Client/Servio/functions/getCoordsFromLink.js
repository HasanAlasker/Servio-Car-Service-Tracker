export const getLatLngFromGoogleMapsLink = async (shortLink) => {
  try {
    // Step 1: Resolve the short URL
    const res = await fetch(shortLink, { redirect: "follow" });
    const fullUrl = res.url;

    // Step 2: Try @lat,lng format
    const atMatch = fullUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) {
      return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
    }

    // Step 3: Try !3d<lat>!4d<lng> format
    const dMatch = fullUrl.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (dMatch) {
      return { lat: parseFloat(dMatch[1]), lng: parseFloat(dMatch[2]) };
    }

    // Step 4: No coords in URL — fetch the HTML page and scrape them
    const pageRes = await fetch(fullUrl);
    const html = await pageRes.text();

    // Google embeds coords in a meta tag or script
    const metaMatch = html.match(/center=(-?\d+\.\d+)%2C(-?\d+\.\d+)/);
    if (metaMatch) {
      return { lat: parseFloat(metaMatch[1]), lng: parseFloat(metaMatch[2]) };
    }

    const scriptMatch = html.match(
      /"(-?\d{1,3}\.\d{7,})","(-?\d{1,3}\.\d{7,})"/,
    );
    if (scriptMatch) {
      return {
        lat: parseFloat(scriptMatch[1]),
        lng: parseFloat(scriptMatch[2]),
      };
    }

    console.warn("Could not extract coordinates from:", fullUrl);
    return null;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
};

export const getRatingAndCountFromGoogleMapsLink = async (shortLink) => {
  try {
    const res = await fetch(shortLink, { redirect: "follow" });
    const fullUrl = res.url;

    const pageRes = await fetch(fullUrl);
    const html = await pageRes.text();

    // Match "4.8" specifically — a single digit, dot, single digit
    // that appears next to a review count in parentheses
    // Pattern: 4.8(5) or 4.8 (5) as it appears in Google's HTML
    const combinedMatch = html.match(/([1-5]\.\d)\s*\((\d+)\)/);
    if (combinedMatch) {
      return {
        rating: parseFloat(combinedMatch[1]),
        reviewCount: parseInt(combinedMatch[2], 10),
      };
    }

    // Fallback: try to find them separately
    const ratingMatch = html.match(/\b([1-5]\.[0-9])\b(?=.*stars?|.*\(\d+\))/i);
    const countMatch = html.match(/\((\d{1,6})\)\s*(?:reviews?)?/i);

    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;
    const reviewCount = countMatch ? parseInt(countMatch[1], 10) : null;

    if (!rating && !reviewCount) {
      console.warn("Could not extract rating/count from:", fullUrl);
      return null;
    }

    return { rating, reviewCount };
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
};
