import { Command } from "https://deno.land/x/cliffy@v0.25.0/command/mod.ts";
import {
	DOMParser,
	HTMLDocument,
	Node,
} from "https://deno.land/x/deno_dom@v0.1.34-alpha/deno-dom-wasm.ts";
import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

interface Hrac {
	cislo: string;
	post: string;
	jmeno: string;
}

interface Roster {
	[cislo: number]: Hrac;
}

interface Lineup {
	jmeno: string;
	strana: string;
	hraci: Roster;
	realizacni: {
		[jmeno: string]: string;
	};
}

interface Metadata {
	rozhodci: string[];
	utkani: string;
	tymy: Lineup[];
}

async function getTeamNames(id: string | number) {
	const request = await fetch(
		`https://online.ceskyflorbal.cz/20222023/online-${id}.htm`,
	);
	const response = await request.text();

	const doc: HTMLDocument = new DOMParser().parseFromString(
		response,
		"text/html",
	)!;

	const domaci: string = doc.querySelector(".home-team-name")?.textContent ??
		"Domácí";
	const hoste: string = doc.querySelector(".away-team-name")?.textContent ??
		"Hosté";

	return { [domaci]: "Domácí", [hoste]: "Hosté" };
}

async function getPlayers(id: string | number) {
	const request = await fetch(
		`https://fis.ceskyflorbal.cz/index.php?pageid=3008&onlycontent=1&record_id=${id}`,
	);
	const response = await request.text();

	const doc: HTMLDocument = new DOMParser().parseFromString(
		response,
		"text/html",
	)!;
	const tabulky = doc.querySelectorAll(".lineup-body");
	const lineup: { [tym: string]: Roster } = {};

	tabulky.forEach((tabulka: any) => {
		const tym: string = tabulka.querySelector(".teamname").textContent;
		const hraci: Roster = {};

		tabulka.querySelectorAll(".table-header").forEach(
			(radek: Node, index: number) => {
				if (index == 0) return;

				const children = radek.childNodes;

				const cislo = children[0].textContent;
				const post = children[1].textContent;
				const jmeno = children[2].textContent;

				hraci[Number(cislo)] = { cislo, post, jmeno };
			},
		);

		lineup[tym] = hraci;
	});

	return lineup;
}

async function getTeamSupports(id: string | number) {
	const request = await fetch(
		`https://fis.ceskyflorbal.cz/index.php?pageid=2519&onlycontent=1&record_id=${id}`,
	);
	const response = await request.text();

	const doc: any = new DOMParser().parseFromString(response, "text/html");
	const tabulky = doc.querySelectorAll(".statisticsSupportTeam .overtable");
	const realizacni: { [key: string]: string }[] = [];

	tabulky.forEach((tabulka: any) => {
		const lidi: { [key: string]: string } = {};

		tabulka.querySelectorAll("td").forEach((val: any) => {
			const hodnoty = val.textContent.split("-");
			const jmeno = hodnoty?.shift()?.trim() ?? "Neznámé";

			lidi[jmeno] = (lidi[jmeno] ?? "") + (lidi[jmeno] ? ", " : "") +
				(hodnoty.pop()?.trim() ?? "Neznámé" + lidi[jmeno]);
		});

		realizacni.push(lidi);
	});

	return realizacni;
}

async function getMatchMetadata(id: string | number): Promise<Metadata> {
	const request = await fetch(
		`https://fis.ceskyflorbal.cz/index.php?pageid=2519&onlycontent=1&record_id=${id}.htm`,
	);
	const response = await request.text();

	let rozhodci: string | string[] =
		response.match(/(?<=(rozhodčí:))\s*.+?(?=\<\/td\>)/gim)?.pop() ??
			"Nejsou zapsáni";
	let utkani = response.match(/(?<=(utkání:)).+?(?=\<\/td\>)/gim)?.pop() ??
		"Nejsou zapsána";

	const jmenaTymu = await getTeamNames(id);
	const realizacni = await getTeamSupports(id);
	const hraci = await getPlayers(id);

	const tymy = Object.keys(jmenaTymu).map((
		tym: string,
		index: number,
	): Lineup => (
		{
			jmeno: tym,
			realizacni: realizacni[index],
			strana: jmenaTymu[tym],
			hraci: hraci[tym],
		}
	));

	rozhodci = rozhodci.split(",").map((v) => v.trim());
	utkani = utkani.split(";")?.slice(1)?.join(" - ")?.trim();

	return { rozhodci, utkani, tymy };
}

async function main(id: string | number) {
	const data: Metadata = await getMatchMetadata(id);
	const app = new Application();
	const configuration = config();

	const port = parseInt(configuration.PORT);

	app.use(oakCors({ origin: "*" }));
	app.use((ctx: any) => {
		ctx.response.body = data;
	});

	console.log(`Načten zápas ${data.utkani}`);
	console.log(`${data.tymy[0].jmeno} vs ${data.tymy[1].jmeno} `);
	app.listen({ port });
	console.log(`Data dostupná na portu ${port}`);
}

await new Command()
	.name("hlasatelna")
	.version("1.0.0")
	.description("Backend pro sběr dat z florbalových utkání")
	.arguments("<kod_utkani:string>")
	.action((_, id) => main(id))
	.parse(Deno.args);
