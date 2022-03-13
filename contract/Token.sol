// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.0.0/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20{

    constructor() ERC20("Learning Animal Token", "LAC") {
        _mint(msg.sender, 1000000 * 10**uint(decimals()));
    }
} 