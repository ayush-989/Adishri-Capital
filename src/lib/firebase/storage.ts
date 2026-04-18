const IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";

export const uploadFile = async (file: File, path: string): Promise<string> => {
 feature/admin-dashboard
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
  // jsbdbcbx sbbcdjbsb

  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", path.replace(/\//g, "_"));
  formData.append("publicKey", import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
  formData.append("folder", "/adishri");

  const privateKey = import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY;
  const encoded = btoa(`${privateKey}:`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(IMAGEKIT_UPLOAD_URL, {
      method: "POST",
      headers: { Authorization: `Basic ${encoded}` },
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error((errBody as any)?.message || `Upload failed (HTTP ${res.status})`);
    }

    const data = await res.json();
    if (!data?.url) throw new Error("ImageKit did not return a URL");
    return data.url as string;

  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") throw new Error("Upload timed out.");
    throw err;
  }
 main
};
