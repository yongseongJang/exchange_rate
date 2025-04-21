export const convertLanguage = (language: string) => {
  switch (language) {
    case "ko":
      return "korean";
    case "en":
      return "english";
    case "cn":
      return "chinese";
    case "jp":
      return "japanese";
  }
};
