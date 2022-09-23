var fs = require("fs");
var path = require("path");
const xliff2js = require("xliff/xliff2js");
const targetOfjs = require("xliff/targetOfjs");
const utils = require("./utils");

// function to find all files in a directory with a specific extension
function findByExt(base, exts, files, result) {
  files = files || fs.readdirSync(base);
  result = result || [];

  files.forEach(function (file) {
    var newbase = path.join(base, file);
    if (!fs.statSync(newbase).isDirectory()) {
      for (let i = 0; i < exts.length; i++) {
        const ext = exts[i];
        if (file.substr(-1 * (ext.length + 1)) == "." + ext) {
          result.push(newbase);
          break;
        }
      }
    }
  });
  return result;
}

/** Based on https://developapa.com/angular-localize/ */
function jsonAngularCompat(xliffContent) {
  return Object.keys(xliffContent).reduce((result, current) => {
    if (typeof xliffContent[current] === "string") {
      result[current] = xliffContent[current];
    } else {
      result[current] = xliffContent[current]
        .map((entry) => {
          if (typeof entry === "string") {
            return entry;
          } else {
            if (entry.Standalone) {
              return `{$${entry.Standalone["equiv"]}}`;
            } else if (entry.Span) {
              return `{$${entry.Span.equivStart}}${entry.Span["contents"]}{$${entry.Span.equivEnd}}`;
            } else {
              throw Error("Unhandled message content: ", entry)
            }
          }
        })
        .join("");
    }

    return result;
  }, {});
}

async function convert(input_path) {
  if (!input_path) {
    return;
  }

  if (!fs.existsSync(input_path)) {
    console.log(`ERROR: File or directory "${input_path}" not found!`);
    return;
  }

  const is_dir = fs.lstatSync(input_path).isDirectory();

  let files = null;

  if (is_dir) {
    // gets all files in input with extension 'xlf' or 'xliff'
    files = findByExt(input_path, ["xlf", "xliff"]);
  } else {
    files = [input_path];
  }

  if (files.length === 0) {
    console.log(`ERROR: No files found in "${input_path}"!`);
    return;
  }

  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let base_file_name = file.replace(/^.*[\\\/]/, "");

    let file_info = fs.readFileSync(file, "utf8");

    // getting data
    const json_obj = await xliff2js(file_info);

    // got data, now convert to JSON
    const res = targetOfjs(json_obj);
    const simplifiedJson = jsonAngularCompat(res);
    const string_res = JSON.stringify(simplifiedJson, null, 2);

    // writes new JSON file
    const new_path = path.join(
      is_dir ? input_path : path.dirname(input_path),
      base_file_name.substring(0, base_file_name.length - 3) + "json"
    );
    if (fs.existsSync(new_path)) {
      const old_file = fs.readFileSync(new_path, "utf8");
      if (old_file === string_res) {
        console.log(
          `INFO: Skipping converting "${file}" to "${new_path}" as the output is equivalent.`
        );
      } else {
        console.log(`INFO: Overwriting "${file}" with "${new_path}".`);
      }
    } else {
      fs.writeFileSync(new_path, string_res);
      console.log(`INFO: Converted "${file}" to "${new_path}".`);
    }
  }
}

if (require.main === module) {
  const input_path = utils.getPath(false);
  convert(input_path);
}

module.exports = {
  convert: convert,
};
