import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export type Role = 'CTO' | 'TECH_LEAD' | 'EMPLOYEE';
export interface CurrentUser { id: string; email: string; role: Role; }
export interface LoginResponse { token: string; user: CurrentUser; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenKey = 'tr_jwt';
  private readonly userKey = 'tr_user';

  loginViewer(email: string, password: string) {
    return this.http.post<LoginResponse>('/api/auth/login', { email, password }).pipe(
      tap((res) => this.setSession(res)),
    );
  }

  loginAdmin(email: string, password: string) {
    return this.http.post<LoginResponse>('/api/auth/admin/login', { email, password }).pipe(
      tap((res) => this.setSession(res)),
    );
  }

  private setSession(res: LoginResponse) {
    localStorage.setItem(this.tokenKey, res.token);
    localStorage.setItem(this.userKey, JSON.stringify(res.user));
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  get token() { return localStorage.getItem(this.tokenKey) || ''; }
  get user(): CurrentUser | null {
    const raw = localStorage.getItem(this.userKey);
    return raw ? JSON.parse(raw) as CurrentUser : null;
  }
  isLoggedIn() { return !!this.token; }
  hasAnyRole(roles: Role[]) { const u = this.user; return !!u && roles.includes(u.role); }
}
