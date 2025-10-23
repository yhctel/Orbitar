import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, MapPin, Clock, Package, User } from 'lucide-angular';
import { Produto } from '../../services/produto';

@Component({
  selector: 'app-produto-card',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule
  ],
  templateUrl: './produto-card.html',
  styleUrls: ['./produto-card.css']
})
export class ProdutoCardComponent {
  @Input() produto!: Produto;
  @Input() isDoador = false;

  @Output() reservar = new EventEmitter<Produto>();
  @Output() editar = new EventEmitter<Produto>();
  @Output() remover = new EventEmitter<string>();

  lucideMapPin = MapPin;
  lucideClock = Clock;
  lucidePackage = Package;
  lucideUser = User;

  onReservarClick(): void {
    this.reservar.emit(this.produto);
  }

  onEditarClick(): void {
    this.editar.emit(this.produto);
  }

  onRemoverClick(): void {
    this.remover.emit(this.produto._id);
  }
}
