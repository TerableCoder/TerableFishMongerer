module.exports = function TerableFishMongerer(mod) {
	const cmd = mod.command || mod.require.command;
    mod.game.initialize('inventory');
	
    let id = 0,
        dfa = 0;
		
	function hook(){ hooks.push(mod.hook(...arguments)); }
	
	function unload(){
		enabled = false;
		if(hooks.length){
			for (let h of hooks)
				mod.unhook(h);
			hooks = [];
		}
	}
	
	cmd.add(['terafm', 'tfm'], {
        $default(fishTier){
            let fish = [];
            let fishToSell = [];
            switch(fishTier){
                case "baf":
                    fish = [206500, 206501, 206502, 206503, 206504, 206505, 206506, 206507, 206508, 206509];
                    break;
                case "10":
                    fish = [206431, 206432, 206433, 206434, 206435, 206454, 206455, 206456];
                    break;
                case "9":
                    fish = [206426, 206427, 206428, 206429, 206430, 206451, 206452, 206453];
                    break;
                case "8":
                    fish = [206422, 206423, 206424, 206425, 206449, 206450];
                    break;
                case "7":
                    fish = [206418, 206419, 206420, 206421, 206447, 206448];
                    break;
                case "6":
                    fish = [206414, 206415, 206416, 206417, 206445, 206446];
                    break;
                case "5":
                    fish = [206411, 206412, 206413, 206443, 206444];
                    break;
                case "4":
                    fish = [206408, 206409, 206410, 206441, 206442];
                    break;
                case "3":
                    fish = [206406, 206407, 206439, 206440];
                    break;
                case "2":
                    fish = [206404, 206405, 206437, 206438];
                    break;
                case "1":
                    fish = [206402, 206403, 206436];
                    break;
            }
            mod.game.inventory.findAllInBagOrPockets(fish).forEach(item => { // find fish of tier fishTier
                fishToSell.push({ "id": id,  "unk1": 0, "slot": item.slot, "fishId": item.id, "amount": 1});
            });
            fishToSell.sort(function (a, b){
                return Number(a.slot) - Number(b.slot);
            });
            const numToSell = Math.min(fishToSell.length, dfa);
            let j = 0;
            let delay = 0;
            for(let i = 0; i < numToSell; i++){
                mod.setTimeout(() => {
                    mod.send('C_DELIVERY_STORE_ADD_BASKET', 1, fishToSell[i]);
                }, delay);
                delay += 100;
                j++;
                if(j == 8){
                    delay += 100;
                    mod.setTimeout(() => {
                        mod.send('C_DELIVERY_STORE_COMMIT', 1, { "id": id, "type": 1000 });
                    }, delay);
                    j = 0;
                    delay += 200;
                }
            }
            if(j != 0){
                mod.setTimeout(() => {
                    mod.send('C_DELIVERY_STORE_COMMIT', 1, { "id": id, "type": 1000 });
                }, delay);
            }

            cmd.message(`${numToSell} Tier ${fishTier} fishes mongered.`);
        }
	});
	
	mod.hook('S_DELIVERY_STORE_ITEM', 1, (event) => {
        id = event.id;
        dfa = event.devlierableFishAmount;
    });
}