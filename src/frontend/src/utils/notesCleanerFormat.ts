import { getBulletPrefix, getCurrentBulletStyle } from './notesCleanerBulletStyle';

/**
 * Detects standalone topic words followed by line breaks and converts them to formatted headings
 * with spacing above and below
 */
function applyAutoDetectHeadings(input: string): string {
  const lines = input.split('\n');
  const output: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (line.length === 0) {
      output.push('');
      continue;
    }
    
    // Check if this is a standalone topic word (1-5 words, no punctuation)
    const words = line.split(/\s+/).filter(w => w.length > 0);
    const isStandaloneTopic = words.length >= 1 && words.length <= 5 && !line.match(/[.!?,;:]/);
    
    if (isStandaloneTopic) {
      // Add spacing before heading (unless it's the first line)
      if (i > 0 && output[output.length - 1] !== '') {
        output.push('');
      }
      
      // Convert to Title Case
      const heading = words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      output.push(heading);
      
      // Add spacing after heading
      output.push('');
    } else {
      output.push(line);
    }
  }
  
  return output.join('\n');
}

/**
 * SMART SEMANTIC SPLITTING ENGINE
 * 
 * Core principles:
 * 1. Protect scientific compound terms (e.g., "carbon dioxide and water")
 * 2. Preserve complete sentences with subject + verb + descriptive clause
 * 3. Only split sequential standalone technical phrases WITHOUT conjunctions
 * 4. Prevent single-word bullets, conjunction-led bullets, modifier-separated bullets
 * 5. Prioritize meaning preservation over formatting
 */

/**
 * Detects if text contains a scientific or technical compound term that should NOT be split
 * Examples: "carbon dioxide and water", "low solute concentration and high solute concentration"
 */
function isProtectedCompoundTerm(text: string): boolean {
  const lowerText = text.toLowerCase().trim();
  
  // Pattern 1: Chemical compounds with "and" (e.g., "carbon dioxide and water")
  if (/\b(carbon|nitrogen|oxygen|hydrogen|sodium|chloride|dioxide|monoxide)\b.*\band\b.*\b(carbon|nitrogen|oxygen|hydrogen|sodium|chloride|dioxide|monoxide|water)\b/i.test(lowerText)) {
    return true;
  }
  
  // Pattern 2: Scientific descriptive phrases with modifiers and "and"
  // (e.g., "low solute concentration and high solute concentration")
  if (/\b(low|high|semi|permeable|solute|concentration|membrane)\b.*\band\b.*\b(low|high|semi|permeable|solute|concentration|membrane)\b/i.test(lowerText)) {
    return true;
  }
  
  // Pattern 3: Compound technical terms with dependent modifiers
  if (/\b(semi\s+permeable|low\s+solute|high\s+solute|cell\s+membrane|cell\s+wall)\b/i.test(lowerText)) {
    return true;
  }
  
  // Pattern 4: Short phrases with "and" connecting two closely related terms (likely compound)
  const words = lowerText.split(/\s+/);
  if (words.length <= 6 && /\band\b/.test(lowerText)) {
    // If it's a short phrase with "and", likely a compound term
    return true;
  }
  
  return false;
}

/**
 * Checks if text is a complete sentence with subject + verb + descriptive clause
 */
function isCompleteSentence(text: string): boolean {
  const trimmed = text.trim();
  const words = trimmed.split(/\s+/);
  
  // Complete sentences are typically longer (8+ words)
  if (words.length < 8) {
    return false;
  }
  
  // Check for verb patterns indicating complete sentences
  const hasVerb = /\b(is|are|was|were|be|been|being|has|have|had|do|does|did|can|could|will|would|shall|should|may|might|must|occurs|happens|moves|forms|releases|absorbs|contains|involves|requires|produces)\b/i.test(trimmed);
  
  // Check for descriptive clause indicators
  const hasDescriptiveClause = /\b(that|which|where|when|because|since|although|while|if|as|through|during|after|before)\b/i.test(trimmed);
  
  // If it has a verb and is long enough, it's likely a complete sentence
  if (hasVerb && words.length >= 8) {
    return true;
  }
  
  // If it has both verb and descriptive clause, definitely a complete sentence
  if (hasVerb && hasDescriptiveClause) {
    return true;
  }
  
  return false;
}

