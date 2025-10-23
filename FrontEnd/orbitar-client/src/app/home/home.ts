import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Gift, Heart, ArrowRight, Leaf, HandHeart, RefreshCw } from 'lucide-angular';
import { AuthService } from '../services/auth.services';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  isAuthenticated = false;

  // Ícones para o template
  lucideGift = Gift;
  lucideHeart = Heart;
  lucideArrowRight = ArrowRight;
  lucideLeaf = Leaf;
  lucideHandHeart = HandHeart;
  lucideRefreshCw = RefreshCw;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(status => {
      this.isAuthenticated = status;
    });
    this.isAuthenticated = this.authService.checkInitialAuthStatus();
  }
}
