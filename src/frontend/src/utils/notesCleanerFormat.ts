import {
  getBulletPrefix,
  getCurrentBulletStyle,
} from "./notesCleanerBulletStyle";

/**
 * Detects standalone topic words followed by line breaks and converts them to formatted headings
 * with spacing above and below
 */
function applyAutoDetectHeadings(input: string): string {
  const lines = input.split("\n");
  const output: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (line.length === 0) {
      output.push("");
      continue;
    }

    // Check if this is a standalone topic word (1-5 words, no punctuation)
    const words = line.split(/\s+/).filter((w) => w.length > 0);
    const isStandaloneTopic =
      words.length >= 1 && words.length <= 5 && !line.match(/[.!?,;:]/);

    if (isStandaloneTopic) {
      // Add spacing before heading (unless it's the first line)
      if (i > 0 && output[output.length - 1] !== "") {
        output.push("");
      }

      // Convert to Title Case
      const heading = words
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");
      output.push(heading);

      // Add spacing after heading
      output.push("");
    } else {
      output.push(line);
    }
  }

  return output.join("\n");
}

/**
 * Converts patterns like "Definition:", "Process:", etc. into heading label format
 * with description on the next line prefixed with "- "
 */
function applyDefinitionStyle(input: string): string {
  const definitionKeywords = [
    "definition",
    "process",
    "importance",
    "examples",
    "types",
    "advantages",
    "disadvantages",
    "uses",
    "causes",
    "effects",
  ];

  const lines = input.split("\n");
  const output: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (line.length === 0) {
      output.push("");
      continue;
    }

    // Check if line matches pattern "Keyword:" or "keyword:"
    const lowerLine = line.toLowerCase();
    let matchedKeyword: string | null = null;

    for (const keyword of definitionKeywords) {
      if (lowerLine === `${keyword}:` || lowerLine === keyword) {
        matchedKeyword = keyword;
        break;
      }
      // Also check if line starts with keyword followed by colon and content
      if (lowerLine.startsWith(`${keyword}:`)) {
        matchedKeyword = keyword;
        break;
      }
    }

    if (matchedKeyword) {
      // Extract content after the keyword (if any)
      const keywordWithColon = `${matchedKeyword}:`;
      const contentAfterKeyword = line
        .substring(
          line.toLowerCase().indexOf(keywordWithColon) +
            keywordWithColon.length,
        )
        .trim();

      // Add heading label (capitalize first letter)
      const headingLabel = `${matchedKeyword.charAt(0).toUpperCase() + matchedKeyword.slice(1)}:`;
      output.push(headingLabel);

      // If there's content after the keyword, add it as a separate line
      if (contentAfterKeyword.length > 0) {
        output.push(contentAfterKeyword);
      }
    } else {
      output.push(line);
    }
  }

  return output.join("\n");
}

/**
 * Splits text into sentences based on punctuation boundaries
 * Each sentence becomes one line
 */
function splitIntoSentences(input: string): string {
  const lines = input.split("\n");
  const output: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines
    if (trimmed.length === 0) {
      output.push("");
      continue;
    }

    // Check if this line looks like a heading (ends with colon or is Title Case with no punctuation)
    const isHeading =
      trimmed.endsWith(":") ||
      (!trimmed.match(/[.!?]$/) &&
        trimmed
          .split(/\s+/)
          .every(
            (word) =>
              word.length > 0 &&
              word.charAt(0) === word.charAt(0).toUpperCase(),
          ));

    // Don't split headings
    if (isHeading) {
      output.push(trimmed);
      continue;
    }

    // Split by sentence-ending punctuation (., !, ?)
    // Use a regex that captures the punctuation with the sentence
    const sentences = trimmed
      .split(/(?<=[.!?])\s+/)
      .filter((s) => s.trim().length > 0);

    if (sentences.length > 1) {
      // Multiple sentences found - add each as a separate line
      for (const sentence of sentences) {
        output.push(sentence.trim());
      }
    } else {
      // Single sentence or no punctuation - keep as is
      output.push(trimmed);
    }
  }

  return output.join("\n");
}

/**
 * Ensures each processed line begins with bullet prefix
 */
