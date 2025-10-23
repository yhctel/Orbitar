import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, /*RouterLink*/ } from '@angular/router';
import { Observable } from 'rxjs';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { NotificationService, Notificacao } from '../../services/notification';
import { LucideAngularModule, BellOff } from 'lucide-angular';

@Component({
  selector: 'app-notificacoes',
  standalone: true,
  imports: [
    CommonModule,
    //RouterLink,
    NavbarComponent,
    LucideAngularModule
  ],
  templateUrl: './notificacoes.html',
  styleUrls: ['./notificacoes.css']
})
export class NotificacoesComponent {

  notificacoes$: Observable<Notificacao[]>;
  lucideBellOff = BellOff;

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.notificacoes$ = this.notificationService.notificacoes$;
  }

  handleNotificationClick(notificacao: Notificacao): void {
    this.notificationService.marcarComoLida(notificacao.id).subscribe(() => {
      if (notificacao.link) {
        this.router.navigate([notificacao.link]);
      }
    });
  }

  marcarTodasComoLidas(): void {
    this.notificationService.marcarTodasComoLidas();
  }
}
