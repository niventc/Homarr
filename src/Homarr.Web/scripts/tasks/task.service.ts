﻿/// <reference path="../../typings/main.d.ts" />

import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Rx';
import {Observer} from 'rxjs/Rx';

@Injectable()
export class TaskService {

    observableTasks: Observable<string[]>;
    private _tasksObserver: Observer<string[]>;
    private _tasks: string[];

    constructor() {
        this.observableTasks = new Observable(observer => { this._tasksObserver = observer; this.ngOnInit(); }).share();
        console.log(this._tasksObserver);
        console.log(this.observableTasks);

        //this.ngOnInit();
    }

    ngOnInit() {
        console.log(this._tasksObserver);
        var tasksJson = localStorage.getItem("tasks");
        console.log("Found localStorage: ");
        console.log(tasksJson);
        this._tasks = JSON.parse(tasksJson) || [];
        console.log(this._tasks);
        this._tasksObserver.next(this._tasks);        
    }
   
    public addTask(task: string): Observable<boolean> {
        if (!task || task.length === 0) {
            return Observable.of(false);
        }

        this._tasks.push(task);
        this._tasksObserver.next(this._tasks);     

        return this.save();
    }

    public deleteTask(task: string): Observable<boolean> {
        if (!task || task.length === 0) {
            return Observable.of(false);
        }

        this._tasks = _(this._tasks).without(task);
        this._tasksObserver.next(this._tasks);

        return this.save();
    }

    public getTasks(): Observable<string[]> {
        return this.observableTasks;
    }

    private save(): Observable<boolean> {
        localStorage.setItem("tasks", JSON.stringify(this._tasks))
        
        return Observable.of(true);
    }

}