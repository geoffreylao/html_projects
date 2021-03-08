import sqlite3
from sqlite3 import Error

CREATE_MATCHES_TABLE = """ CREATE TABLE matches (
                                                id integer PRIMARY KEY AUTOINCREMENT,
                                                is_teams boolean,
                                                is_PAL boolean,
                                                game_complete boolean,
                                                stage text,
                                                game_time float,
                                                total_neutral_exchanges integer,
                                                total_counterhit_exchanges integer,
                                                total_trades integer DEFAULT 0,
                                                first_blood text,
                                                date datetime,
                                                unique_id text UNIQUE,
                                                winner text
                                            ); """

CREATE_PLAYER_STATS_TABLE = """ CREATE TABLE player_stats (
                                                            match_id integer,
                                                            player_index integer,
                                                            connect_code text,
                                                            character text,
                                                            total_damage float,
                                                            kill_count integer,
                                                            successful_conversions integer,
                                                            total_conversions integer,
                                                            total_inputs integer,
                                                            total_digital_inputs integer,
                                                            neutral_wins integer,
                                                            counterhits integer,
                                                            trades integer,
                                                            l_cancel_percentage float,
                                                            best_punish float,
                                                            wavedash_count integer,
                                                            waveland_count integer,
                                                            airdodge_count integer,
                                                            dashdance_count integer,
                                                            spotdodge_count integer,
                                                            ledgegrab_count integer,
                                                            roll_count integer,
                                                            winner text,
                                                            FOREIGN KEY (match_id) REFERENCES matches (id)
                                                        ); """                                  

CREATE_NEUTRAL_WINS_TABLE = """ CREATE TABLE neutral_wins (
                                                            match_id integer,
                                                            player_index integer,
                                                            misc integer,
                                                            jab_1 integer,
                                                            jab_2 integer,
                                                            jab_3 integer,
                                                            rapid_jab integer,
                                                            dash_attack integer,
                                                            ftilt integer,
                                                            utilt integer,
                                                            dtilt integer,
                                                            fsmash integer,
                                                            usmash integer,
                                                            dsmash integer,
                                                            nair integer,
                                                            fair integer,
                                                            bair integer,
                                                            uair integer,
                                                            dair integer,
                                                            neutral_b integer,
                                                            side_b integer,
                                                            up_b integer,
                                                            down_b integer,
                                                            get_up_attack integer,
                                                            get_up_attack_slow integer,
                                                            pummel integer,
                                                            fthrow integer,
                                                            bthrow integer,
                                                            uthrow integer,
                                                            dthrow integer,
                                                            edge_attack_slow integer,
                                                            edge_attack integer,
                                                            FOREIGN KEY (match_id) REFERENCES player_stats (match_id)                                                   
                                                        ); """                                             

CREATE_COUNTER_HITS_TABLE = """ CREATE TABLE counter_hits (
                                                            match_id integer,
                                                            player_index integer,
                                                            misc integer,
                                                            jab_1 integer,
                                                            jab_2 integer,
                                                            jab_3 integer,
                                                            rapid_jab integer,
                                                            dash_attack integer,
                                                            ftilt integer,
                                                            utilt integer,
                                                            dtilt integer,
                                                            fsmash integer,
                                                            usmash integer,
                                                            dsmash integer,
                                                            nair integer,
                                                            fair integer,
                                                            bair integer,
                                                            uair integer,
                                                            dair integer,
                                                            neutral_b integer,
                                                            side_b integer,
                                                            up_b integer,
                                                            down_b integer,
                                                            get_up_attack integer,
                                                            get_up_attack_slow integer,
                                                            pummel integer,
                                                            fthrow integer,
                                                            bthrow integer,
                                                            uthrow integer,
                                                            dthrow integer,
                                                            edge_attack_slow integer,
                                                            edge_attack integer,
                                                            FOREIGN KEY (match_id) REFERENCES player_stats (match_id)                                                   
                                                        ); """       

CREATE_KILL_MOVES_TABLE = """ CREATE TABLE kill_moves (
                                                        match_id integer,
                                                        player_index integer,
                                                        misc integer,
                                                        jab_1 integer,
                                                        jab_2 integer,
                                                        jab_3 integer,
                                                        rapid_jab integer,
                                                        dash_attack integer,
                                                        ftilt integer,
                                                        utilt integer,
                                                        dtilt integer,
                                                        fsmash integer,
                                                        usmash integer,
                                                        dsmash integer,
                                                        nair integer,
                                                        fair integer,
                                                        bair integer,
                                                        uair integer,
                                                        dair integer,
                                                        neutral_b integer,
                                                        side_b integer,
                                                        up_b integer,
                                                        down_b integer,
                                                        get_up_attack integer,
                                                        get_up_attack_slow integer,
                                                        pummel integer,
                                                        fthrow integer,
                                                        bthrow integer,
                                                        uthrow integer,
                                                        dthrow integer,
                                                        edge_attack_slow integer,
                                                        edge_attack integer,
                                                        FOREIGN KEY (match_id) REFERENCES player_stats (match_id)                                           
                                                    ); """    


CREATE_TRADES_TABLE = """ CREATE TABLE trades (
                                                            match_id integer,
                                                            player_index integer,
                                                            misc integer,
                                                            jab_1 integer,
                                                            jab_2 integer,
                                                            jab_3 integer,
                                                            rapid_jab integer,
                                                            dash_attack integer,
                                                            ftilt integer,
                                                            utilt integer,
                                                            dtilt integer,
                                                            fsmash integer,
                                                            usmash integer,
                                                            dsmash integer,
                                                            nair integer,
                                                            fair integer,
                                                            bair integer,
                                                            uair integer,
                                                            dair integer,
                                                            neutral_b integer,
                                                            side_b integer,
                                                            up_b integer,
                                                            down_b integer,
                                                            get_up_attack integer,
                                                            get_up_attack_slow integer,
                                                            pummel integer,
                                                            fthrow integer,
                                                            bthrow integer,
                                                            uthrow integer,
                                                            dthrow integer,
                                                            edge_attack_slow integer,
                                                            edge_attack integer,
                                                            FOREIGN KEY (match_id) REFERENCES player_stats (match_id)                                                   
                                                        ); """

CREATE_STOCK_PERCENTS_TABLE = """ CREATE TABLE stocks_lost (
                                                        match_id integer,
                                                        player_index integer,
                                                        stock_1 integer DEFAULT NULL,
                                                        stock_2 integer DEFAULT NULL,
                                                        stock_3 integer DEFAULT NULL,
                                                        stock_4 integer DEFAULT NULL,
                                                        FOREIGN KEY (match_id) REFERENCES player_stats (match_id)                                                     
                                                    ); """          

def create_connection(db_file):
    """ create a database connection to a SQLite database """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
        conn.cursor().execute(CREATE_MATCHES_TABLE)
        conn.cursor().execute(CREATE_PLAYER_STATS_TABLE)
        conn.cursor().execute(CREATE_NEUTRAL_WINS_TABLE)
        conn.cursor().execute(CREATE_COUNTER_HITS_TABLE)
        conn.cursor().execute(CREATE_KILL_MOVES_TABLE)
        conn.cursor().execute(CREATE_STOCK_PERCENTS_TABLE)
        conn.cursor().execute(CREATE_TRADES_TABLE)
        conn.commit()
    except Error as e:
        print(e)
    finally:
        if conn:
            conn.close()


if __name__ == '__main__':
    create_connection(r"slippi_wrapped.db")                                                                                                                                                     