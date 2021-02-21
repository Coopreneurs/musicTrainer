import { hexToName, nameToHex } from './namedColors'; 

const   parser = ([r, g, b, a]) => ({
            r: parseInt(r), 
            g: parseInt(g), 
            b: parseInt(b), 
            a: [null, undefined].includes(a) ? 
                null : 
                parseFloat(a)
        }), 
        shortHexParser = ([r, g, b, a]) => ({
            r: parseInt(r.repeat(2), 16), 
            g: parseInt(g.repeat(2), 16), 
            b: parseInt(b.repeat(2), 16), 
            a: [null, undefined].includes(a) ? 
                null : 
                parseInt(a.repeat(2), 16) / 255
        }), 
        hexParser = ([r, g, b, a]) => ({
            r: parseInt(r, 16), 
            g: parseInt(g, 16), 
            b: parseInt(b, 16), 
            a: [null, undefined].includes(a) ? 
                null : 
                parseInt(a, 16) / 255
        }), 
        isShortable = (...bytes) =>
            bytes.reduce(
                (isShortable, value) => (isShortable && (value % 17 === 0)), 
                true
            ), 
        byteToHex = (byte, short = false) => {
            if (short && !isShortable(byte)) 
                throw NOT_SHORTABLE_ERROR; 
            const hex = byte.toString(16).toUpperCase(); 
            return short ? hex[0] : hex.padStart(2, 0); 
        },  
        NOT_SHORTABLE_ERROR = Error, 
        CONTAINS_NON_FF_ALPHA_CHANNEL_ERROR = Error, 
        regExpToString = (regexp) => regexp.toString().match(/^\/(.*)\/[gmiyus]*$/mi)[1], 
        oneHex = /[0-9a-f]/, 
        twoHex = /[0-9a-f]{2}/, 
        oneOrTwoHex = /^\s*(?:[0-9a-f]{1,2})\s*$/mi,
        hex3 = {
            pattern: new RegExp(`^#${`(${regExpToString(oneHex)})`.repeat(3)}$`, 'mi'), 
            parser: shortHexParser, 
            generator: (r, g, b, a) => {
                if (a !== 1)
                    throw new CONTAINS_NON_FF_ALPHA_CHANNEL_ERROR; 
                return `#${byteToHex(r, true)}${byteToHex(g, true)}${byteToHex(b, true)}`; 
            }
        }, 
        hex4 = {
            pattern: new RegExp(`^#${`(${regExpToString(oneHex)})`.repeat(4)}$`, 'mi'), 
            parser: shortHexParser, 
            generator: (r, g, b, a) => `#${byteToHex(r, true)}${byteToHex(g, true)}${byteToHex(b, true)}${byteToHex(Math.round(a * 255), true)}` 
        }, 
        hex6 = {
            pattern: new RegExp(`^#${`(${regExpToString(twoHex)})`.repeat(3)}$`, 'mi'), 
            parser: hexParser, 
            generator: (r, g, b, a) => {
                if (a !== 1)
                    throw new CONTAINS_NON_FF_ALPHA_CHANNEL_ERROR; 
                return `#${byteToHex(r)}${byteToHex(g)}${byteToHex(b)}`;
            }
        }, 
        hex8 = {
            pattern: new RegExp(`^#${`(${regExpToString(twoHex)})`.repeat(4)}$`, 'mi'), 
            parser: hexParser, 
            generator: (r, g, b, a) => `#${byteToHex(r)}${byteToHex(g)}${byteToHex(b)}${byteToHex(Math.round(a * 255))}`, 
        }, 
        byte = /(?:[0]{0,2}[0-9])|(?:[0]{0,1}[1-9][0-9])|(?:1[0-9]{2})|(?:2[0-4][0-9])|(?:25[0-5])/, 
        fraction = /(?:0*)((?:0?(?:\.\d*)?)|(?:1(?:\.0*)?))/, 
        rgb = {
            pattern: new RegExp(`^\\s*rgb\\s*\\(\\s*${Array(3).fill(`(${regExpToString(byte)})`).join(`\\s*,\\s*`)}\\s*\\)\\s*[;]?\\s*$`, 'mi'), 
            parser, 
            generator: (r, g, b, a) => {
                if (a !== 1)
                    throw new CONTAINS_NON_FF_ALPHA_CHANNEL_ERROR;
                return `rgb(${r}, ${g}, ${b})`; 
            }
        },
        rgba = {
            pattern: new RegExp(`^\\s*rgba\\s*\\(\\s*${Array(3).fill(`(${regExpToString(byte)})`).concat([`(${regExpToString(fraction)})`]).join(`\\s*,\\s*`)}\\s*\\)\\s*[;]?\\s*$`, 'mi'), 
            parser, 
            generator: (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`
        }, 
        name = {
            pattern: /^\s*([a-z0-9]+)\s*$/mi, 
            parser: ([value]) => hex8.parser(
                getMatches(
                    nameToHex(value).match(hex8.pattern)
                )
            ),  
            generator: (r, g, b, a) => hexToName(hex8.generator(r, g, b, a))
        }, 
        int = {
            pattern: null, 
            parser: (value) => {
                if (!Number.isInteger(value) || value < 0 || value > 0xFFFFFFFF)
                    throw new Error(`Integer 0x${value.toString(16)} out of bounds (0x00000000..0xFFFFFFFF)`); 
                return hex8.parser(`#${value.toString(16).toUpperCase()}`)
            }, 
            generator: (r, g, b, a) => parseInt(`${byteToHex(r)}${byteToHex(g)}${byteToHex(b)}${byteToHex(Math.floor(a*256))}`, 16)
        }, 
        getMatches = (array) => {
            if (!Array.isArray(array))
                return null; 
            const [_, ...rest] = array; 
            return rest; 
        }, 
        parseArgs = (...args) => {
            const   [vr, vg, vb, va] = args, 
                    byteRegExp = byte, 
                    fractionRegExp = fraction, 
                    bytes = [vr, vg, vb], 
                    [r, g, b] = bytes.map(
                        (byte, argIndex) => {
                            if (Number.isInteger(byte) && byte >= 0 && byte <= 255)
                                return byte; 
                            else if (String(byte).match(byteRegExp))
                                return parseInt(byte); 
                            else if (byte.match(oneOrTwoHex))
                                return parseInt(byte, 16);  
                            else 
                                throw new Error(`Argument ${argIndex} with value '${byte}' is not a valid Byte.`); 
                        } 
                    ), 
                    fractions = [va], 
                    [a] = fractions.map(
                        (fraction, argIndex) => {
                            if ([null, undefined].includes(fraction))
                                return null; 
                            else if (typeof fraction == 'number' && fraction >= 0 && fraction <= 1)
                                return fraction; 
                            else if (String(fraction).match(fractionRegExp))
                                return parseFloat(fraction); 
                            else 
                            throw new Error(`Argument ${bytes.length + argIndex} with value '${byte}' is not a valid Fraction.`); 
                        }
                    ); 
            return { r, g, b, a }; 
        }, 
        formats = { hex8, hex6, hex4, hex3, rgba, rgb, name, int }, 
        V_R = Symbol(), 
        V_G = Symbol(), 
        V_B = Symbol(), 
        V_A = Symbol(), 
        V_SHORTABLE = Symbol(), 
        V_RAW = Symbol(), 
        D_RAW_FORMAT = Symbol(); 
    

