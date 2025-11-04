import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { LucideAngularModule, Gift, Heart, ArrowRight, Leaf, HandHeart, RefreshCw } from 'lucide-angular';
import { AuthService } from '../services/auth.service';

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
export class HomeComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private authSubscription: Subscription = new Subscription();

  lucideGift = Gift;
  lucideHeart = Heart;
  lucideArrowRight = ArrowRight;
  lucideLeaf = Leaf;
  lucideHandHeart = HandHeart;
  lucideRefreshCw = RefreshCw;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(status => {
      this.isAuthenticated = status;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }
}
