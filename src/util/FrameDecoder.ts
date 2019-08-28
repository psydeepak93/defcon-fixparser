import { Transform, TransformCallback, TransformOptions } from 'stream';

export default class FrameDecoder extends Transform {
    public data: string | null;

    constructor(opts?: TransformOptions) {
        super(opts);
        this.data = '';
    }

    public _transform(
        chunk: string,
        encoding: string,
        callback: TransformCallback,
    ) {
        const chunks = (this.data + chunk).split(/(8=.+?\x0110=\d\d\d\x01)/g);
        for (let i = 0; i < chunks.length - 1; i++) {
            this.push(chunks[i]);
        }
        this.data = chunks[chunks.length - 1];
        callback();
    }

    public destroy() {
        this.data = null;
    }
}
