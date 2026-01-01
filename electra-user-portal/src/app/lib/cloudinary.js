export const cloudinaryImage = (id, transform = "") =>
  `https://res.cloudinary.com/dqa3ov76r/image/upload/${transform}${id}`;

export const cloudinaryVideo = (id, transform = "") =>
  `https://res.cloudinary.com/dqa3ov76r/video/upload/${transform}${id}`;
