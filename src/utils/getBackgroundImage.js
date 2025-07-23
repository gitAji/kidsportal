// src/utils/getBackgroundImage.js
export const getBackgroundImage = () => {
  const bgImages = ['bg1.jpeg', 'bg2.jpeg', 'bg3.jpeg', 'bg4.jpeg', 'bg5.jpeg'];
  const randomIndex = Math.floor(Math.random() * bgImages.length);
  return `/images/${bgImages[randomIndex]}`;
};
