import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const cloned = req.clone({
        withCredentials: true   // 👉 envoie les cookies automatiquement
    });

    return next(cloned);
};