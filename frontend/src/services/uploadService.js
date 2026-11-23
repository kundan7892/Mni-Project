import { apiClient } from './api';

/**
 * Uploads files to the backend and returns [{ name, size, mimeType, url }].
 */
export async function uploadFiles(files) {
  const form = new FormData();
  Array.from(files).forEach((file) => form.append('files', file));
  const response = await apiClient.post('/uploads', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000
  });
  return response.data?.files || [];
}

export default { uploadFiles };
