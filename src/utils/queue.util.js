export default class Queue {
    constructor() { this.q = []; }
    items() { return this.q; }
    enqueue(item) { this.q.push(item); }
    dequeue() { return this.q.shift(); }
    size() { return this.q.length; }
    deleteVideo(id) { this.q = this.q.filter((video) => video.id !== id) }
    setItems(items) {this.q = items;}
}