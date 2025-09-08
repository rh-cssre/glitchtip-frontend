const fs = require("fs");
const path = require("path");
const xliff = require("xliff");

// --- Configuration ---
const sourceDir = "src/locale";
const destDir = "src/assets/i18n";
const localeFileRegex = /^messages\.([a-zA-Z-]+)\.xlf$/;
// ---------------------

/**
 * Flattens the structured translation object/array from the xliff library
 * into a single string with Angular-style placeholders.
 */
function flattenTranslation(target) {
  if (typeof target === "string") {
    return target;
  }
  if (!Array.isArray(target)) {
    target = [target];
  }
  return target
    .map((part) => {
      if (typeof part === "string") {
        return part;
      }
      if (typeof part === "object" && part !== null) {
        const tagType = Object.keys(part)[0];
        const tagData = part[tagType];
        if (!tagData) return "";
        if (tagData.equivStart && tagData.equivEnd) {
          const startPlaceholder = `{$${tagData.equivStart}}`;
          const endPlaceholder = `{$${tagData.equivEnd}}`;
          const innerContent = flattenTranslation(tagData.contents || "");
          return `${startPlaceholder}${innerContent}${endPlaceholder}`;
        }
        if (tagData.equiv) {
          return `{$${tagData.equiv}}`;
        }
      }
      return "";
    })
    .join("");
}

/**
 * Converts a single XLIFF file to a JSON translation file.
 * @param {string} sourcePath - Full path to the source .xlf file.
 * @param {string} destPath - Full path for the destination .json file.
 */
async function convertFile(sourcePath, destPath) {
  console.log(`\nProcessing: ${sourcePath}`);
  try {
    const xliffContent = fs.readFileSync(sourcePath, "utf8");
    const xliffJs = await xliff.xliff2js(xliffContent);

    const translations = {};
    const fileKey = Object.keys(xliffJs.resources)[0];
    const file = xliffJs.resources[fileKey];

    for (const id in file) {
      if (file.hasOwnProperty(id)) {
        const rawTarget = file[id].target;
        if (rawTarget !== undefined && rawTarget !== null) {
          translations[id] = flattenTranslation(rawTarget);
        }
      }
    }

    fs.writeFileSync(destPath, JSON.stringify(translations, null, 2));
    console.log(`✅ Success -> ${destPath}`);
  } catch (error) {
    console.error(`❌ Error processing ${sourcePath}:`);
    console.error(error);
  }
}

/**
 * Finds and processes all locale files in the source directory.
 */
async function processAllLocales() {
  console.log("Starting automated locale conversion...");

  // Ensure the destination directory exists, create it if not.
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    console.log(`Created destination directory: ${destDir}`);
  }

  const files = fs.readdirSync(sourceDir);
  let processedCount = 0;

  for (const filename of files) {
    const match = filename.match(localeFileRegex);
    if (match) {
      const locale = match[1]; // e.g., "fr-FR" or "es"
      const sourcePath = path.join(sourceDir, filename);
      const destFilename = `messages.${locale}.json`;
      const destPath = path.join(destDir, destFilename);

      await convertFile(sourcePath, destPath);
      processedCount++;
    }
  }

  if (processedCount > 0) {
    console.log(`\n🏁 Finished. Processed ${processedCount} locale file(s).`);
  } else {
    console.log(
      `\n⚠️ No locale files found in "${sourceDir}" matching the pattern "messages.<locale>.xlf".`,
    );
  }
}

processAllLocales();
