import { getBulletPrefix, getCurrentBulletStyle } from './notesCleanerBulletStyle';

/**
 * Detects if input is a paragraph (continuous text block with multiple sentences and no manual line breaks)
 */
function isParagraph(input: string): boolean {
  const trimmed = input.trim();
  
  // Check if input contains manual line breaks
  if (trimmed.includes('\n')) {
    return false;
  }
  
  // Count sentence boundaries (., ?, !)
  const sentenceBoundaries = (trimmed.match(/[.!?]/g) || []).length;
  
  // Must have more than 1 sentence boundary to be considered a paragraph
  return sentenceBoundaries > 1;
}

/**
 * Splits paragraph into sentences based on sentence boundaries (., ?, !)
 * Removes empty fragments and normalizes whitespace
 */
function splitIntoSentences(paragraph: string): string[] {
  // Split on sentence boundaries while keeping the punctuation
  const parts = paragraph.split(/([.!?])/);
  
  const sentences: string[] = [];
  let currentSentence = '';
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    
    if (part.match(/[.!?]/)) {
      // This is punctuation, add it to current sentence
      currentSentence += part;
      
      // Trim and add to sentences if not empty
      const trimmed = currentSentence.trim();
      if (trimmed.length > 0) {
        sentences.push(trimmed);
      }
      
      currentSentence = '';
    } else {
      // This is text content
      currentSentence += part;
    }
  }
  
  // Add any remaining content (text without ending punctuation)
  const remaining = currentSentence.trim();
  if (remaining.length > 0) {
    sentences.push(remaining);
  }
  
  return sentences;
}

/**
 * Checks if input is eligible for Definition Style formatting
 * Eligible when: single line, 2-12 words, no ending punctuation, no sentence boundaries
 */
function isEligibleForDefinitionStyle(input: string): boolean {
  const trimmed = input.trim();
  
  // Must be a single line (no line breaks)
  if (trimmed.includes('\n')) {
    return false;
  }
  
  // Must not contain sentence boundary punctuation anywhere
  if (trimmed.match(/[.!?]/)) {
    return false;
  }
  
  // Count words
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  // Must have 2-12 words
  if (wordCount < 2 || wordCount > 12) {
    return false;
  }
  
  return true;
}

/**
 * Converts eligible input to Definition Style format
 * Format: "[Topic] is a/an [explanation]."
 */
function formatAsDefinition(input: string): string {
  const trimmed = input.trim();
  
  // Split into words
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  
  if (words.length < 2) {
    return trimmed;
  }
  
  // First word is the topic
  const topic = words[0];
  
  // Remaining words are the explanation
  const explanation = words.slice(1).join(' ');
  
  // Determine article (a/an) based on first letter of first explanation word
  const firstExplanationWord = words[1];
  const firstLetter = firstExplanationWord.charAt(0).toLowerCase();
  const article = ['a', 'e', 'i', 'o', 'u'].includes(firstLetter) ? 'an' : 'a';
  
  // Build definition sentence
  let definition = `${topic} is ${article} ${explanation}`;
  
  // Capitalize first letter
  definition = definition.charAt(0).toUpperCase() + definition.slice(1);
  
  // Ensure ending period
  if (!definition.endsWith('.')) {
    definition += '.';
  }
  
  return definition;
}

/**
 * Processes a single line: normalizes whitespace, capitalizes first letter, ensures ending punctuation
 */
function processLine(line: string): string {
  // Remove extra internal spaces (multiple spaces to single space)
  line = line.replace(/\s+/g, ' ').trim();
  
  if (line.length === 0) {
    return line;
  }
  
  // Capitalize first letter
  line = line.charAt(0).toUpperCase() + line.slice(1);
  
  // Ensure ending punctuation (., !, or ?)
  if (!line.match(/[.!?]$/)) {
    line += '.';
  }
  
  return line;
}

/**
 * Converts text to Title Case (capitalizes first letter of each word)
 */
function toTitleCase(text: string): string {
  return text
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Checks if a line matches the first-line main heading rule:
 * 1-5 words, no ending punctuation
 */
function isMainHeading(line: string): boolean {
  const trimmed = line.trim();
  
  // Must not end with punctuation
  if (trimmed.match(/[.!?,;:]$/)) {
    return false;
  }
  
  // Count words
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  
  // Must have 1-5 words
  return wordCount >= 1 && wordCount <= 5;
}

/**
 * Checks if a line starts with a keyword that should become a subheading
 */
function getSubheadingKeyword(line: string): string | null {
  const keywords = [
    'definition',
    'process',
    'types',
    'advantages',
    'disadvantages',
    'uses',
    'causes',
    'effects',
    'importance',
    'examples'
  ];
  
  const trimmed = line.trim().toLowerCase();
  
  for (const keyword of keywords) {
    if (trimmed.startsWith(keyword)) {
      return keyword;
    }
  }
  
  return null;
}

/**
 * Applies heading detection and structuring to the input
 * Returns structured content with main heading and subheadings
 */
function applyHeadingDetection(input: string): string {
  // Trim and normalize line breaks
  const trimmed = input.trim();
  const lines = trimmed.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  if (lines.length === 0) {
    return '';
  }
  
  const output: string[] = [];
  let mainHeadingDetected = false;
  
  // Check first line for main heading
  if (isMainHeading(lines[0])) {
    output.push(toTitleCase(lines[0]));
    output.push(''); // Blank line after main heading
    mainHeadingDetected = true;
  }
  
  // Process remaining lines (or all lines if no main heading)
  const startIndex = mainHeadingDetected ? 1 : 0;
  let currentSection: string[] = [];
  
  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    const keyword = getSubheadingKeyword(line);
    
    if (keyword) {
      // Flush current section if any
      if (currentSection.length > 0) {
        output.push(...currentSection);
        output.push(''); // Blank line between sections
        currentSection = [];
      }
      
      // Add subheading
      const subheading = toTitleCase(keyword) + ':';
      output.push(subheading);
      
      // Add content after keyword (if any)
      const contentAfterKeyword = line.substring(keyword.length).trim();
      if (contentAfterKeyword.length > 0) {
        // Remove leading colon, dash, or other separators
        const cleanContent = contentAfterKeyword.replace(/^[:\-–—]\s*/, '');
        if (cleanContent.length > 0) {
          currentSection.push(cleanContent);
        }
      }
    } else {
      // Regular content line
      currentSection.push(line);
    }
  }
  
  // Flush remaining section
  if (currentSection.length > 0) {
    output.push(...currentSection);
  }
  
  return output.join('\n');
}

