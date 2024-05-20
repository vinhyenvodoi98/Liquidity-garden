/// Module: contracts
module liquidity_garden::seed {
    use sui::url::{Self, Url};
    use std::string;
    use sui::event;

    /// An example NFT that can be minted by anybody
    public struct Seed has key, store {
        id: UID,
        /// Name for the token
        name: string::String,
        /// Description of the token
        description: string::String,
        /// URL for the token
        url: Url,

        // TO DO: thêm thuộc tính
    }

    public struct SeedEvent has copy, drop {
        // The Object ID of the NFT
        object_id: ID,
        // The creator of the NFT
        creator: address,
        // The name of the NFT
        name: string::String,
    }

    /// Create a new Seed NFT
    public entry fun mint(
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        ctx: &mut TxContext
    ) {
        let nft = Seed {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            url: url::new_unsafe_from_bytes(url)
        };

        let sender = tx_context::sender(ctx);

        event::emit(SeedEvent {
            object_id: object::uid_to_inner(&nft.id),
            creator: sender,
            name: nft.name,
        });

        transfer::public_transfer(nft, sender);
    }

    /// Update the `description` of `nft` to `new_description`
    public entry fun update_description(
        nft: &mut Seed,
        new_description: vector<u8>,
    ) {
        nft.description = string::utf8(new_description)
    }

    /// Permanently delete `nft`
    public entry fun burn(nft: Seed) {
        let Seed { id, name: _, description: _, url: _ } = nft;
        object::delete(id)
    }

    /// Get the NFT's `name`
    public fun name(nft: &Seed): &string::String {
        &nft.name
    }

    /// Get the NFT's `description`
    public fun description(nft: &Seed): &string::String {
        &nft.description
    }

    /// Get the NFT's `url`
    public fun url(nft: &Seed): &Url {
        &nft.url
    }
}

#[test_only]
module liquidity_garden::seedTests {
    use liquidity_garden::seed::{Self, Seed};
    use sui::test_scenario as ts;
    use std::string;

    #[test]
    fun mint_transfer_update() {
        let addr1 = @0xA;
        let addr2 = @0xB;
        // create the NFT
        let mut scenario = ts::begin(addr1);
        {
            seed::mint(b"test", b"a test", b"https://www.sui.io", ts::ctx(&mut scenario))
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
            seed::update_description(&mut nft, b"a new description") ;
            assert!(*string::bytes(seed::description(&nft)) == b"a new description", 0);
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