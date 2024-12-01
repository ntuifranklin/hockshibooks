

const INDEX_ROUTE_NAME = "books";
function booksRouteName() {
    return INDEX_ROUTE_NAME ;
} ;


const API_INDEX_ROUTE_NAME = "api";
function booksApiRouteName() {
    return API_INDEX_ROUTE_NAME ;
} ;

function generateSeoFriendlyTitle(bookTitle, authorName = '', publicationYear = '') {
    // Helper function to remove special characters and replace spaces with hyphens
    const formatString = (str) => {
      return str
        .toLowerCase() // Convert to lowercase
        .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters (except spaces and hyphens)
        .trim() // Remove leading/trailing spaces
        .replace(/\s+/g, '-') // Replace spaces with hyphens
    };
  
    // Format the book title
    let seoTitle = formatString(bookTitle);
  
    // If an author name is provided, format it and append it to the title
    if (authorName) {
      const seoAuthor = formatString(authorName);
      seoTitle += `-${seoAuthor}`;
    }
  
    // If a publication year is provided, append it to the title
    if (publicationYear) {
      seoTitle += `-${publicationYear}`;
    }
  
    // Combine with the base URL and return the full URL
    //const baseUrl = 'https://example.com/book/';
    return `${seoTitle}`;
  }
  
  /*
  // Example usage
  const bookTitle = 'The Catcher in the Rye';
  const authorName = 'J.D. Salinger';
  const publicationYear = '1951';
  
  const seoUrl = generateSeoFriendlyUrl(bookTitle, authorName, publicationYear);
  console.log(seoUrl); // Output: https://example.com/book/the-catcher-in-the-rye-jd-salinger-1951
  */
module.exports = {
    booksRouteName,
    booksApiRouteName,
    generateSeoFriendlyTitle
}