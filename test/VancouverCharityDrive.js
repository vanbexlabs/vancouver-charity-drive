var VancouverCharityDrive = artifacts.require("./VancouverCharityDrive.sol");

// FUEL Crowdfund
contract('VancouverCharityDrive', function (accounts) {

    let isException = function (error) {
        let strError = error.toString();
        return strError.includes('invalid opcode') || strError.includes('invalid JUMP') || strError.includes('revert');
    };

    const vanbexAddress = accounts[0];
    const firstCompany = accounts[1];
    const secondCompany = accounts[2];
    const gasAmount = 3000000

    it("It should let the owner whitelist the company", async() => {

        const pledgeContract = await VancouverCharityDrive.new({from: vanbexAddress, gas: gasAmount});
        await pledgeContract.whitelistCompany(firstCompany, 'test', 'test@test.com', 'test', {from: vanbexAddress});
        const isWhitelisted = await pledgeContract.companies(firstCompany);
        assert.equal(isWhitelisted[0], true);
        const companyInfo = await pledgeContract.companies(firstCompany);
    });

    it("It should let not anyone whitelist a company", async() => {
        const pledgeContract = await VancouverCharityDrive.new({from: secondCompany, gas: gasAmount});
        try {
            await pledgeContract.whitelistCompany(firstCompany, 'test', 'test@test.com', 'test', {from: vanbexAddress});

        } catch (e) {
            assert(isException(e));
        }
    });

    it("It should let a whitelisted company to create a pledge", async() => {
        const pledgeContract = await VancouverCharityDrive.new({from: vanbexAddress, gas: gasAmount});
        await pledgeContract.whitelistCompany(firstCompany, 'test', 'test@test.com', 'test', {
            from: vanbexAddress,
            gas: gasAmount
        });
        await pledgeContract.createPledge(100, 'Charity', 'ETH', {
            from: firstCompany,
            gas: gasAmount
        });
        const pledge = await pledgeContract
            .getPledge
            .call(firstCompany, 0)
        assert.equal(pledge[0].toNumber(), 100)
        assert.equal(pledge[1], 'Charity')
        assert.equal(pledge[2], 'ETH')
    });

    it("It not should let a whitelisted company to create a pledge", async() => {
        const pledgeContract = await VancouverCharityDrive.new({from: vanbexAddress, gas: gasAmount});
        try {
            await pledgeContract.createPledge(100, 'Charity', 'ETH', {
                from: firstCompany,
                gas: gasAmount
            });
        } catch (e) {
            assert(isException(e))
        }
    });

    it("It should let me update my pledge", async() => {
        const pledgeContract = await VancouverCharityDrive.new({from: vanbexAddress, gas: gasAmount});
        await pledgeContract.whitelistCompany(firstCompany, 'test', 'test@test.com', 'test', {
            from: vanbexAddress,
            gas: gasAmount
        });
        await pledgeContract.createPledge(100, 'Charity', 'ETH', {
            from: firstCompany,
            gas: gasAmount
        });
        const pledge = await pledgeContract
            .getPledge
            .call(firstCompany, 0)
        assert.equal(pledge[0].toNumber(), 100)
        assert.equal(pledge[1], 'Charity')
        assert.equal(pledge[2], 'ETH')
        await pledgeContract.updatePledge(500, 'OtherCharity', 'ETH', 0, {
            from: firstCompany,
            gas: gasAmount
        });
        const updatedPledge = await pledgeContract
            .getPledge
            .call(firstCompany, 0)
        assert.equal(updatedPledge[0].toNumber(), 500)
        assert.equal(updatedPledge[1], 'OtherCharity')
        assert.equal(updatedPledge[2], 'ETH')
    });

    it("It should not let me update my pledge -- another person", async() => {
        const pledgeContract = await VancouverCharityDrive.new({from: vanbexAddress, gas: gasAmount});
        await pledgeContract.whitelistCompany(firstCompany, 'test', 'test@test.com', 'test', {
            from: vanbexAddress,
            gas: gasAmount
        });
        await pledgeContract.createPledge(100, 'Charity', 'ETH', {
            from: firstCompany,
            gas: gasAmount
        });
        const pledge = await pledgeContract
            .getPledge
            .call(firstCompany, 0)
        assert.equal(pledge[0].toNumber(), 100)
        assert.equal(pledge[1], 'Charity')
        assert.equal(pledge[2], 'ETH')
        try {
            await pledgeContract.updatePledge(500, 'Charity', 'ETH', 0, {
                from: secondCompany,
                gas: gasAmount
            });
        } catch (e) {
            assert(isException(e));
        }
    });

    it("It should not let me update my pledge -- pledge confirmed", async() => {
        const pledgeContract = await VancouverCharityDrive.new({from: vanbexAddress, gas: gasAmount});
        await pledgeContract.whitelistCompany(firstCompany, 'test', 'test@test.com', 'test', {
            from: vanbexAddress,
            gas: gasAmount
        });
        await pledgeContract.createPledge(100, 'Charity', 'ETH', {
            from: firstCompany,
            gas: gasAmount
        });
        await pledgeContract.confirmPledge(0, '0xTest', {
            from: firstCompany,
            gas: gasAmount
        });
        const pledge = await pledgeContract
            .getPledge
            .call(firstCompany, 0)
        assert.equal(pledge[0].toNumber(), 100)
        assert.equal(pledge[1], 'Charity')
        assert.equal(pledge[2], 'ETH')
        assert.equal(pledge[4], true)
        try {
            await pledgeContract.updatePledge(500, 'Charity', 'ETH', 0, {
                from: firstCompany,
                gas: gasAmount
            });
        } catch (e) {
            assert(isException(e));
        }
    });

    it("It should let me confirm my pledge", async() => {
        const pledgeContract = await VancouverCharityDrive.new({from: vanbexAddress, gas: gasAmount});
        await pledgeContract.whitelistCompany(firstCompany, 'test', 'test@test.com', 'test', {
            from: vanbexAddress,
            gas: gasAmount
        });
        await pledgeContract.createPledge(100, 'Charity', 'ETH', {
            from: firstCompany,
            gas: gasAmount
        });
        await pledgeContract.confirmPledge(0, '0xTest', {
            from: firstCompany,
            gas: gasAmount
        });
        const pledge = await pledgeContract
            .getPledge
            .call(firstCompany, 0)
        assert.equal(pledge[0].toNumber(), 100)
        assert.equal(pledge[1], 'Charity')
        assert.equal(pledge[2], 'ETH')
        assert.equal(pledge[3], '0xTest')
        assert.equal(pledge[4], true)
    });

    it("It should not let me confirm an non-existent pledge", async() => {
        const pledgeContract = await VancouverCharityDrive.new({from: vanbexAddress, gas: gasAmount});
        await pledgeContract.whitelistCompany(firstCompany, 'test', 'test@test.com', 'test', {
            from: vanbexAddress,
            gas: gasAmount
        });
        await pledgeContract.createPledge(100, 'Charity', 'ETH', {
            from: firstCompany,
            gas: gasAmount
        });
        const pledge = await pledgeContract
            .getPledge
            .call(firstCompany, 0)
        assert.equal(pledge[0].toNumber(), 100)
        assert.equal(pledge[1], 'Charity')
        assert.equal(pledge[2], 'ETH')
        try {
            await pledgeContract.confirmPledge(100, '0xTest', {
                from: firstCompany,
                gas: gasAmount
            });
        } catch (e) {
            assert(isException(e));
        }
    });

    it("It should not let me confirm a pledge that is not mine", async() => {
        const pledgeContract = await VancouverCharityDrive.new({from: vanbexAddress, gas: gasAmount});
        await pledgeContract.whitelistCompany(firstCompany, 'test', 'test@test.com', 'test', {
            from: vanbexAddress,
            gas: gasAmount
        });
        await pledgeContract.createPledge(100, 'Charity', 'ETH', {
            from: firstCompany,
            gas: gasAmount
        });
        const pledge = await pledgeContract
            .getPledge
            .call(firstCompany, 0)
        assert.equal(pledge[0].toNumber(), 100)
        assert.equal(pledge[1], 'Charity')
        assert.equal(pledge[2], 'ETH')
        try {
            await pledgeContract.confirmPledge(0, '0xTest', {
                from: secondCompany,
                gas: gasAmount
            });
        } catch (e) {
            assert(isException(e));
        }
    });

    it("It should get me the pledges", async() => {
        const pledgeContract = await VancouverCharityDrive.new({from: vanbexAddress, gas: gasAmount});
        await pledgeContract.whitelistCompany(firstCompany, 'test', 'test@test.com', 'test', {
            from: vanbexAddress,
            gas: gasAmount
        });
        await pledgeContract.whitelistCompany(secondCompany, 'test', 'test@test.com', 'test', {
            from: vanbexAddress,
            gas: gasAmount
        });
        await pledgeContract.createPledge(100, 'Charity', 'ETH', {
            from: firstCompany,
            gas: gasAmount
        });
        await pledgeContract.createPledge(500, 'Charity1', 'ETH', {
            from: firstCompany,
            gas: gasAmount
        });
        await pledgeContract.createPledge(10000, 'Charity2', 'BTC', {
            from: secondCompany,
            gas: gasAmount
        });
        const firstPledge = await pledgeContract
            .getPledge
            .call(firstCompany, 0)
        const secondPledge = await pledgeContract
            .getPledge
            .call(firstCompany, 1)
        const thirdPledge = await pledgeContract
            .getPledge
            .call(secondCompany, 0)
        assert.equal(firstPledge[0].toNumber(), 100)
        assert.equal(firstPledge[1], 'Charity')
        assert.equal(firstPledge[2], 'ETH')
        assert.equal(firstPledge[3], '')
        assert.equal(firstPledge[4], false)
        assert.equal(secondPledge[0].toNumber(), 500)
        assert.equal(secondPledge[1], 'Charity1')
        assert.equal(secondPledge[2], 'ETH')
        assert.equal(thirdPledge[0].toNumber(), 10000)
        assert.equal(thirdPledge[1], 'Charity2')
        assert.equal(thirdPledge[2], 'BTC')
    });

    it("It should get all whitelisted companies", async() => {
        const pledgeContract = await VancouverCharityDrive.new({from: vanbexAddress, gas: gasAmount});
        await pledgeContract.whitelistCompany(firstCompany, 'test', 'test@test.com', 'test', {
            from: vanbexAddress,
            gas: gasAmount
        });
        await pledgeContract.whitelistCompany(secondCompany, 'test', 'test@test.com', 'test', {
            from: vanbexAddress,
            gas: gasAmount
        });
        await pledgeContract.whitelistCompany(secondCompany, 'test', 'test@test.com', 'test', {
            from: vanbexAddress,
            gas: gasAmount
        });
        const companies = await pledgeContract
            .getAllCompanies
            .call();
        assert(companies.length === 3);
    });
});