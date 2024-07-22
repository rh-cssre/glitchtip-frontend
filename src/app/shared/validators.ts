export const intRegex = new RegExp(/^[0-9]+$/);

export const slugRegex = new RegExp(/^[-a-zA-Z0-9_]+$/);

export const urlRegex = new RegExp(
  /^[A-Za-z][A-Za-z\d.+-]*:\/*(?:\w+(?::\w+)?@)?[^\s/]+(?::\d+)?(?:\/[\w#!:.?+=&%@\-/]*)?$/
);
