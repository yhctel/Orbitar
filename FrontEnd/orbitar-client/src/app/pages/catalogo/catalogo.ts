import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { ProdutoCardComponent } from '../../shared/produto-card/produto-card';
import { Produto, ProdutoService } from '../../services/produto';
import { LucideAngularModule, Filter, AlertCircle } from 'lucide-angular';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, ProdutoCardComponent, LucideAngularModule],
  templateUrl: './catalogo.html',
  styleUrls: ['./catalogo.css']
})
export class CatalogoComponent implements OnInit {
  produtos$: Observable<Produto[]>;
  loading$: Observable<boolean>;

  categorias = ['Todas as Categorias', 'Eletrônicos', 'Roupas', 'Livros', 'Brinquedos', 'Móveis'];
  estados = ['Todos os Estados', 'Bom Estado', 'Seminovo', 'Com Defeito'];

  filtroCategoria = 'Todas as Categorias';
  filtroEstado = 'Todos os Estados';

  lucideFilter = Filter;
  lucideAlertCircle = AlertCircle;

  constructor(private produtoService: ProdutoService) {
    this.produtos$ = this.produtoService.produtos$;
    this.loading$ = this.produtoService.loading$;
  }

  ngOnInit(): void {
    this.buscar();
  }

  buscar(): void {
    this.produtoService.buscarProdutos({
      categoria: this.filtroCategoria,
      estado: this.filtroEstado
    });
  }

  handleReservar(produto: Produto): void {
    this.produtoService.reservarProduto(produto._id).subscribe(success => {
      if (success) {
        alert(`Produto "${produto.nome}" reservado com sucesso!`);
        this.buscar(); // Recarrega a lista para refletir a mudança de status
      } else {
        alert('Falha ao reservar o produto.');
      }
    });
  }
}
