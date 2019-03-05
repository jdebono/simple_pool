# Simple Pool
A Simple Generic Pool in Typescript.

Usage:
```
class SDK {
    private msg: string;
    constructor(msg: string) {
        this.msg = msg;
    }

    test() {
        console.log(this.msg);
    }

    testDistory() {
        this.msg = "";
        console.log("Bye Bye");
    }
}

class SDKFactory implements PoolFactory<SDK> {
    private sdk: SDK;
    public async create(): Promise<SDK> {
        this.sdk = new SDK("My cool SDK Object");
        console.log("Create...");
        return this.sdk;
    }

    public async release(obj: SDK): Promise<void> {
        this.sdk.testDistory();
    }
}

/// Testing Pool
testPool();

async function testPool() {
    const test = new Pool(new SDKFactory, { min: 3, max: 4 });

    console.log("Pool Count: ", test.size);
    const t1 = await test.get();
    const t2 = await test.get();
    const t3 = await test.get();
    const t4 = await test.get();
    const t5 = await test.get();
    const t6 = await test.get();
    console.log("Pool Count: ", test.size);

    test.release(t1);
    test.release(t2);
    test.release(t3);
    test.release(t4);
    test.release(t5);
    test.release(t6);

    console.log("Pool Count: ", test.size);

    test.drain();
    console.log("Pool Count: ", test.size);
}
```
