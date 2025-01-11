import { homedir } from 'os';
import { join } from 'path';
import { promises } from 'fs';

const filePath = join(homedir(), 'weather-data.json');
const TOKEN_DICTIONARY = {
	token: 'token',
	language: 'ru',
	city: []
}

const saveKeyValue = async (key, value) => {
	let data = {};
	data['language'] = TOKEN_DICTIONARY.language;
	if (await isExist(filePath)) {
		const file = await promises.readFile(filePath);
		data = JSON.parse(file);
	}

	if (Array.isArray(TOKEN_DICTIONARY[key])) {
		if (!Array.isArray(data[key])) {
			data[key] = [];
		}
		data[key].push(value);
	} else {
		data[key] = value;
	}
	await promises.writeFile(filePath, JSON.stringify(data));
};

const clearData = async (key) => {

	if (await isExist(filePath)) {
		const file = await promises.readFile(filePath);
		const data = JSON.parse(file);
		if (data[key]) {
			delete data[key];
			await promises.writeFile(filePath, JSON.stringify(data));
		}
	}
}

const getKeyValue = async (key) => {
	if (await isExist(filePath)) {
		const file = await promises.readFile(filePath);
		const data = JSON.parse(file);
		return data[key];
	}
	return undefined;
}

const isExist = async (path) => {
	try {
		await promises.stat(path);
		return true;
	} catch (e) {
		return false
	}
}
const languageCodes = new Set([
	"sq", "af", "ar", "az", "eu", "be", "bg", "ca", "zh_cn", "zh_tw",
	"hr", "cz", "da", "nl", "en", "fi", "fr", "gl", "de", "el", "he",
	"hi", "hu", "is", "id", "it", "ja", "kr", "ku", "la", "lt", "mk",
	"no", "fa", "pl", "pt", "pt_br", "ro", "ru", "sr", "sk", "sl",
	"sp", "es", "sv", "se", "th", "tr", "ua", "uk", "vi", "zu"
]);
const languageIsExist = (language) => {
	return languageCodes.has(language);
};

export { saveKeyValue, getKeyValue, clearData, TOKEN_DICTIONARY, languageIsExist, languageCodes };