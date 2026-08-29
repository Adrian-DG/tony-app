import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
	providedIn: 'root',
})
export class StorageService {
	private storage: Storage | null = null;
	/** Resolves once the underlying storage driver is ready. */
	private readonly _ready: Promise<void>;

	constructor(private storageService: Storage) {
		this._ready = this.init();
	}

	private async init(): Promise<void> {
		this.storage = await this.storageService.create();
	}

	public getStorage(): Storage | null {
		return this.storage;
	}

	public async setItem(key: string, value: any): Promise<void> {
		await this._ready;
		await this.storage!.set(key, value);
	}

	public async getItem(key: string): Promise<string | null> {
		await this._ready;
		return this.storage!.get(key);
	}

	public async removeItem(key: string): Promise<void> {
		await this._ready;
		await this.storage!.remove(key);
	}

	public async clear(): Promise<void> {
		await this._ready;
		await this.storage!.clear();
	}
}
