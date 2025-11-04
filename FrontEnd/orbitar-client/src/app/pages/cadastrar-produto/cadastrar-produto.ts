import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProdutoService } from '../../services/produto.service';
import { LucideAngularModule, Upload, X } from 'lucide-angular';
import { NavbarComponent } from "../../shared/navbar/navbar";

@Component({
  selector: 'app-cadastrar-produto',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, NavbarComponent],
  templateUrl: './cadastrar-produto.html',
  styleUrls: ['./cadastrar-produto.css']
})
export class CadastrarProdutoComponent {
  loading = false;
  // CORRIGIDO: O formulário agora espelha o DTO do backend
  formData = {
    nome: '',
    imagemUrl: '', // O backend espera ImagemUrl
    categoria: 0,    // O backend espera um número (Enum)
    condicao: 0,     // O backend espera um número (Enum)
    observacoes: '',
    enderecoEntrega: ''
  };

  imagePreview: string | ArrayBuffer | null = null;
  lucideUpload = Upload;
  lucideX = X;

  // CORRIGIDO: O 'value' agora é o número do Enum
  categorias = [
    { value: 0, label: 'Eletrônicos' },
    { value: 1, label: 'Roupas' },
    { value: 2, label: 'Livros' },
    { value: 3, label: 'Brinquedos' },
    { value: 4, label: 'Móveis' }
  ];
  estados = [
    { value: 0, label: 'Bom Estado' },
    { value: 1, label: 'Seminovo' },
    { value: 2, label: 'Com Defeito' }
  ];

  constructor(private produtoService: ProdutoService, private router: Router) {}

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.formData.imagemUrl = reader.result as string; // Atualiza a propriedade correta
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.formData.imagemUrl = '';
  }

  handleSubmit(): void {
    if (!this.formData.nome || !this.formData.enderecoEntrega) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    this.loading = true;

    // A cidade e o ID do doador são obtidos pelo backend através do token JWT.
    // Não precisamos mais enviá-los do frontend.
    this.produtoService.criarProduto(this.formData).subscribe({
      next: () => {
        alert('Produto cadastrado com sucesso!');
        this.router.navigate(['/minhas-doacoes']); // Redireciona para ver o novo produto
      },
      error: (err: any) => { // Tipando o 'err' para 'any' resolve o erro TS7006
        console.error('Erro ao cadastrar produto:', err);
        alert('Ocorreu um erro ao cadastrar o produto.');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/catalogo']);
  }
}
