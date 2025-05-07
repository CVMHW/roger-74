
/**
 * Functions for extracting and analyzing questions in text
 */

/**
 * Extract questions from text
 */
export const extractQuestions = (text: string): string[] => {
  // Split by question marks
  const parts = text.split('?');
  const questions: string[] = [];
  
  // Last part doesn't end with question mark
  for (let i = 0; i < parts.length - 1; i++) {
    // Find the start of the question (after previous ? or start of text)
    let startIndex = 0;
    if (i > 0) {
      startIndex = parts[i-1].lastIndexOf('.') + 1;
      if (startIndex === 0) startIndex = parts[i-1].lastIndexOf('!') + 1;
      if (startIndex === 0) startIndex = 0;
    }
    
    const question = parts[i].substr(startIndex).trim() + '?';
    if (question.length > 5) {  // Ignore very short questions
      questions.push(question);
    }
  }
  
  return questions;
};
