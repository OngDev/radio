export default class Queue {
    constructor() { this.q = []; }
    items() { return this.q; }
    enqueue(item) { this.q.push(item); }
    dequeue() { return this.q.shift(); }
    size() { return this.q.length; }
}