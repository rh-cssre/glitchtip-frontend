import * as fs from "fs-extra";
import * as glob from "glob";
import * as path from "path";
import { format } from "date-fns";

const blogDir = path.join(__dirname, "projects/marketing/public/blog");
const documentationDir = path.join(__dirname, "projects/marketing/public/documentation");
const legalDir = path.join(__dirname, "projects/marketing/public/legal");
const routesFile = path.join(__dirname, "projects/marketing/routes.txt");
const blogIndexFile = path.join(blogDir, "blogIndex.json");
const rssFeedFile = path.join(blogDir, "rss.xml");
const domain = "https://glitchtip.com";

function extractFrontmatter(content: string): { [key: string]: string } {
  const frontmatterRegex = /^---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(content);

  if (match) {
    const frontmatter = match[1];
    return frontmatter.split("\n").reduce(
      (acc, line) => {
        const [key, ...valueParts] = line.split(":");
        const value = valueParts.join(":").trim();

        if (key && value) {
          acc[key.trim()] = value.replace(/^['"]|['"]$/g, ""); // Remove surrounding quotes from value
        }
        return acc;
      },
      {} as { [key: string]: string },
    );
  }

  return {};
}

// Function to extract the date from the filename
function extractDateFromFilename(filename: string): Date | null {
  const dateRegex = /(\d{4}-\d{2}-\d{2})/; // Matches YYYY-MM-DD format
  const match = dateRegex.exec(filename);

  if (match) {
    return new Date(match[1]);
  }

  return null;
}

// Helper function to generate route paths from a directory
function generateRoutesFromDirectory(baseDir: string, routePrefix: string): string[] {
  const files: string[] = glob.sync(`${baseDir}/**/*.md`);
  return files.map((file) =>
    file
      .replace(baseDir, routePrefix) // Replace base directory path with the route prefix
      .replace(/\.md$/, "")
      .replace(/\\/g, "/") // Normalize Windows paths
  );
}

// Function to generate routes.txt, blogIndex.json, and rss.xml
function generateRoutesIndexAndRSS(): void {
  const blogFiles: string[] = glob.sync(`${blogDir}/**/*.md`);
  const routes: string[] = [];
  const blogIndex: {
    title: string;
    route: string;
    date: string;
    description: string;
  }[] = [];
  let rssItems: string[] = [];

  blogFiles.forEach((file) => {
    const content = fs.readFileSync(file, "utf-8");
    const frontmatter = extractFrontmatter(content);
    const date = extractDateFromFilename(file);
    const formattedDate = date ? format(date, "yyyy-MM-dd") : "";

    const route = file
      .replace(blogDir, "")
      .replace(/\.md$/, "")
      .replace(/\\/g, "/");
    const url = `/blog${route}`;

    routes.push(url);

    if (frontmatter.title && date) {
      blogIndex.push({
        title: frontmatter.title,
        route: url,
        date: formattedDate,
        description: frontmatter.description,
      });

      // Generate RSS item
      rssItems.push(`
        <item>
          <title>${frontmatter.title}</title>
          <link>${domain}${url}</link>
          <pubDate>${date.toUTCString()}</pubDate>
          <guid isPermaLink="false">${url}</guid>
        </item>
      `);
    }
  });

  // Add documentation and legal routes
  const documentationRoutes = generateRoutesFromDirectory(documentationDir, "/documentation");
  const legalRoutes = generateRoutesFromDirectory(legalDir, "/legal");
  routes.push(...documentationRoutes, ...legalRoutes);

  // Write the routes.txt file
  fs.writeFileSync(routesFile, routes.join("\n"), "utf-8");
  console.log(`Routes generated at ${routesFile}`);

  // Write the blogIndex.json file
  fs.writeFileSync(blogIndexFile, JSON.stringify(blogIndex, null, 2), "utf-8");
  console.log(`Blog index generated at ${blogIndexFile}`);

  // Generate and write the RSS feed
  const rssFeed = `
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>GlitchTip Blog</title>
        <link>${domain}/blog</link>
        <description>GlitchTip open source error monitoring</description>
        <atom:link href="${domain}/blog/rss.xml" rel="self" type="application/rss+xml" />
        ${rssItems.join("\n")}
      </channel>
    </rss>
  `;

  fs.writeFileSync(rssFeedFile, rssFeed.trim(), "utf-8");
  console.log(`RSS feed generated at ${rssFeedFile}`);
}

// Run the function to generate the files
generateRoutesIndexAndRSS();

