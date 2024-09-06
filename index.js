const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

(async () => {
	const browser = await puppeteer.launch({
		// args: ['--no-sandbox', '--disable-setuid-sandbox'],
		headless: true,
		// executablePath: process.env.CHROME_BIN || null
	});

	/**
	 * Market Overview
	 */
	
	const page = await browser.newPage();
	console.log('Market Overview Page created successfully!');

	const baseURL = 'https://solscan.io/token/63LfDmNb3MQ8mw9MtZ2To9bEA2M71kZUUGq5tiJxcqj9';
	
	
	console.time('request');
	
	console.log('Loading', baseURL, '...');
	await page.goto(baseURL, { waitUntil: 'networkidle2' });
	console.log(baseURL, 'successfully loaded!');

	await page.waitForSelector('#__next');
	
	const element = await page.$('#__next div.flex.flex-col.gap-0.items-stretch.justify-start.h-full.min-h-screen div.rounded-2xl.shadow-m.bg-neutral0.p-4.lg.h-full');
	
	const text = await page.evaluate(el => el.innerText, element);
	// console.log(elements1);
	
	const textArr = text.split('\n');
	// const textArr1 = text1.split('\n');
	// console.log(text1);
	
	const jsonStr = `{
		"${textArr[0]}": {
			"${textArr[1]}": "${textArr[2]}",
			"${textArr[4]}": "${textArr[5]}",
			"${textArr[6]}": "${textArr[7]}",
			"${textArr[8]}": "${textArr[9]}",
			"Price 24h Percent Change":  "${textArr[3]}"
		}
	}`;
	
	const parsedJson = JSON.parse(jsonStr);

	/**
	 * Holders page
	*/
	console.log('Creating holders page ...')

	const holdersPage = await browser.newPage();
	const totalHoldersPagesNb = 100;
	const minPerc = 0.1;
	console.log('Holders page created successfully!');

	let shouldStop = false;
	let qualifiedPerc = [];
	console.log('Looking for qualified percentage ...');
	for (let i = 0; i < totalHoldersPagesNb; i++) {
		await holdersPage.goto(`${baseURL}?page=${i+1}#holders`, { waitUntil: 'networkidle2' });
		await holdersPage.waitForSelector('#__next');

		const hTexts = await holdersPage.$$eval('#__next #account-tabs table tbody tr td', els => els.map(el => el.innerText));
		// console.log(hTexts);
		for (let j = 0; j < 10; j++) {
			const holderArr = hTexts.slice((j * 6), (j * 6) + 6);
			if (parseFloat(holderArr[4]) < minPerc) {
				// console.log(holderArr)
				shouldStop = true;
				break
			}
			qualifiedPerc = holderArr;
		}
		if (shouldStop) {
			break;
		}
	}

	console.log(qualifiedPerc);
	const qPercJsonStr = `
		{
			"ID": "${qualifiedPerc[0]}",
			"Account": "${qualifiedPerc[1]}",
			"Token Account": "${qualifiedPerc[2]}",
			"Percentage": "${qualifiedPerc[4]}"
		}
	`;
	const qPercJson = JSON.parse(qPercJsonStr);
	
	await browser.close();
	
	console.timeEnd('request');

	app.get('/api/market-overview', (req, res) => {
		res.json(parsedJson);
	});
	app.get('/api/holders/last-qualified', (req, res) => {
		res.json(qPercJson);
	});
	
	app.listen(port, () => {
		console.log('Server running on port:', port);
	});
})();
