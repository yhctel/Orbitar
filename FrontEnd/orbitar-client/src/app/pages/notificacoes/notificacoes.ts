import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { NotificationService, Notificacao } from '../../services/notification.service';
import { LucideAngularModule, BellOff } from 'lucide-angular';

@Component({
  selector: 'app-notificacoes',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    LucideAngularModule
  ],
  templateUrl: './notificacoes.html',
  styleUrls: ['./notificacoes.css']
})
export class NotificacoesComponent implements OnInit {

  notificacoes$: Observable<Notificacao[]>;
  lucideBellOff = BellOff;

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.notificacoes$ = this.notificationService.notificacoes$;
  }

  ngOnInit(): void {
    this.notificationService.buscarNotificacoes();
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
