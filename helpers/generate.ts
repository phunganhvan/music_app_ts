// Loại ký tự dùng cho random string
const alphaNumericChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const numericChars = "0123456789";

export const generateRandomString = (length: number): string => {
    let result = "";

    for (let i = 0; i < length; i++) {
        result += alphaNumericChars.charAt(
            Math.floor(Math.random() * alphaNumericChars.length)
        );
    }

    return result;
};

export const generateRandomOtp = (length: number): string => {
    let result = "";

    for (let i = 0; i < length; i++) {
        result += numericChars.charAt(
            Math.floor(Math.random() * numericChars.length)
        );
    }

    return result;
};

// export const generateOrderCode = (length: number): string => {
//     const numericChars = "0123456789";

//     let result = "OD" + Date.now(); // prefix kèm timestamp

//     for (let i = 0; i < length; i++) {
//         result += numericChars.charAt(
//             Math.floor(Math.random() * numericChars.length)
//         );
//     }

//     return result;
// };
