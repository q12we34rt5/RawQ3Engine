export class ShortStringMapping {

    src = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~";
    string_length = 2;

    str_map = new Map();

    #str_array_temp = null;

    constructor(string_length = 2, src = null) {
        this.string_length = string_length;
        this.src = src || this.src;
        this.#str_array_temp = Array(this.string_length).fill(0);
    }

    numberToString(number) {
        for (let i = 0; i < this.string_length; i++) {
            this.#str_array_temp[i] = this.src[number % this.src.length];
            number = number / this.src.length | 0;
        }
        return this.#str_array_temp.join("");
    }

    map(string) {
        const str_map = this.str_map;
        let result;
        if (!str_map.has(string)) {
            const number = str_map.size;
            const str = this.numberToString(number);
            str_map.set(string, {
                number: number,
                string: str
            });
            result = str;
        } else {
            result = str_map.get(string).string;
        }
        return result;
    }

}

export class UniqueStringGenerator {

    strmapper = null;

    optimizer = new Map();

    constructor(string_length = 2, src = null) {
        this.strmapper = new ShortStringMapping(string_length, src);
    }

    fromString(string) {
        return this.strmapper.map(string);
    }

    #str_array_temp = Array(16);

    fromArray(array) {
        const value = this.optimizer.get(array);
        if (value !== undefined) {
            return value;
        } else {
            this.#str_array_temp.length = 0;
            for (let i = 0; i < array.length; i++) {
                const str = this.strmapper.map(array[i]);
                this.#str_array_temp.push(str);
            }
            const value = this.#str_array_temp.join("");
            this.optimizer.set(array, value);
            return value;
        }
    }

}
