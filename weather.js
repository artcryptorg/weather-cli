#!/usr/bin/env node
import { getArgs } from './helpers/args.js'
const initCLI = () => {
	const args = getArgs(process.argv)
	console.log(args);
	if (args.h) {
		//выводим хелп
	}
	if (args.s) {
		//сохранить город
	}
	if (args.t) {
		// сохранить токен
	}
	// вывести погоду
};

initCLI();
