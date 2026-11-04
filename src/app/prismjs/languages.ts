import Prism from "prismjs";
// Prism core ships markup, css, clike and javascript; the rest load here.
import "prismjs/components/prism-json";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-markup-templating";
import "prismjs/components/prism-php";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-swift";
import "prismjs/components/prism-c";
import "prismjs/components/prism-objectivec";

// Import Prism from here so the grammars are loaded wherever it is used.
export default Prism;
