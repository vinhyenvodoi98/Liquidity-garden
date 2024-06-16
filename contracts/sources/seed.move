module liquidity_garden::seed {
    use liquidity_garden::oxygen::OXYGEN;
    use sui::token::{Self, Token, ActionRequest};
    use std::string;
    use sui::event;
    use sui::address;
    use sui::coin::{Self, Coin, TreasuryCap};

    const ENotAuthorized: u64 = 0;

    public struct Seed has key, store {
        id: UID,
        name: string::String,
        description: string::String,
        url: vector<string::String>,
        age: u64,
        last_checkin: u64,
        oxy_balance: u64,
    }

    public struct SeedEvent has copy, drop {
        object_id: ID,
        creator: address,
        name: string::String,
        age: u64,
        last_checkin: u64,
        oxy_balance: u64,
    }

    public struct BalanceOf has key, store { 
        id: UID,
        user: address,
    }

    public fun mint(
        name: vector<u8>,
        description: vector<u8>,
        url: vector<string::String>,
        epoch: u64,
        ctx: &mut TxContext
    ) {
        let nft = Seed {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            url: url,
            age: 0,
            last_checkin: epoch,
            oxy_balance: 0,
        };

        let sender = tx_context::sender(ctx);

        event::emit(SeedEvent {
            object_id: object::uid_to_inner(&nft.id),
            creator: sender,
            name: nft.name,
            age: nft.age,
            last_checkin: epoch,
            oxy_balance: nft.oxy_balance,
        });

        transfer::public_transfer(nft, sender);
    }

    public entry fun update_description(
        nft: &mut Seed,
        new_description: vector<u8>,
    ) {
        nft.description = string::utf8(new_description)
    }

    public fun checkin(
        treasury_cap: &mut TreasuryCap<OXYGEN>,
        nft: &mut Seed,
        epoch: u64,
        ctx: &mut TxContext,
    ) {
        assert!(epoch > nft.last_checkin + 86400, ENotAuthorized);
        nft.age = nft.age + 1;
        nft.last_checkin = nft.last_checkin + 86400;
        nft.oxy_balance = nft.oxy_balance + 1;

        let sender = tx_context::sender(ctx);

        coin::mint_and_transfer(treasury_cap, 1000000000000000000, sender, ctx)
    }

    public fun last_checkin(nft: &Seed) : &u64 {
        &nft.last_checkin
    }

    public fun get_now(ctx: &mut TxContext) : u64 {
       tx_context::epoch(ctx)
    }

    public fun age(nft: &Seed): &u64 {
        &nft.age
    }

    public fun get_oxy_balance(nft: &Seed): &u64 {
        &nft.oxy_balance
    }

    public fun name(nft: &Seed): &string::String {
        &nft.name
    }

    public fun description(nft: &Seed): &string::String {
        &nft.description
    }

    public fun url(nft: &Seed): &string::String {
        if (nft.age < 10) {
            &nft.url[0]
        } else if (nft.age < 20) {
            &nft.url[1]
        } else {
            &nft.url[2]
        }
    }
}

module liquidity_garden::oxygen {
    use sui::coin::{Self, Coin, TreasuryCap};
    use sui::token::{Self, ActionRequest, Token};
    use sui::balance::{Self, Supply, Balance};

    public struct OXYGEN has drop {}

    #[allow(unused_function)]
    /// Register the OXYGEN currency to acquire its `TreasuryCap`. Because
    /// this is a module initializer, it ensures the currency only gets
    /// registered once.
    fun init(witness: OXYGEN, ctx: &mut TxContext) {
        // Get a treasury cap for the coin and give it to the transaction sender
        let (treasury_cap, metadata) = coin::create_currency<OXYGEN>(witness, 18, b"OXYGEN", b"OXYGEN", b"Liquidity Garden", option::none(), ctx);
        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury_cap, tx_context::sender(ctx))
        // transfer::public_transfer(treasury_cap, @0x7c8a6553842c74789b470e85417499fcaf2d7ce59c829c40f237aa162548ad46)
    }

    /// Manager can mint new coins
    public entry fun mint(
        treasury_cap: &mut TreasuryCap<OXYGEN>, amount: u64, recipient: address, ctx: &mut TxContext
    ) {
        coin::mint_and_transfer(treasury_cap, amount, recipient, ctx)
    }

    /// Manager can burn coins
    public entry fun burn(treasury_cap: &mut TreasuryCap<OXYGEN>, coin: Coin<OXYGEN>) {
        coin::burn(treasury_cap, coin);
    }

    #[test_only]
    /// Wrapper of module initializer for testing
    public fun test_init(ctx: &mut TxContext) {
        init(OXYGEN {}, ctx)
    }
}
