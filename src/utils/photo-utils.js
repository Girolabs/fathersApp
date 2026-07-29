export const buildPhotoUrl = (photo, version) =>
  photo ? `https://schoenstatt-fathers.link${photo}${version ? `?v=${version}` : ''}` : null;