/**
 * Checks if text contains conjunctions or prepositions that should prevent splitting
 */
function containsConjunctionOrPreposition(text: string): boolean {
  const connectingWords = ['and', 'or', 'with', 'of', 'from', 'to', 'in', 'by', 'using', 'through'];
  const lowerText = text.toLowerCase();
  
  return connectingWords.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lowerText);
  });
}

/**
 * Detects sequential standalone technical noun phrases WITHOUT conjunctions
 * Example: "light absorption glucose formation oxygen release" → ["light absorption", "glucose formation", "oxygen release"]
 * 
 * Returns null if:
 * - Text contains conjunctions/prepositions
 * - Text is a complete sentence
 * - Cannot identify clear sequential phrases
 */
function detectSequentialTechnicalPhrases(text: string): string[] | null {
  const trimmed = text.trim();
  
  // Rule 1: Do NOT split if contains conjunctions/prepositions
  if (containsConjunctionOrPreposition(trimmed)) {
    return null;
  }
  
  // Rule 2: Do NOT split if it's a complete sentence
  if (isCompleteSentence(trimmed)) {
    return null;
  }
  
  // Rule 3: Do NOT split if it has punctuation (likely a sentence)
  if (/[.!?,;:]/.test(trimmed)) {
    return null;
  }
  
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  
  // Need at least 4 words to form 2 technical phrases (minimum 2 words each)
  if (words.length < 4) {
    return null;
  }
  
  // Detect noun phrases: typically 2-3 words each
  // Example: "light absorption" (2 words), "glucose formation" (2 words)
  const phrases: string[] = [];
  let i = 0;
  
  while (i < words.length) {
    // Try to form a 2-3 word phrase
    if (i + 1 < words.length) {
      // Check if we can form a 2-word phrase
      const twoWordPhrase = words.slice(i, i + 2).join(' ');
      
      // Check if we can form a 3-word phrase
      if (i + 2 < words.length) {
        const threeWordPhrase = words.slice(i, i + 3).join(' ');
        
        // Prefer 2-word phrases for technical terms
        phrases.push(twoWordPhrase);
        i += 2;
      } else {
        phrases.push(twoWordPhrase);
        i += 2;
      }
    } else {
      // Single word left - attach to previous phrase if exists
      if (phrases.length > 0) {
        phrases[phrases.length - 1] += ' ' + words[i];
      }
      i++;
    }
  }
  
  // Only return if we detected 2 or more distinct phrases
  if (phrases.length >= 2) {
    return phrases;
  }
  
  return null;
}

/**
 * Validates bullet quality and filters out invalid bullets
 * 
 * Rejects:
 * - Single-word bullets
 * - Bullets starting with standalone conjunctions
 * - Bullets with separated modifiers
 */
function validateBullet(text: string): boolean {
  const trimmed = text.trim();
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  
  // Reject single-word bullets
  if (words.length === 1) {
    return false;
  }
  
  // Reject bullets starting with conjunctions
  const firstWord = words[0].toLowerCase();
  if (['and', 'or', 'but', 'with', 'of', 'from', 'to', 'in', 'by', 'using', 'through'].includes(firstWord)) {
    return false;
  }
  
  return true;
}

/**
 * SEMANTIC BULLET ENGINE
 * 
 * Applies smart semantic splitting with the following pipeline:
 * 1. Protect compound terms (scientific phrases with "and")
 * 2. Preserve complete sentences (subject + verb + clause)
 * 3. Detect and split sequential technical phrases (no conjunctions)
 * 4. Validate bullet quality (no single words, no conjunction-led bullets)
 * 5. Return meaningful bullets prioritizing content preservation
 */
