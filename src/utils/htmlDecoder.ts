/**
 * HTML Entity Decoder Utility
 * 
 * Provides comprehensive HTML entity decoding for all types:
 * - Named entities (&amp;, &quot;, etc.)
 * - Numeric decimal entities (&#8216;, &#8217;, etc.)
 * - Numeric hexadecimal entities (&#x2018;, &#x2019;, etc.)
 */

// Common HTML entities mapping for named entities
const HTML_ENTITIES: Record<string, string> = {
  // Basic HTML entities
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
  '&#039;': "'",
  '&nbsp;': ' ',
  
  // Extended named entities commonly used by WordPress
  '&ndash;': '–',    // en dash
  '&mdash;': '—',    // em dash
  '&lsquo;': '\u2018',    // left single quotation mark
  '&rsquo;': '\u2019',    // right single quotation mark
  '&ldquo;': '\u201C',    // left double quotation mark
  '&rdquo;': '\u201D',    // right double quotation mark
  '&hellip;': '…',   // horizontal ellipsis
  '&trade;': '™',    // trade mark
  '&copy;': '©',     // copyright
  '&reg;': '®',      // registered trademark
  '&deg;': '°',      // degree symbol
  '&plusmn;': '±',   // plus-minus
  '&frac12;': '½',   // fraction 1/2
  '&frac14;': '¼',   // fraction 1/4
  '&frac34;': '¾',   // fraction 3/4
  '&euro;': '€',     // euro symbol
  '&pound;': '£',    // pound symbol
  '&yen;': '¥',      // yen symbol
  '&cent;': '¢',     // cent symbol
  
  // Common accented characters
  '&aacute;': 'á',   '&Aacute;': 'Á',
  '&eacute;': 'é',   '&Eacute;': 'É',
  '&iacute;': 'í',   '&Iacute;': 'Í',
  '&oacute;': 'ó',   '&Oacute;': 'Ó',
  '&uacute;': 'ú',   '&Uacute;': 'Ú',
  '&ntilde;': 'ñ',   '&Ntilde;': 'Ñ',
  '&uuml;': 'ü',     '&Uuml;': 'Ü',
  '&agrave;': 'à',   '&Agrave;': 'À',
  '&egrave;': 'è',   '&Egrave;': 'È',
  '&igrave;': 'ì',   '&Igrave;': 'Ì',
  '&ograve;': 'ò',   '&Ograve;': 'Ò',
  '&ugrave;': 'ù',   '&Ugrave;': 'Ù',
  '&acirc;': 'â',    '&Acirc;': 'Â',
  '&ecirc;': 'ê',    '&Ecirc;': 'Ê',
  '&icirc;': 'î',    '&Icirc;': 'Î',
  '&ocirc;': 'ô',    '&Ocirc;': 'Ô',
  '&ucirc;': 'û',    '&Ucirc;': 'Û',
  '&ccedil;': 'ç',   '&Ccedil;': 'Ç',
};

/**
 * Decode numeric HTML entities (both decimal and hexadecimal)
 * Examples: &#8216; -> ', &#x2018; -> ', &#233; -> é
 */
function decodeNumericEntity(match: string, isHex: boolean, code: string): string {
  try {
    const charCode = isHex ? parseInt(code, 16) : parseInt(code, 10);
    
    // Validate the character code is within valid Unicode range
    if (charCode >= 0 && charCode <= 0x10FFFF) {
      return String.fromCharCode(charCode);
    }
  } catch {
    // If parsing fails, return the original match
  }
  
  return match;
}

/**
 * Comprehensive HTML entity decoder
 * 
 * Handles three types of HTML entities:
 * 1. Named entities: &amp;, &quot;, &lsquo;, etc.
 * 2. Numeric decimal: &#8216;, &#233;, etc.
 * 3. Numeric hexadecimal: &#x2018;, &#xE9;, etc.
 */
export function decodeHtmlEntities(text: string): string {
  if (!text || typeof text !== 'string') {
    return text;
  }

  let decoded = text;

  // Step 1: Decode named entities
  for (const [entity, replacement] of Object.entries(HTML_ENTITIES)) {
    // Use global replace to handle multiple occurrences
    decoded = decoded.replace(new RegExp(entity, 'g'), replacement);
  }

  // Step 2: Decode numeric decimal entities (&#123;)
  decoded = decoded.replace(/&#(\d+);/g, (match, code) => 
    decodeNumericEntity(match, false, code)
  );

  // Step 3: Decode numeric hexadecimal entities (&#x1A; or &#X1A;)
  decoded = decoded.replace(/&#[xX]([0-9a-fA-F]+);/g, (match, code) => 
    decodeNumericEntity(match, true, code)
  );

  return decoded;
}

/**
 * Quick test function to verify the decoder works
 * Can be used in development/debugging
 */
export function testHtmlDecoder(): void {
  const testCases = [
    'james K abraza el pop en &#8216;friend&#8217;',
    '&quot;Hello&quot; &amp; &lt;world&gt;',
    'Price: &euro;99.99 &ndash; was &pound;120',
    'Caf&eacute; con leche &amp; caf&eacute; au lait',
    'Temperature: 23&deg;C &plusmn; 2&deg;',
    '&#x2018;Smart quotes&#x2019; and &#8220;double quotes&#8221;',
  ];

  console.log('HTML Entity Decoder Test Results:');
  testCases.forEach((test, index) => {
    const decoded = decodeHtmlEntities(test);
    console.log(`${index + 1}. "${test}" → "${decoded}"`);
  });
}