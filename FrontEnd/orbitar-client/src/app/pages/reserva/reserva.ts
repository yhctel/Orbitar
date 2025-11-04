import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { ReservaService , MinhaReservaResponse, ReservaNoMeuProdutoResponse} from '../../services/reserva.service';
import { LucideAngularModule, Package, User, AlertCircle } from 'lucide-angular';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, NavbarComponent, LucideAngularModule],
  templateUrl: './reserva.html',
  styleUrls: ['./reserva.css'] // Crie um arquivo CSS básico
})
export class ReservasComponent implements OnInit {
  minhasReservas$!: Observable<MinhaReservaResponse[]>;
  reservasNosMeusProdutos$!: Observable<ReservaNoMeuProdutoResponse[]>;

  // Ícones
  lucidePackage = Package;
  lucideUser = User;
  lucideAlertCircle = AlertCircle;

  constructor(private reservaService: ReservaService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.minhasReservas$ = this.reservaService.obterMinhasReservas();
    this.reservasNosMeusProdutos$ = this.reservaService.obterReservasNosMeusProdutos();
  }

  onCancelarReserva(id: string): void {
    if (confirm('Tem certeza que deseja cancelar esta reserva?')) {
      this.reservaService.cancelarMinhaReserva(id).subscribe(() => {
        alert('Reserva cancelada com sucesso!');
        this.carregarDados();
      });
    }
  }

  getStatusTexto(status: number): string {
    const mapaStatus = ['Ativa', 'Concluída', 'Cancelada pelo Doador', 'Cancelada por Você'];
    return mapaStatus[status] || 'Desconhecido';
  }
}
