import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit, inject } from "@angular/core";
import { MatCard, MatCardContent } from "@angular/material/card";
import { RouterLink } from "@angular/router";

interface BlogItem {
  title: string;
  route: string;
  date?: string;
  description?: string;
}

@Component({
  selector: "app-blog-index",
  imports: [RouterLink, MatCard, MatCardContent, DatePipe],
  templateUrl: "./blog-index.component.html",
  styleUrl: "./blog-index.component.scss",
})
export class BlogIndexComponent implements OnInit {
  private http = inject(HttpClient);

  posts: BlogItem[] | null = null;

  ngOnInit(): void {
    this.http
      .get<BlogItem[]>("/blog/blogIndex.json")
      .subscribe((data) => (this.posts = data));
  }
}
