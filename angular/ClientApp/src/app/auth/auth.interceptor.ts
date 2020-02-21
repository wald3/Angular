import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest } from "@angular/common/http";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {

  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler):
    Observable<HttpEvent<any>> {
    if (localStorage.getItem('jwt_token') != null) {
      const clonedReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('jwt_token'))
      });
      return next.handle(clonedReq).pipe(
        tap(
          succ => {

          },
          err => {
            if (err.status == 401 || err.status == 403)
              this.router.navigateByUrl('/');
          }
        )
      )
    }
    else
      return next.handle(req.clone());
    }

}
