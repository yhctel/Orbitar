import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.services';

@Component({
  selector: 'app-confirmar-senha',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './confirmar-senha.html',
  styleUrls: ['./confirmar-senha.css']
})
export class ConfirmarSenhaComponent implements OnInit {
  status: 'loading' | 'success' | 'error' = 'loading';

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.authService.confirmPasswordChange(token).subscribe({
        next: () => {
          this.status = 'success';
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
