export function capitalizeWords(str) {
  let words = str.split(' '); // Split the string into an array of words
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1); // Capitalize the first letter of each word
  }
  return words.join(' '); // Join the words back into a string
}
