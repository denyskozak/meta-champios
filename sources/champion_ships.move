module champion_ships::champion_ships {
    use std::string::String;
    use sui::balance;
    use sui::coin;
    use sui::sui::SUI;

    /// Error codes
    const ChampionshipClosedError: u64 = 0x1;
    const NotAdminError: u64 = 0x2;
    const ChampionshipNotOngoingError: u64 = 0x3;
    const NoWinnersError: u64 = 0x4;
    const EmptyRewardPoolError: u64 = 0x5;
    const ChampionshipCapFullError: u64 = 0x6;
    const ChampionshipLimitAmmountdError: u64 = 0x7;
    const UserHasNoEnoughtCoinsToJoin: u64 = 0x8;
    const ChampionshipNoFreeError: u64 = 0x9;
    const ChampionshipFreeError: u64 = 0x10;

    /// The main Championship object
    public struct Championship has key {
        id: UID,
        title: String,
        description: String,
        game: String,
        team_size: u64, // 1x1, 3x3, 5x5
        entry_fee: u64,
        reward_pool: balance::Balance<SUI>,
        admin: address,
        participants: vector<address>,
        participants_limit: u64, // max amout of participants
        /// 0 = Open, 1 = Ongoing, 2 = Closed
        status: u8,
    }

    /// Create and share a new Championship object
    public fun create_championship(
        title: String,
        description: String,
        game: String,
        team_size: u64, // 1x1, 3x3, 5x5
        entry_fee: u64,
        participants_limit: u64,
        ctx: &mut TxContext,
    ) {
        let championship = Championship {
            id: object::new(ctx),
            title,
            description,
            game,
            team_size, // 1x1, 3x3, 5x5
            entry_fee,
            reward_pool: balance::zero<SUI>(),
            admin:  ctx.sender(),
            participants: vector::empty<address>(),
            participants_limit,
            status: 0
        };
        // Share the newly created object so others can mutate it
        transfer::share_object(championship)
    }

    /// Join a championship by paying the required entry fee
    public fun join_paid(
        championship: &mut Championship,
        payment: coin::Coin<SUI>,
        ctx: &mut TxContext
    ) {
        // Ensure the championship is open (status = 0)
        assert!(championship.status == 0, ChampionshipClosedError);

        // Ensure the championship has capabity
        assert!(vector::length(&championship.participants) != championship.participants_limit, ChampionshipCapFullError);
        assert!(championship.entry_fee > 0, ChampionshipFreeError);

        // Ensure the championship is open (status = 0)
        assert!(championship.entry_fee == payment.value(), UserHasNoEnoughtCoinsToJoin);

        coin::put(&mut championship.reward_pool, payment);
        vector::push_back(&mut championship.participants, ctx.sender());
    }

    public fun join_free(
        championship: &mut Championship,
        ctx: &mut TxContext
    ) {
        // Ensure the championship is open (status = 0)
        assert!(championship.status == 0, ChampionshipClosedError);

        // Ensure the championship has capabity
        assert!(vector::length(&championship.participants) != championship.participants_limit, ChampionshipCapFullError);
        assert!(championship.entry_fee == 0, ChampionshipNoFreeError);

        // Add the participant to the championship
        vector::push_back(&mut championship.participants, ctx.sender());
    }

    public fun top_up(
        championship: &mut Championship,
        payment: coin::Coin<SUI>,
    ) {
        coin::put(&mut championship.reward_pool, payment);
    }

    /// Finish the championship, pay winners, and close it (status = 2)
    public fun finish(
        championship: &mut Championship,
        winner_addresses: vector<address>,
        ctx: &mut TxContext
    ) {
        // Only the admin can finish the championship
        assert!(tx_context::sender(ctx) == championship.admin, NotAdminError);

        // Championship must be ongoing (status = 1)
        assert!(championship.status == 1, ChampionshipNotOngoingError);

        let winner_count = vector::length(&winner_addresses);
        // Ensure at least one winner is specified
        assert!(winner_count > 0, NoWinnersError);

        // Reward pool must be non-empty
        let total_rewards = championship.reward_pool.value();
        assert!(total_rewards > 0, EmptyRewardPoolError);

        // Distribute rewards equally
        let reward_per_winner = total_rewards / winner_count;
        let mut i = 0;

        while (i < winner_count) {
            let winner_addr = winner_addresses[i];
            // Turn part of the Balance<SUI> into a coin
            let reward = championship.reward_pool.split(reward_per_winner);

            let reward_coin = coin::from_balance(reward, ctx);
            // Transfer that coin to the winner
            transfer::public_transfer(reward_coin, winner_addr);
            i = i + 1;
        };

        // Close the championship
        championship.status = 2;
    }
}
