import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { Category } from 'src/app/models/category';
import { Router } from '@angular/router';
import { MealService } from 'src/app/services/meal';
import { HeaderPage } from '../header/header.page';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, HeaderPage]
})
export class ExplorePage implements OnInit {

  categories: Category[] = [];
  searchQuery = '';
  isLoading = true;
  skeletons = Array(12).fill(0);

  constructor(
    private mealService: MealService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.mealService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/results'], { queryParams: { q: this.searchQuery } });
    }
  }

  goToCategory(category: string) {
    this.router.navigate(['/results'], { queryParams: { category } });
  }
}
