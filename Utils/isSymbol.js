export default function isSymbol (any) { 
    return  typeof any === 'symbol' || 
            typeof any === 'object' && 
            Object.prototype.toString.call(any) === '[object Symbol]';
}