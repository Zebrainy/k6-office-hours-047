import { sleep, check } from "k6"
import http from "k6/http"

const udid = () =>
	"2428304CF-A6D3-4E9B-BFCC-sC25AAAF0448F" + String(Math.random()).slice(3, 11)

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

const config = (token) => ({
	headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token}`,
	},
})
const body = (udid) =>
	`grant_type=hybrid&client_id=Zebrainy.Skazbuka.Api.Client.Hybrid&client_secret=6Fk9%3AE%21udK%5EKa3%7BG5%3Bz&scope=Zebrainy.Skazbuka&UDID=${udid}&platform=1&client_version=8.6.0&language=Rus&timezone_offset=180&country=""`

export default () => {
	const connectToken = http.post(
		"https://dev-is.skazbuka.org/connect/token",
		body(udid()),
		{
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
		}
	)
	if (connectToken.status != 200) {
		console.log("ConnectToken", connectToken.body)
	}
	const token = JSON.parse(connectToken.body).access_token

	const userParent = http.get(
		`https://dev-api.skazbuka.org/api/2.5/UserParent/me${
			Math.random() > 0.7 ? "" : ""
		}`,
		config(token)
	)
	if (userParent.status != 200) {
		console.log("userParent", userParent.body)
	}
	const params = {
		email: "",
		platform: "Android",
		version: "8.6.0",
	}
	const subs = http.get(
		`https://dev-api.skazbuka.org/api/2.5/subscriptions/current?${Object.keys(
			params
		)
			.map(function (k) {
				return (
					encodeURIComponent(k) + "=" + encodeURIComponent(params[k])
				)
			})
			.join("&")}`,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		}
	)

	if (subs.status != 200) {
		console.log("subs", subs.body)
	}

	const parentId = JSON.parse(userParent.body).id

	const abTests = http.get(
		`https://dev-api.skazbuka.org/api/2.5/Config/ab-test-full`,
		config(token)
	)
	if (abTests.status != 200) {
		console.log("abTests", abTests.body)
	}
	const ab = JSON.parse(JSON.parse(abTests.body).json)
	check(connectToken, {
		"get connectToken 200": (res) => res.status === 200,
	})

	check(userParent, {
		"user parent 200": (res) => res.status === 200,
	})

	check(abTests, {
		"abTests 200": (res) => res.status === 200,
	})

	// console.log(userParent.body)

	sleep(0.5)
}
