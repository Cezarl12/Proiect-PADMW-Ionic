import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';

const firebaseConfig = {
  apiKey: "AIzaSyCvp4FUoOr7ZzWR2rMcmUGIJtfNjA-qSbs",
  authDomain: "recipehub-535f1.firebaseapp.com",
  projectId: "recipehub-535f1",
  storageBucket: "recipehub-535f1.firebasestorage.app",
  messagingSenderId: "381635611300",
  appId: "1:381635611300:web:c43d5a6675f599cd273431",
  measurementId: "G-89SNY01JMD"
};
defineCustomElements(window);
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
});
