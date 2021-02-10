import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
const STORAGE_KEY = 'ibot_user';

@Injectable()
export class LocalStorageService {
  anotherTodolist = [];
  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {}

  public storeOnLocalStorage(taskTitle: string): void {
    // get array of tasks from local storage
    const currentTodoList = this.storage.get(STORAGE_KEY) || [];
    // push new task to array
    currentTodoList.push({
      title: taskTitle,
      isChecked: false,
    });
    // insert updated array to local storage
    this.storage.set(STORAGE_KEY, currentTodoList);
    console.log(this.storage.get(STORAGE_KEY) || 'LocaL storage is empty');
  }

  public setItem(name: string, value: string): void {
    this.storage.set(name, value);
  }

  public getItem(name: string): string {
    return this.storage.get(name) || '';
  }

  public clear(): void {
    this.storage.clear();
  }
}
