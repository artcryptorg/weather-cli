#!/usr/bin/env node
import { getArgs } from './helpers/args.js';
import { getWeather, getIcon } from './services/api.service.js';
import { printHelp, printSuccess, printError, printWeather } from './services/log.service.js';
import { saveKeyValue, TOKEN_DICTIONARY, getKeyValue, clearData, languageCodes, languageIsExist } from './services/storage.service.js';

const saveToken = async (token) => {
	if (!token.length) {
		printError('Не передан token');
		return;
	}
	try {
		await saveKeyValue(TOKEN_DICTIONARY.token, token);
		printSuccess('Токен сохранён');
	} catch (e) {
		printError(e.message);
	}
}

const saveCity = async (city) => {
	if (!city.length) {
		printError('Не передан город');
		return;
	}
	try {
		await saveKeyValue('city', city);
		printSuccess('Город сохранён');
	} catch (e) {
		printError(e.message);
	}
}

const saveLanguage = async (language) => {
	if (!language || !language.length) {
		printError('Не передан язык');
		return;
	}
	try {
		if (languageIsExist(language)) {
			await saveKeyValue('language', language);
			printSuccess('Язык сохранён');
		} else {
			const supportedLanguages = [...languageCodes].join(", ");
			printError(`Язык "${language}" не поддерживается. Поддерживаемые языки: ${supportedLanguages}`);
		}
	} catch (e) {
		printError(e.message);
	}
};

const clearCity = async () => {
	try {
		await clearData('city');
		printSuccess('очишен массив городов');
	} catch (e) {
		printError(e.message);
	}
}

const getForcast = async () => {
	try {
		const cities = process.env.CITY ? [process.env.CITY] : await getKeyValue('city');
		console.log(cities)
		if (!cities || cities.length === 0) {
			printError('Список городов пуст. Добавьте хотя бы один город.');
			return;
		}
		const lang = await getKeyValue('language');
		console.log(lang)
		cities.forEach(async (city) => {
			try {
				const weather = await getWeather(city, lang);
				printWeather(weather, getIcon(weather.weather[0].icon));
			} catch (e) {
				if (e?.response?.status === 404) {
					printError(`Неверно указан город: ${city}`);
				} else if (e?.response?.status === 401) {
					printError('Неверно указан токен.');
				} else {
					printError(`Ошибка для города ${city}: ${e.message}`);
				}
			}
		});
	} catch (e) {
		printError(e.message);
	}
};

const initCLI = () => {
	const args = getArgs(process.argv);
	if (args.h) {
		return printHelp();
	}
	if (args.s) {
		return saveCity(args.s);
	}
	if (args.t) {
		return saveToken(args.t);
	}
	if (args.l) {
		return saveLanguage(args.l);
	}
	if (args.clear) {
		return clearCity();
	}
	return getForcast();
};

initCLI();