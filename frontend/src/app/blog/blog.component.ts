import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  title = '';
  content = '';
  posts: any[] = [];
  apiUrl = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPosts();
  }

  createPost() {
    this.http.post(this.apiUrl, { title: this.title, content: this.content }).subscribe({
      next: () => alert('Post created!'),
      error: () => alert('Failed to create post')
    });

    this.fetchPosts();
  }

fetchPosts() {
  this.http.get<any[]>('http://localhost:3000/api/posts').subscribe({
    next: (data) => this.posts = data,
    error: () => alert('Error loading posts')
  });
}
}
