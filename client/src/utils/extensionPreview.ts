import imagePrev from '../assets/images/image-preview.png';
import excelPrev from '../assets/images/excel-preview.png';
import pdfPrev from '../assets/images/pdf-preview.png';
import docxPrev from '../assets/images/docx-preview.png';

export const imageFileTypes = ['JPG', 'JPEG', 'PNG', 'GIF'];

export const extensionPreview = (name: string | any) => {
  const getExtension = name?.split('.');
  if (!getExtension?.[1]) {
    return imagePrev;
  } else if (imageFileTypes?.includes(getExtension[1]?.toUpperCase())) {
    return imagePrev;
  } else if (getExtension[1]?.toLowerCase() === 'xlsx') {
    return excelPrev;
  } else if (getExtension[1]?.toLowerCase() === 'pdf') {
    return pdfPrev;
  } else if (
    getExtension[1]?.toLowerCase() === 'docx' ||
    getExtension[1]?.toLowerCase() === 'doc' ||
    getExtension[1]?.toLowerCase() === '.rtf'
  ) {
    return docxPrev;
  } else {
    return imagePrev;
  }
};
