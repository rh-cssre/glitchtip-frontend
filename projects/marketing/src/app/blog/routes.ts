import { Route } from "@angular/router";
import { BlogIndexComponent } from "./blog-index.component";
import { BlogPostComponent } from "./blog-post.component";

export default [
  { path: "", component: BlogIndexComponent },
  { path: ":slug", component: BlogPostComponent },
] as Route[];
