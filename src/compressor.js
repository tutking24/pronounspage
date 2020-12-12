export default class Compressor {
    static compress(data, base) {
        const dataFirst = data[0];
        const dataRest = data.slice(1);
        const baseFirst = base[0];
        const baseRest = base.slice(1);

        console.log(data, base);

        if (dataFirst !== baseFirst || dataRest.length !== baseRest.length) {
            throw 'Cannot compress data, format does not match the base';
        }

        const compressed = [];
        let stack = [];
        for (let i in dataRest) {
            if (dataRest[i] === baseRest[i]) {
                stack.push(dataRest[i]);
                continue;
            }

            if (stack.length) {
                compressed.push('!' + stack.length);
            }
            stack = [];
            compressed.push(dataRest[i]);
        }
        if (stack.length) {
            compressed.push('!' + stack.length);
        }

        return [dataFirst, ...compressed];
    }

    static uncompress(data, base) {
        if (!base) {
            return data;
        }

        const uncompressed = [];
        let i = 0;
        for (let piece of data) {
            const m = piece.match(/^!(\d+)$/)
            if (!m) {
                uncompressed.push(piece);
                i++;
                continue;
            }

            let skipped = parseInt(m[1]);
            while(skipped--) {
                uncompressed.push(base[i]);
                i++;
            }
        }

        return uncompressed;
    }
}
