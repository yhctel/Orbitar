import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-confirmar-cidade',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './confirmar-cidade.html',
  styleUrls: ['./confirmar-cidade.css']
})
export class ConfirmarCidadeComponent implements OnInit {
  status: 'loading' | 'success' | 'error' = 'loading';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.authService.confirmCityChange(token).subscribe({
        next: () => {
          this.status = 'success';
          setTimeout(() => {
            this.router.navigate(['/editar-perfil']);
          }, 3000);
        },
        error: () => {
          this.status = 'error';
        }
      });
    } else {
      this.status = 'error';
    }
  }
}
