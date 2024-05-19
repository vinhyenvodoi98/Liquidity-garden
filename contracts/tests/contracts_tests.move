#[test_only]
module liquidity_garden::contracts_tests {
    // uncomment this line to import the module
    // use contracts::contracts;

    const ENotImplemented: u64 = 0;

    #[test]
    fun test_contracts() {
        // pass
    }

    #[test, expected_failure(abort_code = ::liquidity_garden::contracts_tests::ENotImplemented)]
    fun test_contracts_fail() {
        abort ENotImplemented
    }
}
