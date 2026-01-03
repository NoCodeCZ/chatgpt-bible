/**
 * Returns the prompt text as-is without modification.
 * The full prompt template including placeholders is preserved.
 *
 * @param promptText - The raw prompt text from the database
 * @returns The unchanged prompt text
 */
export function getPromptText(promptText: string): string {
  return promptText || '';
}
