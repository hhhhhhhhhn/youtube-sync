let player
function onYouTubeIframeAPIReady() {
	player = new YT.Player("player", {
		height: "390",
		width: "640",
		videoId: "",
	})
}

let peer = new Peer()

peer.on("open", ()=>{
	let conn = peer.connect(window.location.href.split("?").pop())
	conn.on("data", update)
})

let lastData

function update(data) {
	lastData = data
	if(player.getVideoUrl().split("=").pop() != data.id)
		player.loadVideoById(data.id)
	

	localCurrentTime = player.getCurrentTime()
	hostCurrentTime = data.currentTime + (Date.now() / 1000) - data.timestamp
	
	localPlayerState = player.getPlayerState() 

	if((hostCurrentTime - localCurrentTime > 5 && data.state == 1) ||
	localPlayerState != data.state || localPlayerState != 1) {
		player.seekTo(hostCurrentTime)
		if(data.state == 1) player.playVideo()
		else player.pauseVideo()
	}

}

setInterval(()=>{
	if(lastData)
		update(lastData)
}, 5000)