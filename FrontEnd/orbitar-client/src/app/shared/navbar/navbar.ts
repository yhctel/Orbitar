import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { LucideAngularModule, Gift, Home, Plus, Heart, User, LogOut, Bell } from 'lucide-angular';
import { AuthService } from '../../services/auth.services';
import { NotificationService, Notificacao } from '../../services/notification';

@Component({
  selector: 'app-navbar',
  standalone: true, // <-- ADICIONE ESTA LINHA!
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
  userName = 'Letícia Lindberght';

  notificacoes$: Observable<Notificacao[]>;
  unreadCount$: Observable<number>;
  isDropdownOpen = false;

  // Ícones
  lucideGift = Gift;
  lucideHome = Home;
  lucidePlus = Plus;
  lucideHeart = Heart;
  lucideUser = User;
  lucideLogOut = LogOut;
  lucideBell = Bell;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.notificacoes$ = this.notificationService.notificacoes$;
    this.unreadCount$ = this.notificationService.unreadCount$;
  }

  ngOnInit(): void {}

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
    this.router.navigate(['/']);
  }
}
