module meta_wars::championship {
    use std::string::String;
    use sui::balance;
    use sui::coin;
    use sui::object::id;
    use sui::sui::{SUI};
    use sui::url::Url;
    const MIST_PER_SUI: u64 = 1_000_000_000;

    /// Error codes
    const ChampionshipClosedError: u64 = 0x1;
    const NotAdminError: u64 = 0x2;
    const ChampionshipNotOngoingError: u64 = 0x3;
    const NoWinnersError: u64 = 0x4;
    const EmptyRewardPoolError: u64 = 0x5;
    const ChampionshipCapFullError: u64 = 0x6;
    const ChampionshipLimitAmmountdError: u64 = 0x7;
    const UserHasNoEnoughtCoins: u64 = 0x8;
    const ChampionshipNoFreeError: u64 = 0x9;
    const ChampionshipFreeError: u64 = 0x10;
    const YouAreNotAdmin: u64 = 0x11;
    const ChampionshipOnGoing: u64 = 0x12;

    public struct Participant has drop, store {
        address: address,
        nickname: String,
        coin_amount: u64,
        join_time: u64,
    }

    /// The main Championship object
    public struct Championship has key {
        id: UID,
        title: String,
        description: String,
        game: String,
        team_size: u64,
        // 1x1, 3x3, 5x5
        entry_fee: u64,
        reward_pool: balance::Balance<SUI>,
        admin: address,
        participants: vector<Participant>,
        discord_link: String,
        participants_limit: u64,
        // max amout of participants
        /// 0 = Open, 1 = Ongoing, 2 = Closed
        status: u8,
    }

    /// Create and share a new Championship object
    public fun create(
        title: String,
        description: String,
        game: String,
        team_size: u64, // 1x1, 3x3, 5x5
        entry_fee: u64,
        participants_limit: u64,
        discord_link: String,
        payment: coin::Coin<SUI>,
        ctx: &mut TxContext,
    ) {
        assert!(payment.value() == MIST_PER_SUI, UserHasNoEnoughtCoins);

        let mut reward_pool = balance::zero<SUI>();
        coin::put(&mut reward_pool, payment);

        let championship = Championship {
            id: object::new(ctx),
            title,
            description,
            game,
            team_size, // 1x1, 3x3, 5x5
            entry_fee,
            reward_pool,
            admin: ctx.sender(),
            discord_link,
            participants: vector::empty<Participant>(),
            participants_limit,
            status: 0
        };
        // Share the newly created object so others can mutate it
        transfer::share_object(championship)
    }

    /// Join a championship by paying the required entry fee
    public fun join_paid(
        championship: &mut Championship,
        nickname: String,
        payment: coin::Coin<SUI>,
        ctx: &mut TxContext
    ) {
        // Ensure the championship is open (status = 0)
        assert!(championship.status == 0, ChampionshipClosedError);

        // Ensure the championship has capabity
        assert!(
            vector::length(&championship.participants) != championship.participants_limit,
            ChampionshipCapFullError
        );
        assert!(championship.entry_fee > 0, ChampionshipFreeError);

        // Ensure the championship is open (status = 0)
        let paymentAmount = payment.value();
        assert!(championship.entry_fee == paymentAmount, UserHasNoEnoughtCoins);

        coin::put(&mut championship.reward_pool, payment);

        let participant = Participant {
            join_time: 1,
            nickname,
            coin_amount: paymentAmount,
            address: ctx.sender()
        };
        vector::push_back(&mut championship.participants, participant);
    }

    public fun join_free(
        championship: &mut Championship,
        nickname: String,
        ctx: &mut TxContext
    ) {
        // Ensure the championship is open (status = 0)
        assert!(championship.status == 0, ChampionshipClosedError);

        // Ensure the championship has capabity
        assert!(
            vector::length(&championship.participants) != championship.participants_limit,
            ChampionshipCapFullError
        );
        assert!(championship.entry_fee == 0, ChampionshipNoFreeError);

        // Add the participant to the championship
        let participant = Participant {
            join_time: 1,
            nickname,
            coin_amount: 0,
            address: ctx.sender()
        };
        vector::push_back(&mut championship.participants, participant);
    }

    public fun top_up(
        championship: &mut Championship,
        payment: coin::Coin<SUI>,
    ) {
        coin::put(&mut championship.reward_pool, payment);
    }

    public fun change_status(
        championship: &mut Championship,
        status: u8,
    ) {
        championship.status = status;
    }

    // remove participant method

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
