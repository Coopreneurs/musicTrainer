import AsyncStorage from '@react-native-async-storage/async-storage';
import { uuid } from './Utils'; 

const HISTORY_KEY_PREFIX = '@history_'; 

import TRAININGS from './Trainings'; 

async function storeData (key, value) {
	try {
		const jsonValue = JSON.stringify(value)
		await AsyncStorage.setItem(key, jsonValue); 
		return true; 
	} catch (error) {
		throw new Error(`error while saving: ${error}`); 
	}
}

async function deleteData (key) {
	try {
		return await AsyncStorage.removeItem(key);
	} catch (error) {
		throw new Error(`error while deleting: ${error}`); 
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

async function getAllDataKeys () {
	try {
		const allKeys = await AsyncStorage.getAllKeys(); 
		return allKeys != null ? 
			allKeys : 
			[];
	} catch (error) {
		throw new Error(`error while retrieving: ${error}`); 
	}	
}

async function clearTrainings (callback) {
	for (const key of await getAllDataKeys())
		if (key.startsWith(HISTORY_KEY_PREFIX))
			await deleteData(key); 
	callback();
}

async function loadTrainings () {
	//console.log('clearing Storage')
	//await clearTrainings(); 
	//console.log('Storage cleared')
	//return; 
	const allKeys = await getAllDataKeys(); 
	const historyKeyIds = allKeys.filter(
		key => key.startsWith(HISTORY_KEY_PREFIX)
	); 
	const history = []; 
	for (const historyKeyId of historyKeyIds) 
		history.push(
			await getData(historyKeyId)
		); 
	const historyObjects = history.map(
		object => TrainingData.fromObject(object)
	).sort(
		(a, b) => a.startDate < b.startDate
	); 
	return historyObjects; 
}


async function saveTraining (training) {
	void await storeData(
		HISTORY_KEY_PREFIX + uuid(), 
		training.toObject()
	); 
	return true; 
}

function getTrainingType (typeName) {
	if (![null, undefined].includes(typeName)) {
		const strTypeName = String(typeName).toUpperCase(); 
		for (const TRAINING of TRAININGS) 
			if (TRAINING.type.toUpperCase() === strTypeName) 
				return TRAINING; 
	}
	throw new Error(`${typeName} is an invalid training type`); 
}

class TrainingData {

	static fromObject (object) {
		const 	{
					date, 
					type, 
					totalRepetitions,
					score,
					duration, 
				} = object; 
		return new this(
			new Date(date), 
			getTrainingType(type), 
			totalRepetitions,
			score,
			duration 
		); 
	}

	constructor (date, exercise, totalRepetitions, score, duration) {
        this.date = date; 
        this.type = exercise;
        this.totalRepetitions = totalRepetitions; 
        this.score = score;
        this.duration = duration; 
	}

	toObject () {
		const 	{
					date, 
					type, 
					totalRepetitions,
					score,
					duration, 
				} = this; 
		return {
			date, 
			type: type.type, 
			totalRepetitions,
			score,
			duration 
		}
	}
}


export {
	saveTraining, 
	loadTrainings,
    TrainingData,
	clearTrainings
}