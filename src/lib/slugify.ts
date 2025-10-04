export const slugify = (text: string) => {
  return text
    .toLowerCase() // convert to lowercase
    .trim() // remove leading and trailing whitespace
    .replace(/ /g, "-") // replace spaces with hyphens
    .replace(/[^\w-]+/g, "") // remove special characters
    .replace(/^-+|-+$/g, ""); // remove leading and trailing hyphens
};
