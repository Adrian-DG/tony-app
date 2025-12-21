import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
@Injectable({
	providedIn: 'root',
})
export class StorageService {
	private storage!: Storage | null;

	constructor(private storageService: Storage) {
		this.init();
	}

	private async init() {
		const storage = await this.storageService.create();
		this.storage = storage;
	}

	public getStorage(): Storage | null {
		return this.storage;
	}

	public async setItem(key: string, value: any): Promise<void> {
		if (this.storage) {
			await this.storage.set(key, value);
		}
	}

	public async getItem(key: string): Promise<any> {
		if (this.storage) {
			return await this.storage.get(key);
		}
		return null;
	}

	public async removeItem(key: string): Promise<void> {
		if (this.storage) {
			await this.storage.remove(key);
		}
	}

	public async clear(): Promise<void> {
		if (this.storage) {
			await this.storage.clear();
		}
	}
}
