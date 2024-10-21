import { assertEquals } from '@std/assert';
Deno.test('OCR - FormData', async () => {
	const formData = new FormData();
	const imageFile = await Deno.readFile('./test.png'); // Substitua por sua imagem de teste
	formData.append('image', new Blob([imageFile]));
	formData.append('lang', 'por');

	const response = await fetch('http://localhost:8000/ocr', {
		method: 'POST',
		body: formData,
	});

	const result = await response.json();
	console.log('OCR Result:', result);
	assertEquals(response.status, 200);
	assertEquals(typeof result.text, 'string');
});

Deno.test('OCR - JSON Body', async () => {
	const imageFile = await Deno.readFile('./test.png'); // Substitua por sua imagem de teste
	const base64Image = btoa(String.fromCharCode(...imageFile));

	const response = await fetch('http://localhost:8000/ocr', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ image: base64Image, lang: 'por' }),
	});

	const result = await response.json();
	console.log('OCR Result:', result);
	assertEquals(response.status, 200);
	assertEquals(typeof result.text, 'string');
});

Deno.test('OCR - Invalid content', async () => {
	const imageFile = await Deno.readFile('./test.png'); // Substitua por sua imagem de teste
	const base64Image = btoa(String.fromCharCode(...imageFile));

	const response = await fetch('http://localhost:8000/ocr', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/xml',
		},
		body: JSON.stringify({ image: base64Image, lang: 'por' }),
	});
	assertEquals(response.status, 400);
	await response.body?.cancel()
});

