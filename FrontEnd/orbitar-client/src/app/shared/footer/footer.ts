import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Leaf, Heart, Recycle, Users } from 'lucide-angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule // 2. Adicione o módulo aos imports
  ],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css']
})
export class FooterComponent {
  // 3. Exponha os ícones para o template
  lucideRecycle = Recycle;
  lucideLeaf = Leaf;
  lucideHeart = Heart;
  lucideUsers = Users; // Usando Users para Impacto Social
}
