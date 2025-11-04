import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { LucideAngularModule, Gift, Home, Plus, Heart, User, LogOut, Bell, ClipboardList } from 'lucide-angular';
import { AuthService, AuthResponse } from '../../services/auth.service';
import { NotificationService, Notificacao } from '../../services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    LucideAngularModule
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;
  userName = '';

  notificacoes$: Observable<Notificacao[]>;
  unreadCount$: Observable<number>;
  isDropdownOpen = false;

  lucideGift = Gift;
  lucideHome = Home;
  lucidePlus = Plus;
  lucideHeart = Heart;
  lucideUser = User;
  lucideLogOut = LogOut;
  lucideBell = Bell;
  lucideClipboardList = ClipboardList;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.notificacoes$ = this.notificationService.notificacoes$;
    this.unreadCount$ = this.notificationService.unreadCount$;
  }

  ngOnInit(): void {
    this.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        const user = this.authService.getCurrentUser();
        this.userName = user ? user.nomeCompleto : '';
        this.notificationService.buscarNotificacoes();
      } else {
        this.userName = '';
      }
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  handleNotificationClick(notificacao: Notificacao): void {
    this.notificationService.marcarComoLida(notificacao.id).subscribe(() => {
      if (notificacao.link) {
        this.router.navigate([notificacao.link]);
      }
      this.isDropdownOpen = false;
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  signOut(): void {
    this.authService.signOut();
  }
}