function applySemanticBulletSplitting(input: string): string {
  const lines = input.split('\n');
  const output: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines
    if (trimmed.length === 0) {
      output.push('');
      continue;
    }
    
    // Check if this line is a heading (ends with colon or Title Case)
    const isHeading = trimmed.endsWith(':') || 
      (!trimmed.match(/[.!?]$/) && trimmed.split(/\s+/).every(word => 
        word.length > 0 && word.charAt(0) === word.charAt(0).toUpperCase()
      ));
    
    // Don't split headings or lines that already have bullet points
    if (isHeading || trimmed.startsWith('- ')) {
      output.push(trimmed);
      continue;
    }
    
    // STEP 1: Check if this is a protected compound term
    if (isProtectedCompoundTerm(trimmed)) {
      output.push(trimmed);
      continue;
    }
    
    // STEP 2: Check if this is a complete sentence
    if (isCompleteSentence(trimmed)) {
      output.push(trimmed);
      continue;
    }
    
    // STEP 3: Try to detect sequential technical phrases
    const technicalPhrases = detectSequentialTechnicalPhrases(trimmed);
    if (technicalPhrases && technicalPhrases.length >= 2) {
      // Split into multiple bullets, but validate each
      for (const phrase of technicalPhrases) {
        if (validateBullet(phrase)) {
          output.push(phrase.trim());
        }
      }
      continue;
    }
    
    // STEP 4: If text contains conjunctions/prepositions, keep as single bullet
    if (containsConjunctionOrPreposition(trimmed)) {
      output.push(trimmed);
      continue;
    }
    
    // STEP 5: Try splitting by commas (only if no conjunctions present)
    const commaSplit = trimmed.split(',').map(s => s.trim()).filter(s => s.length > 0);
    
    if (commaSplit.length > 1) {
      // Validate each fragment
      const validFragments = commaSplit.filter(frag => validateBullet(frag));
      
      if (validFragments.length > 0) {
        for (const frag of validFragments) {
          output.push(frag);
        }
      } else {
        // If all fragments invalid, keep original
        output.push(trimmed);
      }
    } else {
      // No splitting possible, keep as is
      output.push(trimmed);
    }
  }
  
  return output.join('\n');
}

/**
 * Converts patterns like "Definition:", "Process:", etc. into heading label format
 * with description on the next line prefixed with "- "
 */
function applyDefinitionStyle(input: string): string {
  const definitionKeywords = [
    'definition',
    'process',
    'importance',
    'examples',
    'types',
    'advantages',
    'disadvantages',
    'uses',
    'causes',
    'effects'
  ];
  
  const lines = input.split('\n');
  const output: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (line.length === 0) {
      output.push('');
      continue;
    }
    
    // Check if line matches pattern "Keyword:" or "keyword:"
    const lowerLine = line.toLowerCase();
    let matchedKeyword: string | null = null;
    
    for (const keyword of definitionKeywords) {
      if (lowerLine === keyword + ':' || lowerLine === keyword) {
        matchedKeyword = keyword;
        break;
      }
      // Also check if line starts with keyword followed by colon and content
      if (lowerLine.startsWith(keyword + ':')) {
        matchedKeyword = keyword;
        break;
      }
    }
    
    if (matchedKeyword) {
      // Extract content after the keyword (if any)
      const keywordWithColon = matchedKeyword + ':';
      const contentAfterKeyword = line.substring(line.toLowerCase().indexOf(keywordWithColon) + keywordWithColon.length).trim();
      
      // Add heading label (capitalize first letter)
      const headingLabel = matchedKeyword.charAt(0).toUpperCase() + matchedKeyword.slice(1) + ':';
      output.push(headingLabel);
      
      // If there's content after the keyword, apply semantic splitting to it
      if (contentAfterKeyword.length > 0) {
        const splitContent = applySemanticBulletSplitting(contentAfterKeyword);
        const contentLines = splitContent.split('\n').filter(l => l.trim().length > 0);
        for (const contentLine of contentLines) {
          output.push(contentLine);
        }
      }
    } else {
      output.push(line);
    }
  }
  
  return output.join('\n');
}

/**
 * Ensures each processed line begins with bullet prefix
 */
