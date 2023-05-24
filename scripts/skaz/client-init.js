import { sleep } from "k6"
import http from "k6/http"

const udid = () =>
	"2428304CF-A6D3-4E9B-BFCC-C25sAAAsF0448D" + String(Math.random()).slice(3, 11)

export let options = {
	insecureSkipTLSVerify: true,
	noConnectionReuse: false,
	stages: [
		{ duration: "2m", target: 100 }, // below normal load
		// { duration: "5m", target: 100 },
		// { duration: '2m', target: 300 },	// normal load
		// { duration: '5m', target: 300 },
		// { duration: '2m', target: 400 },	// around the breaking point
		// { duration: '5m', target: 400 },
		// { duration: '2m', target: 500 },	// beyond the breaking point
		// { duration: '5m', target: 500 },
		// { duration: "10m", target: 0 }, // scale down, recovery stage
	],
}

// ### client init

const payload = (udid) =>
	JSON.stringify({
		client_id: "Zebrainy.Skazbuka.Api.Client.Hybrid",
		v: "8.6.0",
		udid: udid,
		language: "Eng",
		grant_type: "hybrid",
		secret: "6Fk9:E!udK^Ka3{G5;z",
		scope: "Zebrainy.Skazbuka",
		platform: "Ios",
		timezone_offset: 180,
		country: "",
	})

const params = {
	headers: {
		"Content-Type": "application/json",
	},
}

export default () => {
	http.post(
		"https://dev.zebrainy.tech/client-init-service/init",
		payload(udid()),
		params
	)
	sleep(0.5)
}

