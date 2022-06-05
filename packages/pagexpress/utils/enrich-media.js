export const enrichMedia = media => ({
  ...media,
  thumbnail: getThumbnail(media.url),
  proportions: media.width > media.height ? 'landscape' : 'portrait',
});

export const getThumbnail = mediaUrl => `${mediaUrl}?width=350`;
