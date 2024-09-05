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
	
	const page = await browser.newPage();
	
	console.log('Page created successfully !');
	console.log('Loading...');

	console.time('request');
	
	await page.goto('https://solscan.io/token/EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', { waitUntil: 'networkidle2' });

	await page.waitForSelector('div#__next');
	
	const element = await page.$('#__next div.flex.flex-col.gap-0.items-stretch.justify-start.h-full.min-h-screen div.rounded-2xl.shadow-m.bg-neutral0.p-4.lg.h-full');
	const text = await page.evaluate(el => el.innerText, element);
	
	const textArr = text.split('\n');
	// console.log(textArr);
	
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
	
	await browser.close();
	
	console.timeEnd('request');
	app.get('/api', (req, res) => {
		res.json(parsedJson);
	})
	
	app.listen(port, () => {
		console.log('Server running on port:', port);
	});
})();
