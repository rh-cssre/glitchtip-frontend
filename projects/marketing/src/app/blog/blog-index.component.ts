import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
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
  standalone: true,
  imports: [RouterLink, MatCard, MatCardContent, DatePipe],
  templateUrl: "./blog-index.component.html",
  styleUrl: "./blog-index.component.scss",
})
export class BlogIndexComponent implements OnInit {
  posts: BlogItem[] | null = null;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<BlogItem[]>("/blog/blogIndex.json")
      .subscribe((data) => (this.posts = data));
  }
}
