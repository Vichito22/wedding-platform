import { apiBaseUrl, apiUpload } from "@/app/utils/api";

export interface GiftImageUploadResponse {
  id: number;
  image_url: string;
}

export async function uploadGiftImage(
  file: File,
): Promise<GiftImageUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return apiUpload<GiftImageUploadResponse>("/admin/gifts/images", formData);
}

// image_url puede ser una ruta del backend ("/gifts/images/12") o un link
// externo de los regalos creados antes de que existiera la subida de archivos.
export function resolveGiftImageSrc(imageUrl: string): string {
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return `${apiBaseUrl}${imageUrl}`;
}
