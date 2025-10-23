import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, /*RouterLink*/ } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar';
import { ProdutoService } from '../../services/produto';
import { AuthService } from '../../services/auth.services';

import { LucideAngularModule, Upload, X } from 'lucide-angular';

@Component({
  selector: 'app-cadastrar-produto',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    //RouterLink,
    NavbarComponent,
    LucideAngularModule
  ],
  templateUrl: './cadastrar-produto.html',
  styleUrls: ['./cadastrar-produto.css']
})
export class CadastrarProdutoComponent implements OnInit {
  loading = false;
  formData = {
    nome: '',
    imagem: '',
    categoria: '',
    estadoConservacao: '',
    observacoes: '',
    enderecoEntrega: '',
    cidade: '',
    doadorId: '',
    status: 'disponivel' as const
  };

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  lucideUpload = Upload;
  lucideX = X;

  categorias = [
    { value: 'eletronicos', label: 'Eletrônicos' },
    { value: 'roupas', label: 'Roupas' },
  ];
  estados = [
    { value: 'bom_estado', label: 'Bom Estado' },
    { value: 'seminovo', label: 'Seminovo' },
    { value: 'com_defeito', label: 'Com Defeito' }
  ];

  constructor(
    private produtoService: ProdutoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const mockUser = { cidade: 'São Paulo', userId: 'mockUserId123' };
    if (mockUser) {
      this.formData.cidade = mockUser.cidade;
      this.formData.doadorId = mockUser.userId;
    }
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.selectedFile = null;
  }

  handleSubmit(): void {
    if (!this.formData.nome || !this.formData.categoria /*...*/) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    this.loading = true;
    if (this.imagePreview) {
      this.formData.imagem = this.imagePreview as string;
    }

    this.produtoService.criarProduto(this.formData).subscribe({
      next: () => {
        alert('Produto cadastrado com sucesso!');
        this.router.navigate(['/catalogo']);
      },
      error: (err) => {
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
