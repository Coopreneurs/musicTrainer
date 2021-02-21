export default function componentTypeSanitizer (types, fallback) { 
    return function (type, defaultType = fallback) {
        return  types.includes(type) ? 
                    type : 
                    defaultType; 
    }
}