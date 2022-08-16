export function execPlugin(plugin) {
	if(croods) {
		if (croods.load){
		  croods.load(function () {
		    croods.customPlugin(plugin)
		  })
		}else {
		  croods.customPlugin(plugin)
		}
	}
}