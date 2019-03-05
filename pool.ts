/** Pool Options */
export interface PoolOptions {
    /** Minimum number of items. */
    min: number;
    /** Maximum number of items. */
    max: number;
}

export interface PoolFactory<T> {
    /** Create an Object */
    create(): Promise<T>;
    /** Release an Object to be pushed to the pool */
    release?(obj: T): void;
    /** Drain an Object from the pool */
    drain?(obj: T): Promise<void>;
}

/** Pool Class */
export default class Pool<T> {
    private pool: Array<T>;
    private factory: PoolFactory<T>;
    private options: PoolOptions;

    /**
     * Generate an Object pool with a specified `factory` and `options`.
     * @param factory Object Factory
     * @param options Minimum and Maximum number of items that can exist at the same time.
     */
    constructor(factory: PoolFactory<T>, options: PoolOptions = { min: 0, max: 10 }) {
        this.pool = [];
        this.factory = factory;
        this.options = options;

        this.initPool();
    }

    private async initPool() {
        for (let i = 0; i < this.options.min; i++) {
            this.pool.push(await this.factory.create());
        }
    }

    /** Create or get an Object from the pool */
    public async get(): Promise<T> {
        if (this.pool.length) {
            return this.pool.splice(0, 1)[0];
        }
        return this.factory.create();
    }

    /** Add the Object to the pool */
    public release(obj: T): void {
        if (this.factory.release) { this.factory.release(obj); }
        if (this.size < this.options.max) {
            this.pool.push(obj);
        }
    }

    /** Drain all the pool Objects */
    public async drain(): Promise<void> {
        while (this.pool.length) {
            const obj = this.pool.pop();
            if (obj && this.factory.drain) { await this.factory.drain(obj); }
        }
    }

    /** The initial pool size. */
    get minSize(): number {
        return this.options.min;
    }

    /** The Maximum pool size. */
    get maxSize(): number {
        return this.options.max;
    }

    /** Current number of Objects in pool. */
    get size(): number {
        return this.pool ? this.pool.length : 0;
    }
}
