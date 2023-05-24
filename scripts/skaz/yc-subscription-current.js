import { sleep } from "k6"
import http from "k6/http"

export let options = {
	insecureSkipTLSVerify: true,
	noConnectionReuse: false,
	stages: [
		{ duration: "1m", target: 100 }, // below normal load
		// { duration: "2m", target: 100 },
		{ duration: '2m', target: 300 },	// normal load
		// { duration: '5m', target: 300 },
		// { duration: '2m', target: 400 },	// around the breaking point
		// { duration: '5m', target: 400 },
		// { duration: '2m', target: 500 },	// beyond the breaking point
		// { duration: '5m', target: 500 },
		{ duration: "1m", target: 0 }, // scale down, recovery stage
	],
}

const token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IkFDNUM0RDc4MDVDNkJBM0I5OTgzOTJGNjc5OTcwNjMyIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE2ODQ5MzE1ODAsImV4cCI6MTY4NTAxNzk4MCwiaXNzIjoiaHR0cDovL2lzLmRldi56ZWJyYWlueS50ZWNoIiwiYXVkIjoiWmVicmFpbnkuU2themJ1a2EiLCJjbGllbnRfaWQiOiJaZWJyYWlueS5Ta2F6YnVrYS5BcGkuQ2xpZW50Lkh5YnJpZCIsInN1YiI6IjIwMjYzMzEiLCJhdXRoX3RpbWUiOjE2ODQ5MzE1ODAsImlkcCI6ImxvY2FsIiwiaWQiOiIiLCJuYW1lIjoiIiwiZW1haWwiOiIiLCJwbGF0Zm9ybSI6IkFuZHJvaWQiLCJ0el9vZmZzZXQiOiIxODAiLCJsYW5ndWFnZSI6IlJ1cyIsImRldmljZSI6IjIwNDE3NTYiLCJjbGllbnRfdmVyc2lvbiI6IjgwNTA4Iiwicm9sZSI6IlBhcmVudCIsImp0aSI6IkQ5NkM0NUJEQzQyQzUzNEJGRjFFQzNFMzI3MEQwNzcxIiwiaWF0IjoxNjg0OTMxNTgwLCJzY29wZSI6WyJaZWJyYWlueS5Ta2F6YnVrYSJdLCJhbXIiOlsibW9iaWxlIl19.kkRqmkSxvRonz91gmFWE4KEs_BpVcn5OUq10yiNlDj8Zj1LiMFji2dK-KexuoTeZStH_IuVJ87jVXazqaEOD-z34yNpTP84Z6IQnHzSk4c2N7zDh_avRe2rGLhJ3IbqINaAyhMFfcCUnveBAYf2Ro6IU-EMAJt2Wdo3Dg18uEY0muI9khBl6cicUmk-NWdCBHWS4HGOkNm2I-0-EGsqbSRvAu0oN9NJZy-AlpAfTsaq4r543amnY7-CbteHLNKkJNfx_q7zYZaILqyfvAI7G5e1eqH9x14joLqd37cnUhop5QgCVt3omzYI_r74FHE319UyrIxA0prXrA601MsGa4w'

export default () => {

    const params = {
		email: "",
		platform: "Android",
		version: "8.6.0",
	}

    const res = http.get(
		`https://dev.zebrainy.tech/platform-api/api/2.5/subscriptions/current?${Object.keys(
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

	if (res.status !== 200)
		console.log(res.body)

	sleep(0.5)
}