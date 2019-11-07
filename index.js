module.exports = function TerableFishMongerer(mod) {
	const cmd = mod.command || mod.require.command;
    mod.game.initialize('inventory');

    let id = 0,
        fish = [],
        fishToSell = [],
        numToSell = 0,
        delay = 0,
        enabled = false,
        fishSold = 0,
        ft = 0;

	cmd.add(['terafm', 'tfm'], {
        $default(fishTier){
            ft = fishTier;
            fish = [];
            fishToSell = [];
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
                fishToSell.push({ "id": 0,  "unk1": 0, "slot": item.slot, "fishId": item.id, "amount": 1});
            });
            fishToSell.sort(function (a, b){
                return Number(a.slot) - Number(b.slot);
            });
            numToSell = 0;
            delay = 300;
            if(enabled){
                cmd.message("Currently Running. Please try again in a few seconds.");
                return;
            } else{
                cmd.message(`Mongering Tier ${ft} fishes.`);
                enabled = true;
                fishSold = 0;
            }
        }
	});

	mod.hook('S_DELIVERY_STORE_ITEM', 1, (event) => {
        if(enabled && numToSell == 0){ // find out how many fish to sell and trim array to that size
            numToSell = Math.min(fishToSell.length, event.devlierableFishAmount);
            fishToSell.slice(numToSell);
        }

        if(numToSell > fishSold && enabled){
            for (let item of fishToSell.slice(0, 8)){
                item.id = event.id;
                mod.setTimeout(() => {
                    mod.send('C_DELIVERY_STORE_ADD_BASKET', 1, item);
                }, delay);
                delay += 200;
                fishSold++;
            }
            fishToSell = fishToSell.slice(8);
            mod.setTimeout(() => {
                mod.send('C_DELIVERY_STORE_COMMIT', 1, { "id": event.id, "type": 1000 });
            }, delay+200);
        }
        if(numToSell <= fishSold && enabled){
            mod.setTimeout(() => {
                cmd.message(`${fishSold} Tier ${ft} fishes mongered.`);
            }, delay+250);
            enabled = false;
        }
    });
}