function applyBulletPoints(input: string): string {
  const lines = input.split('\n');
  const output: string[] = [];
  const bulletPrefix = getBulletPrefix(getCurrentBulletStyle());
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines
    if (trimmed.length === 0) {
      output.push('');
      continue;
    }
    
    // Check if this line looks like a heading (ends with colon or is Title Case with no punctuation)
    const isHeading = trimmed.endsWith(':') || 
      (!trimmed.match(/[.!?]$/) && trimmed.split(/\s+/).every(word => 
        word.length > 0 && word.charAt(0) === word.charAt(0).toUpperCase()
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
  
  return output.join('\n');
}

/**
 * Normalizes whitespace, capitalizes first letter, and ensures ending punctuation
 */
function normalizeLines(input: string): string {
  const lines = input.split('\n');
  const output: string[] = [];
  
  for (const line of lines) {
    let processed = line.trim();
    
    // Skip empty lines
    if (processed.length === 0) {
      output.push('');
      continue;
    }
    
    // Remove extra internal spaces
    processed = processed.replace(/\s+/g, ' ');
    
    // Check if this is a heading (ends with colon or is Title Case)
    const isHeading = processed.endsWith(':') || 
      (!processed.match(/[.!?]$/) && processed.split(/\s+/).every(word => 
        word.length > 0 && word.charAt(0) === word.charAt(0).toUpperCase()
      ));
    
    // Don't modify headings
    if (isHeading) {
      output.push(processed);
      continue;
    }
    
    // Check if line starts with bullet prefix
    const bulletPrefix = getBulletPrefix(getCurrentBulletStyle());
    const hasBullet = processed.startsWith(bulletPrefix);
    let content = hasBullet ? processed.substring(bulletPrefix.length).trim() : processed;
    
    // Capitalize first letter of content
    if (content.length > 0) {
      content = content.charAt(0).toUpperCase() + content.slice(1);
    }
    
    // Ensure ending punctuation
    if (content.length > 0 && !content.match(/[.!?]$/)) {
      content += '.';
    }
    
    // Reconstruct line with bullet if it had one
    if (hasBullet) {
      output.push(bulletPrefix + content);
    } else {
      output.push(content);
    }
  }
  
  return output.join('\n');
}

/**
 * Removes excessive blank lines while maintaining section spacing
 */
function cleanupSpacing(input: string): string {
  const lines = input.split('\n');
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
  
  return output.join('\n');
}

/**
 * Cleans and formats notes with cumulative transformation pipeline
 * 
 * STRICT SEQUENTIAL PIPELINE:
 * STEP 1: Capture raw input
 * STEP 2: Auto Detect Headings (if enabled)
 * STEP 3: Convert to Definition Style (if enabled) - uses semantic engine
 * STEP 4: Convert Paragraph to Points (if enabled) - uses semantic engine
 * STEP 5: Convert to Bullet Points (if enabled)
 * STEP 6: Normalize lines (capitalization, punctuation)
 * STEP 7: Cleanup spacing
 * 
 * Each transformation receives output from previous step and passes modified content to next step.
 * 
 * @param input - Raw multi-line notes text
 * @param convertToBullets - Whether to format as bullet points
 * @param convertParagraphToPoints - Whether to split paragraphs into points
 * @param convertToDefinitionStyle - Whether to convert definition patterns
 * @param autoDetectHeadings - Whether to detect and format headings
 * @returns Cleaned and formatted notes
 */
export function cleanAndFormatNotes(
  input: string, 
  convertToBullets: boolean = true,
  convertParagraphToPoints: boolean = false,
  convertToDefinitionStyle: boolean = false,
  autoDetectHeadings: boolean = false
): string {
  // STEP 1: Capture raw input
  if (!input.trim()) {
    return '';
  }

  let workingText = input;
  
  // STEP 2: Auto Detect Headings (if enabled)
  if (autoDetectHeadings) {
    workingText = applyAutoDetectHeadings(workingText);
  }
  
  // STEP 3: Convert to Definition Style (if enabled) - uses semantic engine
  if (convertToDefinitionStyle) {
    workingText = applyDefinitionStyle(workingText);
  }
  
  // STEP 4: Convert Paragraph to Points (if enabled) - uses semantic engine
  if (convertParagraphToPoints) {
    workingText = applySemanticBulletSplitting(workingText);
  }
  
  // STEP 5: Convert to Bullet Points (if enabled)
  if (convertToBullets) {
    workingText = applyBulletPoints(workingText);
  }
  
  // STEP 6: Normalize lines (capitalization, punctuation)
  workingText = normalizeLines(workingText);
  
  // STEP 7: Cleanup spacing
  workingText = cleanupSpacing(workingText);
  
  return workingText;
}
