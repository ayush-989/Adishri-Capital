const IMAGEKIT_UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";

export const uploadFile = async (file: File, path: string): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", path.replace(/\//g, "_"));
  formData.append("folder", "/kyc");
  formData.append("publicKey", import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);

  const res = await fetch(IMAGEKIT_UPLOAD_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY + ":")}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Image upload failed");
  const data = await res.json();
  return data.url;
};
