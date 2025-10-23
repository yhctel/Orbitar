import { Component, OnInit, Inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Gift, Users, Recycle, Heart, ArrowRight, Star, Leaf, HandHeart, RefreshCw } from 'lucide-angular'; // Adicionado Leaf, HandHeart, RefreshCw
import { AuthService } from '../services/auth.services';

// A interface Depoimento não é mais necessária, mas vou deixá-la aqui caso precise para outras partes
interface Depoimento {
  nome: string;
  avatar: string;
  texto: string;
  avaliacao: number;
}

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
  isAuthenticated: boolean = false;
  lucideGift = Gift;
  lucideUsers = Users;
  lucideRecycle = Recycle;
  lucideHeart = Heart;
  lucideArrowRight = ArrowRight;
  lucideStar = Star;
  lucideLeaf = Leaf; // Novo ícone
  lucideHandHeart = HandHeart; // Novo ícone
  lucideRefreshCw = RefreshCw; // Novo ícone

  // Depoimentos não serão mais usados nesta seção, mas podem ser mantidos para referência
  depoimentos: Depoimento[] = [
    {
      nome: 'Maria Silva',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      texto: 'Consegui ajudar várias famílias doando itens que não usava mais. A plataforma é muito fácil de usar!',
      avaliacao: 5
    },
    {
      nome: 'João Santos',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
      texto: 'Recebi um notebook que mudou minha vida profissional. Gratidão eterna aos doadores!',
      avaliacao: 5
    },
    {
      nome: 'Ana Costa',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
      texto: 'Plataforma incrível! Consegui móveis para minha nova casa através de doações.',
      avaliacao: 5
    }
  ];


  constructor(@Inject(AuthService) private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe(status => {
      this.isAuthenticated = status;
    });
    this.isAuthenticated = this.authService.checkInitialAuthStatus();
  }

  signIn(): void {
    this.authService.signIn();
  }
}
