import { isMethod, isObject } from './';  

export class SUBSCRIBER_NEEDS_TO_BE_METHOD_TYPE extends Error {

}

export default class Observable {

	subscribers = []; 

	state = null; 

	constructor (initialState = null) {
		this.state = initialState; 
		this.subscribe = this.subscribe.bind(this); 
		this.unsubscribe = this.unsubscribe.bind(this);
		this.setState = this.setState.bind(this); 
	}

	subscribe (fn) {
		if (!isMethod(fn))
			throw new SUBSCRIBER_NEEDS_TO_BE_METHOD_TYPE; 
        this.subscribers.push(fn); 
        return undefined; 
	}

	unsubscribe (fn) {
		if (!isMethod(fn))
			throw new SUBSCRIBER_NEEDS_TO_BE_METHOD_TYPE; 
		for (let i = this.subscribers.length - 1; i >=0 ; i--) 
			if (this.subscribers[i] === fn) {
				this.subscribers.splice(i, 1); 
				return true; 
			}
		return false; 
	}
	
	setState (stateOrGetState) {
        const newState = stateOrGetState?.apply instanceof Function ? 
            stateOrGetState.apply(this, [this.state]) : 
            stateOrGetState; 
        if (isObject(this.state)) { 
            this.state = Object.assign(
                {},
                this.state,
                newState
            );
        } else {
            this.state = newState; 
		}
		for (const subscriber of this.subscribers) 
			subscriber.call(this, this.state); 
		return this.state; 
	}
}