/// Module: contracts
module liquidity_garden::seed {
    use std::string;
    use sui::event;

    const ENotAuthorized: u64 = 0;

    public struct Seed has key, store {
        id: UID,
        name: string::String,
        description: string::String,
        url: vector<string::String>,
        age: u64,
        last_checkin: u64,
    }

    public struct SeedEvent has copy, drop {
        object_id: ID,
        creator: address,
        name: string::String,
        age: u64,
        last_checkin: u64,
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
        };

        let sender = tx_context::sender(ctx);

        event::emit(SeedEvent {
            object_id: object::uid_to_inner(&nft.id),
            creator: sender,
            name: nft.name,
            age: nft.age,
            last_checkin: epoch,
        });

        transfer::public_transfer(nft, sender);
    }

    public entry fun update_description(
        nft: &mut Seed,
        new_description: vector<u8>,
    ) {
        nft.description = string::utf8(new_description)
    }

    public entry fun checkin(
        nft: &mut Seed,
        epoch: u64,
        ctx: &TxContext,
    ) {
        assert!(epoch > nft.last_checkin + 86400, ENotAuthorized);
        nft.age = nft.age + 1;
    }

    public fun last_checkin(nft: &Seed) : &u64 {
        &nft.last_checkin
    }

    public fun get_now(ctx: &mut TxContext) : u64 {
       tx_context::epoch(ctx)
    }

    /// Permanently delete `nft`
    public entry fun burn(nft: Seed) {
        let Seed { id, name: _, description: _, url: _, age: _, last_checkin: _ } = nft;
        object::delete(id)
    }

    public fun age(nft: &Seed): &u64 {
        &nft.age
    }

    public fun name(nft: &Seed): &string::String {
        &nft.name
    }

    public fun description(nft: &Seed): &string::String {
        &nft.description
    }

    public fun url(nft: &Seed): &vector<string::String> {
        &nft.url
    }
}

#[test_only]
module liquidity_garden::seedTests {
    use liquidity_garden::seed::{Self, Seed};
    use sui::test_scenario as ts;
    use std::string;
    use std::debug;

    #[test]
    fun mint_transfer_update() {
        let addr1 = @0xA;
        let addr2 = @0xB;

        let url1 = b"https://example1.com".to_string();
        let url2 = b"https://example2.com".to_string();

        let mut url_list : vector<string::String> = vector[];
        vector::push_back(&mut url_list, url1);
        vector::push_back(&mut url_list, url2);
        // create the NFT
        let mut scenario = ts::begin(addr1);
        {
            seed::mint(b"LQG", b"Liquidity Garden", url_list, 1716905148, ts::ctx(&mut scenario))
        };
        // send it from A to B
        ts::next_tx(&mut scenario, addr1);
        {
            let nft = ts::take_from_sender<Seed>(&scenario);
            transfer::public_transfer(nft, addr2);
        };
        // update its description
        ts::next_tx(&mut scenario, addr2);
        {
            let mut nft = ts::take_from_sender<Seed>(&scenario);
            seed::update_description(&mut nft, b"LP Garden") ;
            assert!(*string::bytes(seed::description(&nft)) == b"LP Garden", 0);

            debug::print(seed::last_checkin(&nft));
            debug::print(seed::name(&nft));
            debug::print(seed::url(&nft));
            seed::checkin(&mut nft, 1716905148 + 90000, ts::ctx(&mut scenario));
            debug::print(seed::age(&nft));
            let time : u64 = seed::get_now(ts::ctx(&mut scenario));
            debug::print(&time);
            ts::return_to_sender(&scenario, nft);
        };
        // burn it
        ts::next_tx(&mut scenario, addr2);
        {
            let nft = ts::take_from_sender<Seed>(&scenario);
            seed::burn(nft)
        };
        ts::end(scenario);
    }
}
