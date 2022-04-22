export const enrichMedia = media => ({
  ...media,
  thumbnail: `${media.url}?width=350`,
  proportions: media.width > media.height ? 'landscape' : 'portrait',
});
