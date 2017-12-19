# Vancouver Blockchain Charity Drive

This repository holds the smart contract used for holding all of the pledges done during the 2017 Vancouver Blockchain Charity Drive.

## How to participate


### 1. Get whitelisted

To get whitelisted, please contact patrick@vanbex.com. Please include for which company you work for, the Ethereum address that will be used for pledging
and a phone number where we can reach you. A short phone call will ensue to validate all details. From there, we will whitelist the address.

### 2. Create a pledge

Call the function `createPledge`, while passing it 3 arguments:

- An amount (of type `uint256`). This amount should be in the smallest unit of the currency. i.e. 100000000 for 1 BTC, 1000000000000000000 for 1 ETH.
- The charity name that you will be pledging to (of type `string`). i.e "Quest Food Exchange"
- The cryptocurrency that will be used (of type `string`). i.e "BTC"


From there, a new pledge will have been created, and a "PledgeCreated" event will be fired.
A company can create multiple pledges, and they are all stored in an array of pledges.

### 3. Update a pledge (optional)

One can update a pledge if necessary. You can only update a pledge if it isn't confirmed.

### 4. Confirm a pledge

Every company has the responsibility to "confirm" its own pledge, when the pledge has been fully fulfilled. 
It is recommended to donate using cryptocurrencies, and if doing so, then one can record the transaction hash.
If donating using cryptocurrency and changing to fiat, the transaction to the exchange will do. 
This confirmation flow is based on the honor system for the first iteration of this project.


In order to confirm a pledge, call the `confirmPledge` function with 2 arguments:
- Index of the pledge, of type `uint256` (if a company has 1 pledge only, then the index would be 0);
- The transaction hash of the donation, as a `string`. 

At this point, the pledge is confirmed and cannot be changed.

### Questions? 
Have any questions?

Please contact patrick@vanbex.com

## Thank you very much for pledging!



