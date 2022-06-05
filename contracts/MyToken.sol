//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    uint256 _totalSupply;
    constructor (uint256 totalSupply) ERC20("MyToken","MTK") {
        _totalSupply = totalSupply;
        _mint(msg.sender, _totalSupply);
        approve(msg.sender, _totalSupply);
    }

}