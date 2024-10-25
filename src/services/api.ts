import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export async function analyzeDocument(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await axios.post(`${API_URL}/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Error analyzing document');
    }
    throw error;
  }
}