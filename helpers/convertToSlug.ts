import unidecode from 'unidecode';
export const  convertToSlug = (text: string): string => {
    const unidecodedText = unidecode(text); // Chuyển đổi ký tự có dấu sang không dấu
    const slug: string = unidecodedText.toLowerCase().trim().replace(/[\s\W-]+/g, '-'); // Thay thế khoảng trắng và ký tự đặc biệt bằng dấu gạch ngang
    return slug;
}
