import fs from 'fs/promises';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractText(file) {
  const buffer = await fs.readFile(file.path);
  
  switch (file.mimetype) {
    case 'application/pdf':
      const pdfData = await pdf(buffer);
      return pdfData.text;
      
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      const { value } = await mammoth.extractRawText({ buffer });
      return value;
      
    case 'text/plain':
      return buffer.toString('utf8');
      
    case 'application/vnd.oasis.opendocument.text':
      // For ODT files, we use mammoth as well
      const { value: odtValue } = await mammoth.extractRawText({ buffer });
      return odtValue;
      
    default:
      throw new Error('Unsupported file type');
  }
}