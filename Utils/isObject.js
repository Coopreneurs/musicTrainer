export default function isObject (any) { 
    return !!any && (any instanceof Object) && !(any instanceof Array); 
}