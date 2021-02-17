import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = '@history'; 

async function storeData (key, value) {
	try {
		const jsonValue = JSON.stringify(value)
		await AsyncStorage.setItem(key, jsonValue); 
		return true; 
	} catch (error) {
		throw new Error(`error while saving: ${error}`); 
	}
}

async function getData (key) {
	try {
		const jsonValue = await AsyncStorage.getItem(key); 
		return jsonValue != null ? 
			JSON.parse(jsonValue) : 
			null;
	} catch (error) {
		throw new Error(`error while retrieving: ${error}`); 
	}
}

async function loadTrainings () {
	const history = await getData(HISTORY_KEY);  
	if ([null, undefined].includes(history))
		return []; 
	return history.map(object => TrainingData.fromObject(object)); 
}


async function saveTraining (training) {
	const history = await loadTrainings(); 
	history.push(training); 
	storeData(
		HISTORY_KEY, 
		history.map(
			training => training.toObject()
		)
	); 
	return true; 
}

class TrainingData {

	static fromObject (object) {
		const 	{
					date, 
					type, 
					totalRepetitions,
					score,
					timeNeeded, 
				} = object; 
		return new this(
			date, 
			type, 
			totalRepetitions,
			score,
			timeNeeded 
		); 
	}

	constructor (date, exercise, totalRepetitions, score, timeNeeded) {
        this.date = date
        this.type = exercise
        this.totalRepetitions = totalRepetitions
        this.score = score
        this.timeNeeded = timeNeeded
	}

	toObject () {
		const 	{
					date, 
					type, 
					totalRepetitions,
					score,
					timeNeeded, 
				} = this; 
		return {
			date, 
			type, 
			totalRepetitions,
			score,
			timeNeeded 
		}
	}
}


export {
	saveTraining, 
	loadTrainings,
    TrainingData
}