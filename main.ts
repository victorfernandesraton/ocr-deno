import Tesseract from 'npm:tesseract.js';

Deno.serve({ port: Deno?.args?.[0] ? parseInt(Deno.args[0]) : 8000  }, async (req: Request) => {
	const url = new URL(req.url);

	if (req.method === 'POST' && url.pathname === '/ocr') {
		const contentType = req.headers.get('content-type') || '';

		let imageBuffer: Uint8Array | undefined;
		let lang = 'eng';

		if (contentType.includes('multipart/form-data')) {
			const formData = await req.formData();
			const image = formData.get('image');
			const formLang = formData.get('lang');

			if (formLang) lang = String(formLang);

			if (image && image instanceof File) {
				imageBuffer = new Uint8Array(await image.arrayBuffer());
			}
		} else if (contentType.includes('application/json')) {
			const body = await req.json();
			const base64Image = body.image;
			if (body.lang) lang = body.lang;

			imageBuffer = Uint8Array.from(
				atob(base64Image),
				(c) => c.charCodeAt(0),
			);
		} else {
			return new Response('Content-Type não é válido', {status: 400})
		}

		if (!imageBuffer) {
			return new Response('Imagem não encontrada ou inválida', {
				status: 400,
			});
		}

		const ocrResult = await Tesseract.recognize(imageBuffer, lang);
		return new Response(JSON.stringify({ text: ocrResult.data.text }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	return new Response('Rota não encontrada', { status: 404 });
});
