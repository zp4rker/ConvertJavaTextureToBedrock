import {addAdditionalConverters, getConverters} from "./converter";
import {AbstractInput} from "./input";
import {AbstractLog} from "./log";
import {AbstractOutput} from "./output";
import {Options} from "./Options";

/**
 * Class ConvertJavaTextureToBedrock
 */
class ConvertJavaTextureToBedrock {
    /**
     * ConvertJavaTextureToBedrock constructor
     *
     * @param {AbstractInput} input
     * @param {AbstractOutput} output
     * @param {AbstractLog} log
     * @param {Options} options
     */
    constructor(input, output, log, options = {}) {
        /**
         * @type {AbstractInput}
         *
         * @protected
         */
        this.input = input;
        /**
         * @type {AbstractOutput}
         *
         * @protected
         */
        this.output = output;
        /**
         * @type {AbstractLog}
         *
         * @protected
         */
        this.log = log;
        /**
         * @type {Options}
         *
         * @protected
         */
        this.options = {
            ...new Options(),
            ...options
        };
    }

    /**
     * @returns {Promise<*>}
     */
    async convert() {
        if (this.options.experimental) {
            this.log.warn(`EXPERIMENTAL FEATURES ENABLED!`)
        }

        await this.output._init(this.input, this.log, this.options);

        for await (const entry of this.input.getEntries()) {
            await entry._init(this.log, this.options);

            await this.output.applyInputEntry(entry);
        }

        for await (const converter of getConverters()) {
            await converter._init(this.input, this.output, this.log, this.options);

            await addAdditionalConverters(...await converter.convert());
        }

        return await this.output.generate();
    }
}

export default ConvertJavaTextureToBedrock;

//export {AbstractConverter, addAdditionalConverters} from "./converter";
export {AbstractInput, ArrayInput, Input} from "./input";
export {
    AbstractInputEntry, BufferInputEntry, FileInputEntry, LocalFileInputEntry, LocalFolderInputEntry
} from "./input";
export {AbstractLog, ConsoleLog, SilentLog} from "./log";
export {
    AbstractOutput,
    ArrayBufferOutput,
    BlobOutput,
    BufferOutput,
    FileOutput,
    LocalFileOutput,
    LocalFolderOutput,
    Uint8ArrayOutput
} from "./output";
