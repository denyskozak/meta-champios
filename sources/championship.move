module meta_wars::championship {
    use std::string::String;
    use sui::balance;
    use sui::coin;
    use sui::sui::{SUI};

    const MIST_PER_SUI: u64 = 1_000_000_000;

    /// Error codes
    const ChampionshipClosedError: u64 = 1;
    const ChampionshipNotOngoingError: u64 = 3;
    const NoWinnersError: u64 = 4;
    const EmptyRewardPoolError: u64 = 5;
    const ChampionshipCapFullError: u64 = 6;
    const ChampionshipLimitAmmountdError: u64 = 7;
    const UserHasNoEnoughtCoins: u64 = 8;
    const ChampionshipNoFreeError: u64 = 9;
    const ChampionshipFreeError: u64 = 10;
    const YouAreNotAdmin: u64 = 11;
    const ChampionshipOnGoing: u64 = 12;
    const NotAllMatchesComplet: u64 = 13;
    const NoMatchesLeftUseFinish: u64 = 14;

    const FounderAddress: address = @0xe683e99499e137aaa545de0ba866784f7d7ee63fb2227a4c894cdf64d784b386;

    public struct Team has drop, copy, store {
        name: String,
        leader_address: address,
        lead_nickname: String,
        teammate_nicknames: vector<String>,
    }

    /// Одна игра в сетке турнира
    public struct Match has drop, store {
        team_a: Team,
        team_b: Team,
        winner_leader_address: option::Option<address>,
        round: u64,
    }

    public struct Bracket has drop, store {
        matches: vector<Match>,
        current_round: u64,
    }

    public struct Admin has store {
        address: address,
        discord_nickname: String,
    }

    public struct Championship has key {
        id: UID,
        title: String,
        description: String,
        game_name: String,

        ticket_price: u64,
        reward_pool: balance::Balance<SUI>,

        admin: Admin,

        // communication
        discord_chat_link: String,

        // teams
        team_size: u64,
        teams_limit: u64,
        teams: vector<Team>,
        bracket: Bracket,

        status: u8,
        // 0 = Open, 1 = Ongoing, 2 = Closed
    }

    public fun create(
        title: String,
        description: String,
        game: String,
        team_size: u64,
        ticket_price: u64,
        teams_limit: u64,
        discord_chat_link: String,
        admin_discord_nickname: String,
        payment: coin::Coin<SUI>,
        ctx: &mut TxContext,
    ) {
        assert!(
            payment.value() == MIST_PER_SUI * 5,
            UserHasNoEnoughtCoins
        ); // user need to pay 10 Sui for create, temporary

        transfer::public_transfer(payment, FounderAddress); // send payment for create championship

        let bracket = Bracket {
            matches: vector::empty<Match>(),
            current_round: 0
        };

        let admin = Admin {
            address: ctx.sender(),
            discord_nickname: admin_discord_nickname
        };

        let championship = Championship {
            id: object::new(ctx),
            title,
            description,
            game_name: game,
            ticket_price,
            reward_pool: balance::zero<SUI>(),
            admin,
            discord_chat_link,
            team_size,
            teams_limit,
            teams: vector::empty<Team>(),
            bracket,
            status: 0
        };

        transfer::share_object(championship)
    }

    // Open functions
    public fun join_paid(
        championship: &mut Championship,
        team_name: String,
        lead_nickname: String,
        teammate_nicknames: vector<String>,
        payment: coin::Coin<SUI>,
        ctx: &mut TxContext
    ) {
        assert!(championship.status == 0, ChampionshipClosedError);
        assert!(vector::length(&championship.teams) < championship.teams_limit, ChampionshipCapFullError);
        assert!(championship.ticket_price > 0, ChampionshipFreeError);
        assert!(payment.value() == championship.ticket_price, UserHasNoEnoughtCoins);

        coin::put(&mut championship.reward_pool, payment);

        assert!(vector::length(&teammate_nicknames) == championship.team_size - 1, ChampionshipLimitAmmountdError);

        let team = Team {
            name: team_name,
            leader_address: ctx.sender(),
            lead_nickname,
            teammate_nicknames
        };

        vector::push_back(&mut championship.teams, team);
    }


    public fun join_free(
        championship: &mut Championship,
        team_name: String,
        lead_nickname: String,
        teammate_nicknames: vector<String>,
        ctx: &mut TxContext
    ) {
        assert!(championship.status == 0, ChampionshipClosedError);
        assert!(vector::length(&championship.teams) < championship.teams_limit, ChampionshipCapFullError);
        assert!(championship.ticket_price == 0, ChampionshipNoFreeError);

        assert!(vector::length(&teammate_nicknames) == championship.team_size - 1, ChampionshipLimitAmmountdError);

        let team = Team {
            name: team_name,
            leader_address: ctx.sender(),
            lead_nickname,
            teammate_nicknames
        };

        vector::push_back(&mut championship.teams, team);
    }

    public fun finish(
        championship: &mut Championship,
        ctx: &mut TxContext
    ) {
        assert!(championship.admin.address == ctx.sender(), YouAreNotAdmin);
        assert!(championship.status == 1, ChampionshipNotOngoingError);

        let bracket = &mut championship.bracket;
        let current_matches = &mut bracket.matches;

        let mut winner_addresses = vector::empty<address>();
        let mut i = 0;
        while (i < vector::length(current_matches)) {
            let m = &mut current_matches[i];
            assert!(!option::is_none(&m.winner_leader_address), NotAllMatchesComplet);
            vector::push_back(&mut winner_addresses, option::extract(&mut m.winner_leader_address));
            i = i + 1;
        };

        let winner_count = vector::length(&winner_addresses);
        assert!(winner_count > 0, NoWinnersError);

        let total_rewards = championship.reward_pool.value();
        assert!(total_rewards > 0, EmptyRewardPoolError);

        let reward_per_winner = total_rewards / winner_count;

        let mut i = 0;
        while (i < winner_count) {
            let winner_addr = winner_addresses[i];
            let reward = championship.reward_pool.split(reward_per_winner);
            let reward_coin = coin::from_balance(reward, ctx);
            transfer::public_transfer(reward_coin, winner_addr);
            i = i + 1;
        };

        championship.status = 2;
    }

    // On Going Functions
    public fun start_championship(championship: &mut Championship, ctx: &mut TxContext) {
        assert!(championship.admin.address == ctx.sender(), YouAreNotAdmin);
        assert!(championship.status == 0, ChampionshipOnGoing);

        let team_count = vector::length(&championship.teams);
        let mut matches = vector::empty<Match>();
        let mut i = 0;

        while (i < team_count) {
            let team_a = championship.teams[i];
            let team_b = if (i + 1 < team_count) {
                championship.teams[i + 1]
            } else {
                // win without fight
                championship.teams[i]
            };

            let game = Match {
                team_a,
                team_b,
                winner_leader_address: option::none<address>(),
                round: 1
            };
            vector::push_back(&mut matches, game);
            i = i + 2;
        };

        championship.bracket = Bracket {
            matches,
            current_round: 1
        };

        championship.status = 1;
    }

    public fun report_match_result(
        championship: &mut Championship,
        match_index: u64,
        winner_leader_address: address,
        ctx: &mut TxContext
    ) {
        assert!(championship.admin.address == ctx.sender(), YouAreNotAdmin);
        let bracket = &mut championship.bracket;
        let match_ref = &mut bracket.matches[match_index];
        option::fill(&mut match_ref.winner_leader_address, winner_leader_address);
    }


    public fun advance_to_next_round(championship: &mut Championship) {
        let bracket = &mut championship.bracket;
        let current_matches = &mut bracket.matches;
        let mut next_round = vector::empty<Match>();
        let mut winner_teams = vector::empty<Team>();

        let mut i = 0;
        while (i < vector::length(current_matches)) {
            let m = &mut current_matches[i];
            assert!(!option::is_none(&m.winner_leader_address), NotAllMatchesComplet);

            let winner_leader_address = option::extract(&mut m.winner_leader_address);

            // looking for winner team
            let mut team_i = 0;
            while (team_i < vector::length(&championship.teams)) {
                if (championship.teams[team_i].leader_address == winner_leader_address) {
                    vector::push_back(&mut winner_teams, championship.teams[team_i]);
                    break
                };

                team_i = team_i + 1;
            };

            i = i + 1;
        };

        let len = vector::length(&winner_teams);
        assert!(len != 1, NoMatchesLeftUseFinish);

        let mut j = 0;
        while (j < len) {
            let a = winner_teams[j];
            let b = if (j + 1 < len) {
                winner_teams[j + 1]
            } else {
                a // win without fight
            };
            vector::push_back(&mut next_round, Match {
                team_a: a,
                team_b: b,
                winner_leader_address: option::none<address>(),
                round: bracket.current_round + 1
            });
            j = j + 2;
        };

        bracket.matches = next_round;
        bracket.current_round = bracket.current_round + 1;
    }
}
