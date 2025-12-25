export const cloudinaryUrl = (publicId, transform = "") => {
  if (!publicId) return "";
  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transform}${publicId}`;
};
