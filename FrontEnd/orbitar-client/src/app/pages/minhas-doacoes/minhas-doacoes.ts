import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Observable, map } from 'rxjs';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { ProdutoCardComponent } from '../../shared/produto-card/produto-card';
import { Produto, ProdutoService } from '../../services/produto';
import { AuthService } from '../../services/auth.services';
import { LucideAngularModule, Gift, Package, Clock, CheckCircle, AlertCircle } from 'lucide-angular';

interface Estatisticas {
  total: number;
  disponivel: number;
  reservado: number;
  doado: number;
}

@Component({
  selector: 'app-minhas-doacoes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, ProdutoCardComponent, LucideAngularModule],
  templateUrl: './minhas-doacoes.html',
  styleUrls: ['./minhas-doacoes.css']
})
export class MinhasDoacoesComponent implements OnInit {
  produtos$: Observable<Produto[]>;
  loading$: Observable<boolean>;
  estatisticas$: Observable<Estatisticas>;

  mostrarModal = false;
  editandoProduto: Produto | null = null;

  mockUserId = 'mockUserId123';

  lucideGift = Gift;
  lucidePackage = Package;
  lucideClock = Clock;
  lucideCheckCircle = CheckCircle;
  lucideAlertCircle = AlertCircle;

  constructor(private produtoService: ProdutoService, private router: Router) {
    this.produtos$ = this.produtoService.produtos$;
    this.loading$ = this.produtoService.loading$;

    this.estatisticas$ = this.produtos$.pipe(
      map(produtos => ({
        total: produtos.length,
        disponivel: produtos.filter(p => p.status === 'disponivel').length,
        reservado: produtos.filter(p => p.status === 'reservado').length,
        doado: produtos.filter(p => p.status === 'doado').length,
      }))
    );
  }

  ngOnInit(): void {
    this.produtoService.buscarProdutosPorDoador(this.mockUserId);
  }

  handleEditar(produto: Produto): void {
    this.editandoProduto = { ...produto };
    this.mostrarModal = true;
  }

  handleRemover(produtoId: string): void {
    if (confirm('Tem certeza?')) {
      this.produtoService.removerProduto(produtoId).subscribe();
    }
  }

  handleMarcarComoDoado(produtoId: string): void {
    this.produtoService.atualizarProduto(produtoId, { status: 'doado' }).subscribe();
  }

  handleSalvarEdicao(): void {
    if (!this.editandoProduto) return;
    this.produtoService.atualizarProduto(this.editandoProduto._id, this.editandoProduto).subscribe(() => {
      this.fecharModal();
    });
  }

  fecharModal(): void {
    this.mostrarModal = false;
    this.editandoProduto = null;
  }
}
