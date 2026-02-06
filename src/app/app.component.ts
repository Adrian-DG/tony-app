import { Component, OnInit } from '@angular/core';
import { UserService } from './core/services/user.service';
import { Router } from '@angular/router';
import { AlertController, Platform } from '@ionic/angular';

interface BeforeInstallPromptEvent extends Event {
	prompt(): Promise<void>;
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.scss'],
	standalone: false,
	providers: [UserService],
})
export class AppComponent implements OnInit {
	private deferredPrompt: BeforeInstallPromptEvent | null = null;

	constructor(
		private router: Router,
		private userService: UserService,
		private alertController: AlertController,
		private platform: Platform,
	) {}

	async ngOnInit(): Promise<void> {
		if (await this.userService.isAuthenticated$()) {
			this.router.navigate(['home']);
		}

		// Listen for the PWA install prompt
		this.setupPWAInstallPrompt();
	}

	private setupPWAInstallPrompt(): void {
		// Only show on web platforms (including desktop, not native iOS/Android)
		if (!this.platform.is('capacitor')) {
			window.addEventListener('beforeinstallprompt', (e: Event) => {
				// Prevent the default browser prompt
				e.preventDefault();
				// Store the event for later use
				this.deferredPrompt = e as BeforeInstallPromptEvent;

				console.log('PWA install prompt available for:', {
					desktop: this.platform.is('desktop'),
					mobile: this.platform.is('mobile'),
					platform: this.platform.platforms(),
				});

				// Show custom install prompt on all web platforms (mobile and desktop)
				this.showInstallPrompt();
			});

			// Check if already installed
			if (window.matchMedia('(display-mode: standalone)').matches) {
				console.log('App is already running as installed PWA');
			}
		} else {
			console.log(
				'Running as native Capacitor app, PWA install not needed',
			);
		}
	}

	private async showInstallPrompt(): Promise<void> {
		const alert = await this.alertController.create({
			header: 'Instalar aplicación',
			message:
				'Instala esta aplicación en tu dispositivo para una mejor experiencia y acceso sin conexión.',
			buttons: [
				{
					text: 'Ahora no',
					role: 'cancel',
					handler: () => {
						this.deferredPrompt = null;
					},
				},
				{
					text: 'Instalar',
					handler: () => {
						this.installPWA();
					},
				},
			],
		});

		await alert.present();
	}

	private async installPWA(): Promise<void> {
		if (!this.deferredPrompt) {
			return;
		}

		// Show the install prompt
		this.deferredPrompt.prompt();

		// Wait for the user's response
		const { outcome } = await this.deferredPrompt.userChoice;

		if (outcome === 'accepted') {
			console.log('Usuario aceptó el aviso de instalación');
		} else {
			console.log('Usuario rechazó el aviso de instalación');
		}

		// Clear the deferred prompt
		this.deferredPrompt = null;
	}
}
