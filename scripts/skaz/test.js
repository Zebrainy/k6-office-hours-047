import { sleep } from "k6"
import http from "k6/http"

const udid = () =>
	"2428304CF-A6D3-4E9B-BFCC-C25AAAF0448D" + String(Math.random()).slice(3, 11)

export let options = {
	insecureSkipTLSVerify: true,
	noConnectionReuse: false,
	stages: [
		{ duration: "1m", target: 100 }, // below normal load
		// { duration: "2m", target: 200 },
		{ duration: '2m', target: 300 },	// normal load
		// { duration: '5m', target: 300 },
		// { duration: '2m', target: 400 },	// around the breaking point
		// { duration: '5m', target: 400 },
		// { duration: '2m', target: 500 },	// beyond the breaking point
		// { duration: '5m', target: 500 },
		{ duration: "1m", target: 0 }, // scale down, recovery stage
	],
}
// ### IS connection token body
const body = (udid) => `grant_type=hybrid&client_id=Zebrainy.Skazbuka.Api.Client.Hybrid&client_secret=6Fk9%3AE%21udK%5EKa3%7BG5%3Bz&scope=Zebrainy.Skazbuka&UDID=${udid}&platform=1&client_version=8.5.8&language=Rus&timezone_offset=180&country=""`

export default () => {
	const res = http.post("https://is.dev.zebrainy.tech/connect/token", body(udid()), {
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
	})
	if (res.status !== 200)
		console.log(res.body)

	sleep(0.5)
}