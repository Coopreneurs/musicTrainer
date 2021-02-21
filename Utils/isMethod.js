export default function isMethod (any) { 
    return !!any && 
        (any?.apply instanceof Function) && 
        (any?.call instanceof Function) && 
        (any?.bind instanceof Function); 
}