const { default: SlippiGame, generateOverallStats } = require('@slippi/slippi-js');
const { match } = require('assert');

const sqlite3 = require('sqlite3').verbose();
    
const db = new sqlite3.Database('./slippi_wrapped.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('Connected to the slippi wrapped database');
});

function parse_slp(filename,db){
    var game = new SlippiGame(filename);

    // Get game settings – stage, characters, etc
    var settings = game.getSettings();
    // Get metadata - start time, platform played on, etc
    var metadata = game.getMetadata();
    // Get computed stats - openings / kill, conversions, etc
    var stats = game.getStats();
    // Get frames – animation state, inputs, etc
    var frames = game.getFrames();
    
    var misc = 0; // this includes all thrown items, zair, luigis taunt, samus bombs, etc
    var jab_1 = 0;
    var jab_2 = 0;
    var jab_3 = 0;
    var rapid_jab = 0;
    var dash_attack = 0;
    var ftilt = 0;
    var utilt = 0;
    var dtilt = 0;
    var fsmash = 0;
    var usmash = 0;
    var dsmash = 0;
    var nair = 0;
    var fair = 0;
    var bair = 0;
    var uair = 0;
    var dair = 0;
    var neutral_b = 0;
    var side_b = 0;
    var up_b = 0;
    var down_b = 0;
    var getup_attack = 0;
    var getup_attack_slow = 0;
    var pummel = 0;
    var fthrow = 0;
    var bthrow = 0;
    var uthrow = 0;
    var dthrow = 0;
    var edge_attack_slow = 0;
    var edge_attack = 0;
    
    var stage_dict = {
        2 : "FOUNTAIN_OF_DREAMS",
        3 : "POKEMON_STADIUM",
        4 : "PEACHS_CASTLE",
        5 : "KONGO_JUNGLE",
        6 : "BRINSTAR",
        7 : "CORNERIA",
        8 : "YOSHIS_STORY",
        9 : "ONETT",
        10 : "MUTE_CITY",
        11 : "RAINBOW_CRUISE",
        12 : "JUNGLE_JAPES",
        13 : "GREAT_BAY",
        14 : "HYRULE_TEMPLE",
        15 : "BRINSTAR_DEPTHS",
        16 : "YOSHIS_ISLAND",
        17 : "GREEN_GREENS",
        18 : "FOURSIDE",
        19 : "MUSHROOM_KINGDOM",
        20 : "MUSHROOM_KINGDOM_2",
        22 : "VENOM",
        23 : "POKE_FLOATS",
        24 : "BIG_BLUE",
        25 : "ICICLE_MOUNTAIN",
        26 : "ICETOP",
        27 : "FLAT_ZONE",
        28 : "DREAMLAND",
        29 : "YOSHIS_ISLAND_N64",
        30 : "KONGO_JUNGLE_N64",
        31 : "BATTLEFIELD",
        32 : "FINAL_DESTINATION"
    }
    
    var char_dict = {
        0 : "CAPTAIN_FALCON",
        1 : "DONKEY_KONG",
        2 : "FOX" ,
        3 : "GAME_AND_WATCH",
        4 : "KIRBY",
        5 : "BOWSER",
        6 : "LINK",
        7 : "LUIGI",
        8 : "MARIO",
        9 : "MARTH",
        10 : "MEWTWO",
        11 : "NESS",
        12 : "PEACH",
        13 : "PIKACHU",
        14 : "ICE_CLIMBERS",
        15 : "JIGGLYPUFF",
        16 : "SAMUS",
        17 : "YOSHI",
        18 : "ZELDA",
        19 : "SHEIK",
        20 : "FALCO",
        21 : "YOUNG_LINK",
        22 : "DR_MARIO",
        23 : "ROY",
        24 : "PICHU",
        25 : "GANONDORF"
    }
    
    function get_openings(stats, player_index, move_type){
        for (let i = 0; i < stats.conversions.length; i++) { 
            if(stats.conversions[i].openingType == move_type && stats.conversions[i].playerIndex == player_index){
                if(typeof(stats.conversions[i].moves[0]) === "undefined"){
                    // skip
                }else{
                    switch(stats.conversions[i].moves[0].moveId){
                        case 1: 
                            ++misc;
                            break;
                        case 2:
                            ++jab_1;
                            break;
                        case 3:
                            ++jab_2;
                            break;
                        case 4:
                            ++jab_3;
                            break;
                        case 5:
                            ++rapid_jab;
                            break;
                        case 6:
                            ++dash_attack;
                            break;   
                        case 7:
                            ++ftilt;
                            break;
                        case 8:
                            ++utilt;
                            break;
                        case 9:
                            ++dtilt;
                            break;
                        case 10:
                            ++fsmash;
                            break;
                        case 11:
                            ++usmash;
                            break;
                        case 12:
                            ++dsmash;
                            break;
                        case 13:
                            ++nair;
                            break;
                        case 14:
                            ++fair;
                            break;
                        case 15:
                            ++bair;
                            break;
                        case 16:
                            ++uair;
                            break;
                        case 17:
                            ++dair;
                            break;
                        case 18:
                            ++neutral_b;
                            break;
                        case 19:
                            ++side_b;
                            break;
                        case 20:
                            ++up_b;
                            break;
                        case 21:
                            ++down_b;
                            break;
                        case 50:
                            ++getup_attack;
                            break;
                        case 51:
                            ++getup_attack_slow;
                            break;
                        case 52:
                            ++pummel;
                            break;
                        case 53:
                            ++fthrow;
                            break;
                        case 54:
                            ++bthrow;
                            break;
                        case 55:
                            ++uthrow;
                            break;
                        case 56:
                            ++dthrow;
                            break;
                        case 61:
                            ++edge_attack_slow;
                            break;
                        case 62:
                            ++edge_attack;
                            break;
                    }
                }
            }
        }
    }
    
    function get_kill_moves(stats, player_index){
        for (let i = 0; i < stats.conversions.length; i++) { 
            if(stats.conversions[i].didKill == true && stats.conversions[i].playerIndex == player_index){
                switch(stats.conversions[i].moves[stats.conversions[i].moves.length - 1].moveId){
                    case 1: 
                        ++misc;
                        break;
                    case 2:
                        ++jab_1;
                        break;
                    case 3:
                        ++jab_2;
                        break;
                    case 4:
                        ++jab_3;
                        break;
                    case 5:
                        ++rapid_jab;
                        break;
                    case 6:
                        ++dash_attack;
                        break;   
                    case 7:
                        ++ftilt;
                        break;
                    case 8:
                        ++utilt;
                        break;
                    case 9:
                        ++dtilt;
                        break;
                    case 10:
                        ++fsmash;
                        break;
                    case 11:
                        ++usmash;
                        break;
                    case 12:
                        ++dsmash;
                        break;
                    case 13:
                        ++nair;
                        break;
                    case 14:
                        ++fair;
                        break;
                    case 15:
                        ++bair;
                        break;
                    case 16:
                        ++uair;
                        break;
                    case 17:
                        ++dair;
                        break;
                    case 18:
                        ++neutral_b;
                        break;
                    case 19:
                        ++side_b;
                        break;
                    case 20:
                        ++up_b;
                        break;
                    case 21:
                        ++down_b;
                        break;
                    case 50:
                        ++getup_attack;
                        break;
                    case 51:
                        ++getup_attack_slow;
                        break;
                    case 52:
                        ++pummel;
                        break;
                    case 53:
                        ++fthrow;
                        break;
                    case 54:
                        ++bthrow;
                        break;
                    case 55:
                        ++uthrow;
                        break;
                    case 56:
                        ++dthrow;
                        break;
                    case 61:
                        ++edge_attack_slow;
                        break;
                    case 62:
                        ++edge_attack;
                        break;
                }
            }
        }
    }
    
    function reset_move_count(){
         misc = 0; // this includes all thrown items, zair, luigis taunt, samus bombs, etc
         jab_1 = 0;
         jab_2 = 0;
         jab_3 = 0;
         rapid_jab = 0;
         dash_attack = 0;
         ftilt = 0;
         utilt = 0;
         dtilt = 0;
         fsmash = 0;
         usmash = 0;
         dsmash = 0;
         nair = 0;
         fair = 0;
         bair = 0;
         uair = 0;
         dair = 0;
         neutral_b = 0;
         side_b = 0;
         up_b = 0;
         down_b = 0;
         getup_attack = 0;
         getup_attack_slow = 0;
         pummel = 0;
         fthrow = 0;
         bthrow = 0;
         uthrow = 0;
         dthrow = 0;
         edge_attack_slow = 0;
         edge_attack = 0;
    }
    
    function l_cancel_percentage(player_index){
    
        var failed = 0;
        var successful = 0;
    
        for (let i = 0; i < stats.lastFrame; i++) {
            for (let j = 0; j < frames[i].players.length; j++) {
                if(frames[i].players[j].post.lCancelStatus == 1){
                    if(frames[i].players[j].post.playerIndex == player_index){
                        ++successful;
                    }
                }else if(frames[i].players[j].post.lCancelStatus == 2){
                    if(frames[i].players[j].post.playerIndex == player_index){
                        ++failed;
                    }
                }
            }
        }
    
        var l_cancel_percentage = (successful / (successful + failed)) * 100;
        return Math.round(l_cancel_percentage);
    }
    
    function get_earliest_stock(player_index){
        var earliest_stock = 999;
    
        for (let i = 0; i < stats.stocks.length; i++) {
            if(stats.stocks[i].playerIndex == player_index){
                if(stats.stocks[i].endPercent <= earliest_stock){
                    earliest_stock = stats.stocks[i].endPercent;
                }
            }
        }
    
        return earliest_stock;
    }
    
    function get_latest_stock(player_index){
        var latest_stock = -1;
    
        for (let i = 0; i < stats.stocks.length; i++) {
            if(stats.stocks[i].playerIndex == player_index){
                if(stats.stocks[i].endPercent >= earliest_stock){
                    earliest_stock = stats.stocks[i].endPercent;
                }
            }
        }
    
        return latest_stock;
    }
    
    function get_best_punish(player_index){
    
        var best_punish = 0;
        var punish = 0;
    
        for (let i = 0; i < stats.conversions.length; i++) {
            if(stats.conversions[i].playerIndex == player_index){
                punish = stats.conversions[i].endPercent - stats.conversions[i].startPercent;
                if(punish >= best_punish){
                    best_punish = punish;
                }
            }
        }
    
        return best_punish;
    }
    
    function populate_player_stats(player_index, db, match_id){
        db.run('INSERT INTO player_stats(match_id, player_index, connect_code, \
            character, total_damage, kill_count, successful_conversions, total_conversions, \
            total_inputs, total_digital_inputs, neutral_wins, counterhits, trades, l_cancel_percentage, \
            best_punish, wavedash_count, waveland_count, airdodge_count, dashdance_count, \
            spotdodge_count, ledgegrab_count, roll_count, winner) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [match_id, stats.overall[player_index].playerIndex, metadata.players[player_index].names.code,
            char_dict[settings.players[player_index].characterId], stats.overall[player_index].totalDamage,
            stats.overall[player_index].killCount, stats.overall[player_index].successfulConversions.count,
            stats.overall[player_index].successfulConversions.total, stats.overall[player_index].inputsPerMinute.count,
            stats.overall[player_index].digitalInputsPerMinute.count, stats.overall[player_index].neutralWinRatio.count,
            stats.overall[player_index].counterHitRatio.count, stats.overall[player_index].beneficialTradeRatio.count, l_cancel_percentage(player_index),
            get_best_punish(player_index), stats.actionCounts[player_index].wavedashCount,
            stats.actionCounts[player_index].wavelandCount, stats.actionCounts[player_index].airDodgeCount,
            stats.actionCounts[player_index].dashDanceCount, stats.actionCounts[player_index].spotDodgeCount,
            stats.actionCounts[player_index].ledgegrabCount, stats.actionCounts[player_index].rollCount,check_winner(stats)]
            , function(err){
                if (err) {
                    return console.log(err.message);
                }
                // get the last insert id
                console.log(`A row has been inserted into player stats with rowid ${this.lastID}`);
            }); 
    }
    
    function populate_stocks_lost(player_index, db, match_id, stats){
    
        stocks_lost = 1;
    
        stock_1 = null;
        stock_2 = null;
        stock_3 = null;
        stock_4 = null;
    
        for (let i = 0; i < stats.stocks.length; i++) {
            if(stats.stocks[i].playerIndex == player_index){
                switch(stocks_lost){
                    case 1:
                        stock_1 = stats.stocks[i].endPercent;
                        break;
                    case 2:
                        stock_2 = stats.stocks[i].endPercent;
                        break;
                    case 3:
                        stock_3 = stats.stocks[i].endPercent;
                        break;
                    case 4:
                        stock_4 = stats.stocks[i].endPercent;
                        break;
                }
                stocks_lost++;
            }
        }
    
        db.run('INSERT INTO stocks_lost(match_id, player_index, stock_1, stock_2, stock_3, \
            stock_4) VALUES (?,?,?,?,?,?)',
            [match_id, player_index, stock_1, stock_2, stock_3, stock_4]
            , function(err){
                if (err) {
                    return console.log(err.message);
                }
                // get the last insert id
                console.log(`A row has been inserted into stocks lost with rowid ${this.lastID}`);
            });
    }
    
    function populate_moves(player_index, db, match_id, stats, move_type){
        var select;
    
        if(move_type == 'kills'){
            select = "INSERT INTO kill_moves";
            get_kill_moves(stats, player_index);
        }else if(move_type == 'neutral'){
            select = "INSERT INTO neutral_wins";
            get_openings(stats, player_index, 'neutral-win');
        }else if(move_type == 'counter'){
            select = "INSERT INTO counter_hits";
            get_openings(stats, player_index, 'counter-attack');
        }else if(move_type == 'trade'){
            select = "INSERT INTO trades";
            get_openings(stats, player_index, 'trade');
        }else{
            console.log("Invalid move type");
            return;
        }
    
        db.run(`${select}(match_id, player_index, misc, jab_1, \
            jab_2, jab_3, rapid_jab, dash_attack, ftilt, utilt, dtilt, fsmash,\
            usmash, dsmash, nair, fair, bair, uair, dair, neutral_b, side_b, up_b,\
            down_b, get_up_attack, get_up_attack_slow, pummel, fthrow, bthrow, uthrow,\
            dthrow, edge_attack_slow, edge_attack) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,\
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [match_id, player_index, misc, jab_1, jab_2, jab_3, rapid_jab, dash_attack,
            ftilt, utilt, dtilt, fsmash, usmash, dsmash, nair, fair, bair, uair, dair,
            neutral_b, side_b, up_b, down_b, getup_attack, getup_attack_slow, pummel, fthrow,
            bthrow, uthrow, dthrow, edge_attack_slow, edge_attack]
            , function(err){
                if (err) {
                    return console.log(err.message);
                }
                // get the last insert id
                console.log(`A row has been inserted into ${move_type} with rowid ${this.lastID}`);
            });
    
        reset_move_count();
    }

    function check_complete(stats){
        player0_stocks_lost = 0;
        player1_stocks_lost = 0;

        for (let i = 0; i < stats.stocks.length; i++) {
            switch(stats.stocks[i].playerIndex){
                case 0:
                    player0_stocks_lost++;
                    break;
                case 1:
                    player1_stocks_lost++;
                    break;
            }      
        }



        if(player0_stocks_lost != 4 && player1_stocks_lost != 4 && stats.lastFrame != 28800){
            return false;
        }else{
            return true;
        }
    }

    function check_winner(stats){

        var player_zero_percent;
        var player_one_percent;
        var winner;

        for (let i = 0; i < stats.stocks.length; i++) {
            if(stats.stocks[i].playerIndex == 0){
                player_zero_percent == stats.stocks[i].currentPercent;
            }else if(stats.stocks[i].playerIndex == 1){
                player_one_percent == stats.stocks[i].currentPercent;
            }
        }

        if(stats.overall[0].killCount == 4){
            winner = 0;
        }else if(stats.overall[1].killCount == 4){
            winner =  1;
        }else if(metadata.lastFrame == 28800){
            if(stats.overall[0].killCount > stats.overall[1].killCount){
                winner =  0;
            }else if(stats.overall[0].killCount < stats.overall[1].killCount){
                winner =  1;
            }else if(stats.overall[0].killCount == stats.overall[1].killCount){
                if(player_zero_percent > player_one_percent){
                    winner = 1;
                }else if(player_zero_percent < player_one_percent){
                    winner = 0;
                }else if(player_zero_percent = player_one_percent){
                    winner = 2;
                }
            }
        }else{
            winner = 3;
        }

        switch(winner){
            case 0:
                return metadata.players[0].names.code;
            case 1:
                return metadata.players[1].names.code;
            case 2:
                return "DRAW";
            case 3:
                return "INCOMPLETE"

        }
    }

    db.serialize(() => {
        db.run('INSERT INTO matches(is_teams, is_PAL, game_complete, stage, game_time,\
            total_neutral_exchanges, total_counterhit_exchanges, total_trades, first_blood, date, unique_id, \
            winner) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
            [settings.isTeams, settings.isPAL, check_complete(stats), stage_dict[settings.stageId],
            metadata.lastFrame, stats.overall[0].neutralWinRatio.total,
            stats.overall[0].counterHitRatio.total, stats.overall[0].beneficialTradeRatio.total,metadata.players[stats.stocks[0].playerIndex].names.code,
            metadata.startAt, metadata.startAt + metadata.players[0].names.code + metadata.players[1].names.code,
            check_winner(stats)]
            , function(err){
                if (err) {
                    return console.log(err.message);
                }
                // get the last insert id
                console.log(`A row has been inserted into matches with rowid ${this.lastID}`);
            });
    
        let sql = `SELECT * FROM matches WHERE id = (SELECT max(id) FROM matches)`;
    
        function player_stats_callback(data){
    
            populate_player_stats(0, db, data);
            populate_player_stats(1, db, data);
    
        }
    
        function moves_callback(data){
    
            populate_moves(0,db,data,stats,'neutral');
            populate_moves(1,db,data,stats,'neutral');
    
            populate_moves(0,db,data,stats,'kills');
            populate_moves(1,db,data,stats,'kills');
    
            populate_moves(0,db,data,stats,'counter');
            populate_moves(1,db,data,stats,'counter');

            populate_moves(0,db,data,stats,'trade');
            populate_moves(1,db,data,stats,'trade');
        }
    
        function stocks_callback(data){
    
            populate_stocks_lost(0,db,data,stats);
            populate_stocks_lost(1,db,data,stats);
        }

        function close_db(){
            db.close((err) => {
                if (err) {
                    console.log(err.message);
                }
                console.log('Close the database connection.');
            });
        }
    
        var populate_tables_callback = function(data){
    
            player_stats_callback(data);
            moves_callback(data);
            stocks_callback(data);
    
            //close_db();
        }
    
    
        function get_match_id(callback){
            db.all(sql, function (err,rows){
                if(err){
                    console.log(err);
                }else{
                    callback(rows[0].id);
                }
            })
        }
    
        get_match_id(populate_tables_callback);
        
    });
    

}

const slp_folder = './slippi/';
const fs = require('fs');



module.exports = {
  parse_folder : function(slp_folder){
    const db = new sqlite3.Database('./slippi_wrapped.db', sqlite3.OPEN_READWRITE, (err) => {
      if (err) {
          console.log(err.message);
      }
      console.log('Connected to the slippi wrapped database');
    });
  
    fs.readdirSync(slp_folder).forEach(file => {
      console.log("Parsing: " + file);
  
      parse_slp(slp_folder + file, db);
    })
  },
}