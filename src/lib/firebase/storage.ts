/**
 * ImageKit file upload for browser (unsigned upload mode).
 *
 * SETUP REQUIRED (one-time):
 *  → ImageKit Dashboard → Settings → Upload → Enable "Unsigned uploads"
 *
 * Why unsigned: Private key cannot be safely used from the browser as it
 * would be exposed in the JS bundle. Unsigned uploads use only the publicKey.
 */

const IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";

export const uploadFile = async (file: File, path: string): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", path.replace(/\//g, "_"));
  formData.append("publicKey", import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
  // folder is optional — keeps files organized in ImageKit media library
  formData.append("folder", "/adishri");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const res = await fetch(IMAGEKIT_UPLOAD_URL, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const msg = (errBody as any)?.message || `Upload failed (HTTP ${res.status})`;
      throw new Error(msg);
    }

    const data = await res.json();
    if (!data?.url) throw new Error("ImageKit did not return a URL");
    return data.url as string;

  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") throw new Error("Upload timed out. Check your internet and try again.");
    throw err;
  }
};
