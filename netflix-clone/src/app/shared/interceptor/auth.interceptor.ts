import { HttpInterceptorFn } from '@angular/common/http';

// interceptor is used that when we get alot of api calls from backend so it will check and put token on it 
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if(token){
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }
  return next(req);
};



// import { HttpInterceptorFn } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { AuthService } from '../services/auth.service';
// import { catchError, throwError } from 'rxjs';

// // interceptor is used that when we get alot of api calls from backend so it will check and put token on it 
// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const authService = inject(AuthService);
//   const token = localStorage.getItem('token');

//   let request = req;
//   if(token){
//     request = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//   }else {
//     console.log('No token found, request send without auth')
//   }
//   return next(req).pipe(
//     catchError((error) => {
//       if(error.status === 401 || error.status === 403){
//         authService.logout();
//       }
//       return throwError(() => error);
//     })
//   )
// };