export default class Color {

    constructor (...args) { 
        numArgs: switch (args.length) {
            case 1: 
                const [arg] = args; 
                nextFormat: for (const format of Object.values(formats)) {
                    const { pattern, parser } = format; 
                    const value = pattern ? 
                        getMatches(String(arg).match(pattern)) : 
                        arg; 
                    if ([null, undefined].includes(value))
                        continue nextFormat; 
                    try {
                        const {r, g, b, a} = parser(value); 
                        this[V_R] = r; 
                        this[V_G] = g; 
                        this[V_B] = b; 
                        this[V_A] = a; 
                        this[V_SHORTABLE] = isShortable(r, g, b, a); 
                        this[V_RAW] = arg; 
                        this[D_RAW_FORMAT] = format; 
                        break numArgs; 
                    } catch (error) {
                        continue nextFormat; 
                    } 
                }
                throw new Error(`'${arg}' is not a valid color value. Valid patterns: '#123', '#1234', '#123456', '#12345678', 'rgb(0,0,.0)', 'rgba(0,0,0,.0)', 0xFFFFFFFF`); 
            case 3: 
            case 4: 
                try {
                    const [r, g, b, a] = parseArgs(args); 
                    this[V_R] = r; 
                    this[V_G] = g; 
                    this[V_B] = b; 
                    this[V_A] = a; 
                    this[V_SHORTABLE] = isShortable(r, g, b, a); 
                    this[V_RAW] = null; 
                    this[D_RAW_FORMAT] = null; 
                    break numArgs; 
                } catch (error) {
                    throw error; 
                }
            default:
                throw new Error(`Unsupported argument composition. Allowed arguments: (0xFFFFFFFF), ('#FFF'), ('#FFFF'), ('#FFFFFF'), ('#FFFFFFFF'), ('rgb(0,0,0)'), ('rgba(0,0,0,.0)'), (255,255,255), (255,255,255,1.0), (FF, FF, FF), (FF, FF, FF, FF)`) 
        } 

        for (const [ format, { generator} ] of Object.entries(formats)) 
            Object.defineProperty(
                this, 
                format, 
                {
                    get: (function () {
                        const {r, g, b, a} = this; 
                        try {
                            return generator(r, g, b, a);
                        } catch (error) {
                            throw new Error(`Color (${r}, ${g}, ${b}, ${a}) cannot be converted to format '${format}': ${error.message}`); 
                        }
                    }).bind(this) 
                }
            );
    }

    getRaw (formatted = false) {
        return !formatted ? 
            this[V_RAW] : 
            this[D_RAW_FORMAT]?.generator(
                this.r, 
                this.g, 
                this.b, 
                this.a 
            ) || null;
    }

    get raw () {
        return this.getRaw(true); 
    }

    get red () {
        return this[V_R];  
    }
        
    get r () {
        return this.red; 
    } 

    get rh () {
        return byteToHex(this.red); 
    } 

    get green () {
        return this[V_G];  
    }
        
    get g () {
        return this.green; 
    } 

    get gh () {
        return byteToHex(this.green); 
    } 

    get blue () {
        return this[V_B];  
    }
        
    get b () {
        return this.blue; 
    } 

    get bh () {
        return byteToHex(this.blue); 
    } 

    get alpha () {
        return this[V_A] !== null ? this[V_A] : 1.0; 
    }

    get a () {
        return this.alpha; 
    }

    get ah () {
        return byteToHex(Math.floor(this.alpha * 256)); 
    }

    get hasAlpha () {
        return this[V_A] !== null; 
    }

    get isShortable () {
        return this[V_SHORTABLE]; 
    }

}