function applyBulletPoints(input: string): string {
  const lines = input.split("\n");
  const output: string[] = [];
  const bulletPrefix = getBulletPrefix(getCurrentBulletStyle());

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines
    if (trimmed.length === 0) {
      output.push("");
      continue;
    }

    // Check if this line looks like a heading (ends with colon or is Title Case with no punctuation)
    const isHeading =
      trimmed.endsWith(":") ||
      (!trimmed.match(/[.!?]$/) &&
        trimmed
          .split(/\s+/)
          .every(
            (word) =>
              word.length > 0 &&
              word.charAt(0) === word.charAt(0).toUpperCase(),
          ));

    // Don't add bullets to headings
    if (isHeading) {
      output.push(trimmed);
      continue;
    }

    // Don't add bullet if line already starts with one
    if (trimmed.startsWith(bulletPrefix)) {
      output.push(trimmed);
      continue;
    }

    // Add bullet prefix
    output.push(bulletPrefix + trimmed);
  }

  return output.join("\n");
}

/**
 * Normalizes whitespace, capitalizes first letter, and ensures ending punctuation
 */
function normalizeLines(input: string): string {
  const lines = input.split("\n");
  const output: string[] = [];

  for (const line of lines) {
    let processed = line.trim();

    // Skip empty lines
    if (processed.length === 0) {
      output.push("");
      continue;
    }

    // Remove extra internal spaces
    processed = processed.replace(/\s+/g, " ");

    // Check if this is a heading (ends with colon or is Title Case)
    const isHeading =
      processed.endsWith(":") ||
      (!processed.match(/[.!?]$/) &&
        processed
          .split(/\s+/)
          .every(
            (word) =>
              word.length > 0 &&
              word.charAt(0) === word.charAt(0).toUpperCase(),
          ));

    // Don't modify headings
    if (isHeading) {
      output.push(processed);
      continue;
    }

    // Check if line starts with bullet prefix
    const bulletPrefix = getBulletPrefix(getCurrentBulletStyle());
    const hasBullet = processed.startsWith(bulletPrefix);
    let content = hasBullet
      ? processed.substring(bulletPrefix.length).trim()
      : processed;

    // Capitalize first letter of content
    if (content.length > 0) {
      content = content.charAt(0).toUpperCase() + content.slice(1);
    }

    // Ensure ending punctuation
    if (content.length > 0 && !content.match(/[.!?]$/)) {
      content += ".";
    }

    // Reconstruct line with bullet if it had one
    if (hasBullet) {
      output.push(bulletPrefix + content);
    } else {
      output.push(content);
    }
  }

  return output.join("\n");
}

/**
 * Removes excessive blank lines while maintaining section spacing
 */
function cleanupSpacing(input: string): string {
  const lines = input.split("\n");
  const output: string[] = [];
  let previousWasEmpty = false;

  for (const line of lines) {
    const isEmpty = line.trim().length === 0;

    // Skip consecutive empty lines (keep only one)
    if (isEmpty && previousWasEmpty) {
      continue;
    }

    output.push(line);
    previousWasEmpty = isEmpty;
  }

  // Remove leading and trailing empty lines
  while (output.length > 0 && output[0].trim().length === 0) {
    output.shift();
  }
  while (output.length > 0 && output[output.length - 1].trim().length === 0) {
    output.pop();
  }

  return output.join("\n");
}

/**
 * Main formatting function that applies all transformations in sequence
 *
 * Pipeline:
 * 1. Auto-detect headings (if enabled)
 * 2. Apply definition style formatting (if enabled)
 * 3. Split paragraphs into individual sentences
 * 4. Normalize lines (capitalization, punctuation)
 * 5. Apply bullet points (if enabled)
 * 6. Clean up spacing
 */
export function cleanAndFormatNotes(
  input: string,
  convertToBullets: boolean,
  convertToDefinitionStyle: boolean,
  autoDetectHeadings: boolean,
): string {
  if (!input.trim()) {
    return "";
  }

  let result = input;

  // Step 1: Auto-detect headings (if enabled)
  if (autoDetectHeadings) {
    result = applyAutoDetectHeadings(result);
  }

  // Step 2: Apply definition style formatting (if enabled)
  if (convertToDefinitionStyle) {
    result = applyDefinitionStyle(result);
  }

  // Step 3: Split paragraphs into individual sentences
  result = splitIntoSentences(result);

  // Step 4: Normalize lines (capitalization, punctuation)
  result = normalizeLines(result);

  // Step 5: Apply bullet points (if enabled)
  if (convertToBullets) {
    result = applyBulletPoints(result);
  }

  // Step 6: Clean up spacing
  result = cleanupSpacing(result);

  return result;
}
