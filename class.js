class Man3 {
	constructor() {
		this.name = ''
		this.time = 0
	}
	HelloMan(name) {
		this.name = name || ''
		setTimeout(() => {
			console.log(`你好,我是${this.name}`) 
		}, this.time)
		return this
	}
	sleep(time) {
		this.time = (time || 0) * 1000
		return this
	}
	play(game) {
		setTimeout(() => {
			console.log(`我在玩${game}`)
		}, this.time)
		return this
	}
	sleepFirst(time) {
		this.time = (time || 0) * 1000
		return this
	}
}