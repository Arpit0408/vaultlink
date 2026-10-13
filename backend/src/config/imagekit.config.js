import ImageKit from "imagekit";

let imageKitInstance = null;

export const getImageKitClient = () => {
  if (imageKitInstance) return imageKitInstance;

  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    return null;
  }

  imageKitInstance = new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  });

  return imageKitInstance;
};
