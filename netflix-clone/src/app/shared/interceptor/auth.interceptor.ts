import { HttpInterceptorFn } from '@angular/common/http';

// interceptor is used that when we get alot of api calls from backend so it will check and put token on it 
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  if(token){
    const cloned = req.clone({
      setHeaders: {
        Authorization: 'Bearer ${token}'
      }
    });
    return next(cloned);
  }
  return next(req);
};
