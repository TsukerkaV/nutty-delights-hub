const MAX_SIDE = 256;
const JPEG_QUALITY = 0.82;

export function fileToAvatarDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Выберите изображение"));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Не удалось прочитать файл"));
    reader.onload = () => {
      const src = typeof reader.result === "string" ? reader.result : "";
      if (!src) {
        reject(new Error("Не удалось прочитать файл"));
        return;
      }
      const img = new Image();
      img.onerror = () => reject(new Error("Некорректное изображение"));
      img.onload = () => {
        const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Не удалось обработать фото"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}
