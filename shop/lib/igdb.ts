// IGDB serves every size from the same path; only the t_* segment changes.
export const igdbImage = (url: string, size: string) =>
  url.replace(/t_[a-z0-9_]+/, `t_${size}`);
