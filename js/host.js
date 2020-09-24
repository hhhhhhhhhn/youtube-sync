let player
function onYouTubeIframeAPIReady() {
	player = new YT.Player("player", {
		height: "390",
		width: "640",
		videoId: "",
		events: {
			"onStateChange": update
		}
	})
}

let connections = []
let peer = new Peer()

peer.on("open", ()=>{
	let url = `./join.html?${peer.id}`
	idElement = document.getElementById("id")
	idElement.innerHTML = new URL(url, document.baseURI).href
	document.getElementById("id").href = url
})

peer.on("connection", (conn)=>{
	setTimeout(()=>{update(onlyLast = true)}, 500)
	connections.push(conn)
})

function update(onlyLast = false) {
	let data = {
		id: player.getVideoUrl().split("=").pop(),
		currentTime: player.getCurrentTime(),
		timestamp: Date.now() / 1000,
		state: player.getPlayerState()
	}
	if(onlyLast === true) {
		connections[connections.length - 1].send(data)
		return
	}
	for (let conn of connections) {
		conn.send(data)
	}
}

document.getElementById("play").addEventListener("click", ()=>{
	let url = document.getElementById("url").value
	if(url.includes("playlist?"))
		player.loadPlaylist({
			listType: "playlist",
			list: url.split("=").pop()
		})
	else
		player.loadVideoByUrl(url)
	document.getElementById("player").focus()
})

document.getElementById("shuffle").addEventListener("click", (e)=>{
	player.setShuffle(e.target.checked)
})