/**
 * Cleans and formats notes with optional bullet point conversion, paragraph-to-points conversion, definition style conversion, and heading detection
 * 
 * Process flow (priority order):
 * 1. If autoDetectHeadings is enabled, detect and structure headings first
 * 2. If convertToDefinitionStyle is enabled and input is eligible (single short line), convert to definition format
 * 3. If convertParagraphToPoints is enabled and input is a paragraph, split into sentences
 * 4. Trim spaces
 * 5. Remove blank lines
 * 6. Normalize line breaks
 * 7. Capitalize first letter
 * 8. Ensure ending punctuation
 * 9. Add bullet prefix (if convertToBullets is enabled)
 * 
 * Priority: Headings Detect → Definition Style → Paragraph to Points → Bullet Formatting
 * 
 * @param input - Raw multi-line notes text or paragraph
 * @param convertToBullets - Whether to format as bullet points (default: true)
 * @param convertParagraphToPoints - Whether to split paragraphs into sentence points (default: false)
 * @param convertToDefinitionStyle - Whether to convert short lines to definition format (default: false)
 * @param autoDetectHeadings - Whether to detect and structure headings (default: false)
 * @returns Cleaned and formatted notes
 */
export function cleanAndFormatNotes(
  input: string, 
  convertToBullets: boolean = true,
  convertParagraphToPoints: boolean = false,
  convertToDefinitionStyle: boolean = false,
  autoDetectHeadings: boolean = false
): string {
  if (!input.trim()) {
    return '';
  }

  let workingText = input;
  let headingsApplied = false;
  
  // Priority 1: Heading Detection (if enabled)
  if (autoDetectHeadings) {
    workingText = applyHeadingDetection(workingText);
    headingsApplied = true;
  }

  let lines: string[];
  let definitionStyleApplied = false;

  // Priority 2: Definition Style (if enabled and eligible, and headings not applied)
  if (!headingsApplied && convertToDefinitionStyle && isEligibleForDefinitionStyle(workingText)) {
    const definitionLine = formatAsDefinition(workingText);
    lines = [definitionLine];
    definitionStyleApplied = true;
  }
  // Priority 3: Paragraph to Points (if enabled and detected)
  else if (!headingsApplied && convertParagraphToPoints && isParagraph(workingText)) {
    lines = splitIntoSentences(workingText);
  }
  // Standard line-based processing
  else {
    lines = workingText.split('\n');
  }
  
  const processedLines = lines
    // Trim each line
    .map(line => line.trim())
    // Remove blank lines (unless headings were applied - preserve structure)
    .filter((line, index, array) => {
      if (headingsApplied) {
        // Preserve blank lines for heading structure
        return true;
      }
      return line.length > 0;
    })
    // Process each line
    .map((line, index, array) => {
      // Preserve blank lines for heading structure
      if (headingsApplied && line.length === 0) {
        return '';
      }
      
      // If Definition Style was already applied, skip processLine (already formatted)
      if (!definitionStyleApplied && !headingsApplied) {
        // Process the line (normalize whitespace, capitalize, add punctuation)
        line = processLine(line);
      }
      
      // When headings are applied, don't add bullets to headings or blank lines
      if (headingsApplied) {
        // Check if this line is a heading (Title Case with no ending punctuation, or ends with colon)
        const isHeadingLine = line.length > 0 && (
          line.endsWith(':') || 
          (!line.match(/[.!?]$/) && line.split(/\s+/).every(word => 
            word.length > 0 && word.charAt(0) === word.charAt(0).toUpperCase()
          ))
        );
        
        if (isHeadingLine || line.length === 0) {
          return line;
        }
        
        // Process content lines under headings
        if (!line.match(/[.!?]$/)) {
          line = line.charAt(0).toUpperCase() + line.slice(1);
          line += '.';
        }
      }
      
      // Priority 4: Add bullet prefix if enabled (applied last, but not to headings)
      if (convertToBullets && line.length > 0) {
        // Don't add bullets to headings when heading detection is enabled
        if (headingsApplied) {
          const isHeadingLine = line.endsWith(':') || 
            (!line.match(/[.!?]$/) && line.split(/\s+/).every(word => 
              word.length > 0 && word.charAt(0) === word.charAt(0).toUpperCase()
            ));
          
          if (!isHeadingLine) {
            const bulletPrefix = getBulletPrefix(getCurrentBulletStyle());
            line = bulletPrefix + line;
          }
        } else {
          const bulletPrefix = getBulletPrefix(getCurrentBulletStyle());
          line = bulletPrefix + line;
        }
      }
      
      return line;
    });

  // Join with single newline
  return processedLines.join('\n');
}
