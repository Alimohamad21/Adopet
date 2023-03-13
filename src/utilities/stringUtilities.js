export function capitalizeWords(str) {
    let words = str.split(' '); // Split the string into an array of words
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1); // Capitalize the first letter of each word
    }
    return words.join(' '); // Join the words back into a string
}

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};
export const validatePhoneNumber = (phoneNumber) => {
    const cleanedPhoneNumber = phoneNumber.replace(/[+]/g, '');
    const phoneNumberPattern = /^\d{12}$/;  // regular expression to match a 10-digit phone number
    return phoneNumberPattern.test(cleanedPhoneNumber);
};
export const validatePassword = (password) => {
    return password.length >= 6;
};
export const validateConfirmPassword = (password, confirmPassword) => {
    return password === confirmPassword;
};

export function extractSubstringAfterDelimiter(string, delimiter) {
    const delimiterIndex = string.indexOf(delimiter);
    if (delimiterIndex !== -1) {
        return string.substring(delimiterIndex + delimiter.length);
    }
    return null;
}

export function removeSpacesFromString(str) {
    return str.replace(/\s/g, '');
}

