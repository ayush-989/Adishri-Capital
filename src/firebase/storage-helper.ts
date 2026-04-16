import ImageKit from "@imagekit/javascript";

const imagekit = new ImageKit({
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT,
});

const getAuthParams = async () => {
  const res = await fetch(import.meta.env.VITE_IMAGEKIT_AUTH_URL);
  return res.json();
};

export const uploadFile = async (file: File, path: string): Promise<string> => {
  const { token, expire, signature } = await getAuthParams();
  const result = await imagekit.upload({
    file,
    fileName: path.replace(/\//g, "_"),
    folder: "/kyc",
    token,
    expire,
    signature,
  });
  return result.url;
};
